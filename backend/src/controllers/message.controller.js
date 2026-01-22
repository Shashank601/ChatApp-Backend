import { asyncHandler } from '../utils/asyncHandler.js';
import { sendMessage, deleteMessage } from '../services/message.service.js';


export const sendMessageController = asyncHandler(async (req, res) => {
  const { chatId, receiverId, text } = req.body;
  const senderId = req.user.id;

  if (!text) {
    return res.status(400).json({ message: 'text is required' });
  }

  if (!chatId && !receiverId) {
    return res.status(400).json({
      message: 'chatId or receiverId is required'
    });
  }

  const message = await sendMessage({
    chatId,
    senderId,
    receiverId,
    text
  });

  res.status(201).json(message);
});


export const deleteMessageController = asyncHandler(async (req, res) => {
  const messageId = req.params.id;
  if (!messageId) return res.status(400).json({ message: 'Message ID required' });

  await deleteMessage(messageId, req.user.id);

  res.status(200).json({ message: 'Message deleted successfully' });
});

