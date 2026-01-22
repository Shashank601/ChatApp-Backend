import express from 'express';
import authRoutes from './auths.route.js';
import userRoutes from './users.route.js';
import messageRoutes from './messages.route.js';
import chatRoutes from './chats.route.js';

const router = express.Router();

// Auth routes (no middleware needed for register/login, optional for logout)
router.use('/auth', authRoutes);

// (protected)
router.use('/users', userRoutes);
router.use('/messages', messageRoutes);
router.use('/chats', chatRoutes);

export default router;
