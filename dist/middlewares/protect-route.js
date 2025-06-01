"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
// Middleware to protect the route
const protectRoute = async (req, res, next) => {
    const token = req.cookies.auth;
    if (!token) {
        req.flash('error', 'Please log in to access the dashboard.');
        return res.redirect('/login');
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key'); // Use JwtPayload
        const user = await user_model_1.default.findById(decoded.userId).select('-password').lean(); // Fetch user details
        if (!user) {
            req.flash('error', 'User not found.');
            return res.redirect('/login');
        }
        // Attach the user object to the request
        req.user = user; // Augment the Request type
        next(); // Pass control to the next middleware or route handler
    }
    catch (err) {
        // console.error("JWT Verification Error:", err);
        req.flash('error', 'Invalid or expired token. Please log in again.');
        res.clearCookie('auth'); // Clear the invalid cookie
        return res.redirect('/login');
    }
};
exports.protectRoute = protectRoute;
//# sourceMappingURL=protect-route.js.map