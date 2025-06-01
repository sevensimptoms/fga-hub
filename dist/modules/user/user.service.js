"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const service_exception_1 = require("../../utils/service-exception");
const login_response_1 = require("../../utils/login-response");
const email_service_1 = require("../../utils/email-service");
const redis_1 = require("redis");
const genrandom_1 = require("../../utils/genrandom");
const content_model_1 = __importDefault(require("../../models/content.model"));
const cloudinary_1 = __importDefault(require("../../utils/cloudinary"));
const redisClient = (0, redis_1.createClient)();
redisClient.connect().catch(err => {
    console.error("Redis connection error:", err);
});
const ObjectId = require("mongoose").Types.ObjectId;
class UserService {
    constructor() {
        this.emailService = new email_service_1.EmailService();
    }
    async signUp(payload) {
        if (!payload.email || !payload.username || !payload.password) {
            throw new service_exception_1.BadRequestException("Email, username, and password are required");
        }
        const email = payload.email.toLowerCase();
        const existingUser = await user_model_1.default.findOne({
            $or: [{ email }, { username: payload.username }],
        })
            .select("email username")
            .lean();
        if (existingUser) {
            if (existingUser.email === email) {
                throw new service_exception_1.BadRequestException("An account with this email already exists");
            }
            if (existingUser.username === payload.username) {
                throw new service_exception_1.BadRequestException(`The username '${payload.username}' is taken.`);
            }
        }
        const hashedPassword = await bcryptjs_1.default.hash(payload.password, 10);
        const userData = {
            username: payload.username,
            bio: "",
            email: email,
            avatar: "",
            dob: payload.dob,
            password: hashedPassword,
            country: new ObjectId(payload.country),
            gender: payload.gender,
        };
        const user = await user_model_1.default.create(userData);
        const token = await (0, genrandom_1.generateToken)(24);
        try {
            const redisPayload = JSON.stringify({ userId: user._id, verificationToken: token });
            await redisClient.set(`verify:${token}`, redisPayload, {
                EX: 60 * 60,
            });
        }
        catch (redisErr) {
            console.error("Redis error setting verification token:", redisErr);
            throw new Error("Failed to store verification token. Please try again.");
        }
        try {
            await this.emailService.sendWelcomeEmail(user.email, {
                hash: token,
                name: user.username,
            });
        }
        catch (emailError) {
            console.error("Email send error", emailError);
        }
        return {
            user: {
                _id: user.id,
                email: user.email,
            },
            emailVerificationRequired: true,
        };
    }
    async signIn(payload) {
        // 1. Validate Input
        if (!payload.email || !payload.password) {
            throw new service_exception_1.BadRequestException("Email and password are required");
        }
        const email = payload.email.toLowerCase();
        // 2. Fetch User (Optimized)
        const user = await user_model_1.default.findOne({
            $or: [{ email: email }, { username: email }], // Use the lowercased email
        }).select('+password'); // Select the password explicitly
        if (!user) {
            throw new service_exception_1.BadRequestException("Invalid Credentials");
        }
        // 3. Validate Password
        const isPasswordValid = await bcryptjs_1.default.compare(payload.password, user.password);
        if (!isPasswordValid) {
            throw new service_exception_1.BadRequestException("Invalid Credentials");
        }
        //Remove password before returning user object
        //user.password = undefined;
        // 4. Return
        return (0, login_response_1.loginResponse)(user.id);
    }
    async uploadAndSaveContent(payload) {
        try {
            const result = await cloudinary_1.default.uploader.upload(payload.filePath, {
                folder: 'fga-hub-content',
                resource_type: payload.resourceType || 'auto',
            });
            const saved = await content_model_1.default.create({
                userId: payload.userId,
                url: result.secure_url,
                publicId: result.public_id,
                type: payload.resourceType || 'auto',
            });
            return saved;
        }
        catch (err) {
            console.error('Upload failed:', err);
            throw new Error('Content upload failed');
        }
    }
}
exports.default = UserService;
//# sourceMappingURL=user.service.js.map