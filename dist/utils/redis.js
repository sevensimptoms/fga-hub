"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.limitCalls = limitCalls;
const redis_1 = require("redis");
const logger_1 = __importDefault(require("./logger"));
const logger = new logger_1.default('redis-client');
const options = {
    url: process.env.REDIS_URL || 'redis://0.0.0.0',
};
const redisClient = (0, redis_1.createClient)(options);
(async () => {
    redisClient.on('error', function (error) {
        logger.error('error connecting to redis: ', error === null || error === void 0 ? void 0 : error.message);
    });
    await redisClient.connect();
})();
async function limitCalls(windowId, maxCalls, minutes) {
    let resendWindow = await redisClient.get(windowId);
    if (!resendWindow) {
        resendWindow = '0';
    }
    if (Number(resendWindow) >= maxCalls) {
        return false;
    }
    await redisClient.set(windowId, Number(resendWindow) + 1, {
        EX: minutes * 60,
    });
    return true;
}
exports.default = redisClient;
//# sourceMappingURL=redis.js.map