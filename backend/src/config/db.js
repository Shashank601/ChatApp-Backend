import mongoose from 'mongoose';
import { MONGO_URL } from './env.js';
import logger from './logger.js';

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URL);
    logger.info('MongoDB connected');
  } catch (err) {
    const details = err?.stack || err?.message || String(err);
    logger.error(`MongoDB connection failed: ${details}`);
    process.exit(1);
  }
}
