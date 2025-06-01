"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = exports.loginResponse = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const service_exception_1 = require("./service-exception");
const loginResponse = async (userId) => {
    try {
        // Fetch user by ID
        const user = await user_model_1.default.findOne({ _id: userId });
        if (!user) {
            throw new service_exception_1.BadRequestException('User not found');
        }
        // Generate access token
        const accessToken = (0, exports.generateAccessToken)({ userId });
        console.log(accessToken);
        // Return user and token
        return {
            accessToken,
            user: { ...user, password: undefined }, // Exclude password from response
        };
    }
    catch (error) {
        console.error('Error in loginResponse:', error);
        throw new service_exception_1.BadRequestException('Failed to generate login response');
    }
};
exports.loginResponse = loginResponse;
const generateAccessToken = (payload) => {
    const { userId } = payload;
    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not defined');
        throw new Error('Server configuration error: Missing JWT_SECRET');
    }
    const accessToken = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: '24h',
        issuer: 'edsu_bas',
    });
    console.log('JWT generated:', accessToken); // Debugging log
    return accessToken;
};
exports.generateAccessToken = generateAccessToken;
//# sourceMappingURL=login-response.js.map