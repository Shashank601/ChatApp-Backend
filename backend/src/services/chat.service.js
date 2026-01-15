import Chat from '../models/Chat.model.js';
import Message from '../models/Message.model.js';

/**
 * List all chats for a user with latestMessage populated.
 * @param {String} userId 
 * @returns {Promise<Array>}
 */
export async function listChats(userId) {
    /// Step 1: Find all chats for the user
    const chatsQuery = Chat.find({ participants: userId });

    // Step 2: Populate latestMessage
    chatsQuery.populate({ path: 'latestMessage', select: 'text createdAt' });

    // Step 3: Populate participants
    chatsQuery.populate({ path: 'participants', select: 'username' });

    // Step 4: Select only needed fields
    chatsQuery.select('_id participants latestMessage');

    // Step 5: Sort by updatedAt descending
    chatsQuery.sort({ updatedAt: -1 });

    // Step 6: Execute the query
    const chats = await chatsQuery.exec();

    return chats;

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


