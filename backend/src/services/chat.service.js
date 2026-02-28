import Chat from '../models/Chat.model.js';
import Message from '../models/Message.model.js';

/**
 * List all chats for a user with latestMessage populated.
 * @param {String} userId 
 * @returns {Promise<Array>}
 */
export async function listChats(userId) {

  const chats = await Chat.find({ participants: userId })
    .populate({ path: 'latestMessage', select: 'text createdAt' })
    .populate({ path: 'participants', select: 'username' })
    .select('_id participants latestMessage')
    .sort({ updatedAt: -1 })
    .exec();

  // Step 2: Map chats to remove curr user from participants
  const chatList = chats.map(chat => {
    const otherUser = chat.participants.find(p => p._id.toString() !== userId); // pick the other participant
    return {
      chatId: chat._id.toString(),
      user: otherUser || "chatToSelf",           // only the other user
      msg: {
        text: chat.latestMessage?.text || '',   // latest message for this chat
        createdAt: chat.latestMessage?.createdAt || null
      }
    };
  });

  return chatList;
}






/**
 * Get all messages in a chat.
 * @param {String} chatId 
 * @returns {Promise<Array>}
 */
export async function getChatMessages(chatId, userId) {
  const chat = await Chat.findOne({ _id: chatId, participants: userId }).select('_id');
  if (!chat) {
    const err = new Error('Chat not found');
    err.statusCode = 404;
    throw err;
  }

  return Message.find({ chatId })
    .sort({ createdAt: 1 }) // chronological
    .exec();
}


