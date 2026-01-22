import { asyncHandler } from '../utils/asyncHandler.js';
import { listChats, getChatMessages } from '../services/chat.service.js';

/**
 * GET /chats
 * List all chats for the logged-in user
 */
export const listChatsController = asyncHandler(async (req, res) => {
    const userId = req.user.id; // assuming you have auth middleware that sets req.user
    const chats = await listChats(userId);
    res.json(chats);
});

/**
 * GET /chats/:chatId/messages
 * Get all messages in a chat
 */
export const getChatMessagesController = asyncHandler(async (req, res) => {
    const chatId = req.params.chatId;
    const userId = req.user.id;
    const messages = await getChatMessages(chatId, userId);
    res.json(messages);
});
