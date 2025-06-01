"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const contentSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    type: { type: String, required: true },
    publicId: { type: String, required: true },
    url: { type: String },
    createdAt: { type: Date }
});
const Content = (0, mongoose_1.model)('Content', contentSchema);
exports.default = Content;
//# sourceMappingURL=content.model.js.map