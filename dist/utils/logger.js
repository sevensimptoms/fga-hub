"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logfmt_1 = __importDefault(require("logfmt"));
const getTimestamp = () => new Date().toISOString().replace('T', ' ').replace('Z', '');
class Logger {
    constructor(service) {
        this.name = service;
    }
    log(message, opts) {
        const logData = logfmt_1.default.stringify(Object.assign(opts, { component: this.name }));
        process.stdout.write(`[${getTimestamp()}] ${message} ${logData}` + '\n');
    }
    error(message, opts) {
        const logData = logfmt_1.default.stringify(Object.assign(opts, { component: this.name }));
        process.stderr.write(`[${getTimestamp()}] ${message} ${logData}` + '\n');
    }
}
exports.default = Logger;
//# sourceMappingURL=logger.js.map