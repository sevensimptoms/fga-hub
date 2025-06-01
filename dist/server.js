"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("./utils/logger"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || '';
// mongoose.connect(MONGO_URI)
//   .then(() => {
//     console.log('MongoDB connected');
//     app.listen(PORT, () => {
//       console.log(`Server running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error('MongoDB connection error:', err);
//   });
const logger = new logger_1.default("server");
async function bootstrap() {
    try {
        await mongoose_1.default.connect(MONGO_URI);
        logger.log("datasource initialized", { name: "FGA-HUB Mongo DB" });
    }
    catch (err) {
        logger.error("unable to initialize datasource", {
            name: "FHA-api",
            // reason: err.message,
        });
    }
    const PORT = process.env.PORT || 2003;
    const server = app_1.default.listen(PORT, () => {
        logger.log(`FGA-HUB api is running`, { PORT });
    });
}
bootstrap();
//# sourceMappingURL=server.js.map