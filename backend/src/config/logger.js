import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import winston from 'winston';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, '../../logs');

if (!fs.existsSync(logDir)) fs.mkdirSync(logDir); //creates if logs dont exist

const logger = winston.createLogger({
  level: 'info', // minimum severity to log (info+warn+error)
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)
  ),
  transports: [ // 2 channels
    new winston.transports.Console(), 
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'), 
      level: 'error'
    })
  ]
});

export default logger;


