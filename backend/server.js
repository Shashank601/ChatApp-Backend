import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';

import { initSockets } from './socket.js';
import { CLIENT_URL, IS_PROD, JWT_SECRET, MONGO_URL, PORT } from './src/config/env.js';
import errorHandler from './src/middlewares/errorHandler.js';
import logger from './src/config/logger.js';
import routes from './src/routes/index.js';
import { connectDB } from './src/config/db.js';



const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: CLIENT_URL === '*' ? true : CLIENT_URL,
  credentials: true
}));

app.use('/api', routes);
app.use(errorHandler);

async function startServer() {
  if (!JWT_SECRET) {
    logger.error('Missing required env: JWT_SECRET');
    process.exit(1);
  }
  if (!MONGO_URL) {
    logger.error('Missing required env: MONGO_URL');
    process.exit(1);
  }

  await connectDB();   
  
  
  const httpServer = http.createServer(app);

  const io = new SocketServer(httpServer, {
    cors: {
      origin: CLIENT_URL === '*' ? true : CLIENT_URL,
      credentials: true
    }
  });

  initSockets(io);
  
  httpServer.listen(PORT, () => {
    logger.info(`Server started on port ${PORT} (${IS_PROD ? 'prod' : 'dev'})`);
  });
}


startServer();














