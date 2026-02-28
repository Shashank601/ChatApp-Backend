import dotenv from 'dotenv';
dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PROD = NODE_ENV === 'production';
export const PORT = process.env.PORT || 4040;
export const CLIENT_URL = process.env.CLIENT_URL || '*';
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m"; // minutes
export const MONGO_URL = process.env.MONGO_URL;
