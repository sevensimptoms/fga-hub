"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_guard_1 = require("../middlewares/auth-guard");
const user_1 = __importDefault(require("./user"));
const apiRouter = (0, express_1.Router)();
const route = (0, express_1.Router)();
const jwt = (0, auth_guard_1.jwtGuard)({ credentialsRequired: true }).unless({
    path: [
        '/',
        '/v1/register',
        '/v1/login',
        '/v1/upload',
        '/v1/users/google-login',
        '/v1/confirm-email',
        '/v1/users/forgot-password',
        '/v1/users/reset-password',
        '/v1/users/resend-confirm-email',
        '/v1/users/verify-phone',
        '/v1/users/verify-otp',
        '/v1/users/verify-invite',
        '/v1/countries'
    ]
});
apiRouter.use(user_1.default);
route.use('/v1', jwt, apiRouter);
// route.use('/pub', publicRoutes);
exports.default = route;
//# sourceMappingURL=index.js.map