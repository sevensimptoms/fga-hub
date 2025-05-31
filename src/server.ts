import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Logger from './utils/logger';

dotenv.config();

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
  const logger = new Logger("server");

  async function bootstrap() {
    try {
      await mongoose.connect(MONGO_URI);
      logger.log("datasource initialized", { name: "FGA-HUB Mongo DB" });
    } catch (err) {
      logger.error("unable to initialize datasource", {
        name: "FHA-api",
        // reason: err.message,
      });
    }
  
    const PORT = process.env.PORT || 2003;
    const server = app.listen(PORT, () => {
      logger.log(`FGA-HUB api is running`, { PORT });
    });
  }

  bootstrap();