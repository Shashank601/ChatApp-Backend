import express from 'express';
import { listChatsController, getChatMessagesController } from '../controllers/chat.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js'; // your JWT verification middleware

const router = express.Router();

// GET /chats - list all chats for logged-in user
router.get('/', verifyToken, listChatsController);

// GET /chats/:chatId/messages - get messages of a specific chat
router.get('/:chatId/messages', verifyToken, getChatMessagesController);

export default router;
