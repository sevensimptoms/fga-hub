"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("./user.service"));
const service_exception_1 = require("../../utils/service-exception");
class UserController {
    constructor() {
        this.signUp = async (req, res) => {
            try {
                const result = await this.userService.signUp(req.body);
                res.redirect('/registration-successful');
            }
            catch (err) {
                const errorMessage = err instanceof service_exception_1.BadRequestException
                    ? err.message
                    : 'Something went wrong during registration.';
                req.flash('error', errorMessage);
                res.redirect('/register');
            }
        };
        this.signIn = async (req, res) => {
            try {
                const result = await this.userService.signIn(req.body);
                function hasAccessToken(result) {
                    return 'accessToken' in result && 'user' in result; // Check for both accessToken and user
                }
                if (hasAccessToken(result)) {
                    // Now TypeScript knows `result` has `accessToken` and `user` properties
                    res.cookie('auth', result.accessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 24 * 60 * 60 * 1000, // 24 hours
                    });
                    // Pass user details to the render method
                    res.redirect('/dashboard'); //  Include user data for the dashboard
                }
                else {
                    //Handle scenario where access token is not present.
                    req.flash('success', 'Logged in successfully.');
                    res.redirect('/dashboard');
                }
            }
            catch (err) {
                const errorMessage = err instanceof service_exception_1.BadRequestException
                    ? err.message
                    : 'Something went wrong during login.';
                req.flash('error', errorMessage);
                res.redirect('/login');
            }
        };
        this.uploadContent = async (req, res) => {
            var _a;
            try {
                if (!req.file) {
                    return res.status(400).json({ error: 'Missing file or user context' });
                }
                // Assuming you have user ID on req.user (from auth middleware)
                const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || req.body.userId || 1234567; // fallback if no auth
                if (!userId) {
                    return res.status(400).json({ error: 'Missing user ID' });
                }
                // Content type from the form data
                const resourceType = req.body.type || 'auto';
                const savedContent = await this.userService.uploadAndSaveContent({
                    filePath: req.file.path,
                    userId,
                    resourceType,
                });
                return res.status(201).json({
                    message: 'Content uploaded successfully',
                    data: savedContent,
                });
            }
            catch (error) {
                console.error('Upload error:', error);
                return res.status(500).json({ error: 'Failed to upload content' });
            }
        };
        this.userService = new user_service_1.default();
    }
}
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map