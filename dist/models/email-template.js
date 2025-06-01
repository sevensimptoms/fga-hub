"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const emailTemplateSchema = new mongoose_1.Schema({
    type: { type: String, required: true },
    body: { type: String, required: true },
    subject: { type: String, required: true }
});
const EmailTemplate = (0, mongoose_1.model)('EmailTemplate', emailTemplateSchema);
exports.default = EmailTemplate;
// 
//# sourceMappingURL=email-template.js.map