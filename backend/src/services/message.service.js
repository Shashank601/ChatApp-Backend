import mongoose from 'mongoose';
import Chat from '../models/Chat.model.js';
import Message from '../models/Message.model.js';

export async function sendMessage ({chatId, senderId, receiverId, text}) {
  let chat;

  // Case 1: chat already exists
  if (chatId) {
    chat = await Chat.findById(chatId);
    if (!chat) {
      const err = new Error('Chat not found');
      err.statusCode = 404;
      throw err;
    }
  }

  // Case 2: first message => resolve or create chat
  if (!chat) {
    if (!receiverId) {
      const err = new Error('receiverId required to create chat');
      err.statusCode = 400;
      throw err;
    }

    chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
      $expr: { $eq: [{ $size: '$participants' }, 2] }
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [senderId, receiverId]
      });
    }
  }

  // Create message
  const message = await Message.create({
    chatId: chat._id,
    sender: senderId,
    text
  });

  // Update chat preview
  chat.latestMessage = message._id;
  await chat.save();

  return message;
};

/**
 * Deletes a message by ID if the requester is the sender,
 * and updates the chat's latestMessage if needed.
 */
export async function deleteMessage(messageId, userId) {
  // 1. Find the message
  const message = await Message.findById(messageId);
  if (!message) {
    const err = new Error('Message not found');
    err.statusCode = 404;
    throw err;
  }

  // 2. Ownership check
  if (message.sender.toString() !== userId) {
    const err = new Error('Not allowed to delete this message');
    err.statusCode = 403;
    throw err;
  }

  const chatId = message.chatId;

  // 3. Delete the message
  await Message.findByIdAndDelete(messageId);

  // 4. Update chat latest message if needed
  const chat = await Chat.findById(chatId);
  if (chat.latestMessage?.toString() === messageId.toString()) {
    const lastMessage = await Message.find({ chatId })
      .sort({ createdAt: -1 })
      .limit(1);

    chat.latestMessage = lastMessage[0]?._id || null;
    await chat.save();
  }
}
