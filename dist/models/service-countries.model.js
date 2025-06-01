"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const serviceCountrySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    billingCurrency: { type: String, required: true },
    currencyName: { type: String, required: true },
    currencyCode: { type: String, required: true },
    callingCode: { type: String, required: true }
});
const ServiceCountry = (0, mongoose_1.model)('ServiceCountry', serviceCountrySchema);
exports.default = ServiceCountry;
//# sourceMappingURL=service-countries.model.js.map