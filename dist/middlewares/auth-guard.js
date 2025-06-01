"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtGuard = void 0;
const express_jwt_1 = require("express-jwt");
const jwtGuard = (params) => (0, express_jwt_1.expressjwt)({
    secret: process.env.JWT_SECRET || "SECRET",
    algorithms: ['HS256'],
    credentialsRequired: params.credentialsRequired,
});
exports.jwtGuard = jwtGuard;
//# sourceMappingURL=auth-guard.js.map