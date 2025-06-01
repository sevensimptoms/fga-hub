"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("./user.controller"));
const multer_1 = __importDefault(require("multer"));
const controller = new user_controller_1.default();
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
router.post("/register", controller.signUp);
router.post('/login', controller.signIn);
router.post('/upload', upload.single('file'), controller.uploadContent);
exports.default = router;
//# sourceMappingURL=index.js.map