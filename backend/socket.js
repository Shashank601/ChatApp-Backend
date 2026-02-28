import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './src/config/env.js';
import * as messageController from './src/services/message.service.js';
import Chat from './src/models/Chat.model.js';

// Deterministic 1-on-1 room ID
const getRoomId = (a, b) => [a, b].sort().join('_');

export function initSockets(io) {
  // Socket auth middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Auth token required'));

    try {
      const payload = jwt.verify(token, JWT_SECRET);
      socket.userId = payload.id;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.userId} (socket: ${socket.id})`);

    // Personal room for notifications / sidebar
    socket.join(`user:${socket.userId}`);

    // Join or fetch 1-on-1 chat room
    socket.on('joinChat', async ({ otherUserId }) => {
      try {
        if (!otherUserId) throw new Error('otherUserId required');

        let chat = await Chat.findOne({
          participants: { $all: [socket.userId, otherUserId] },
          $expr: { $eq: [{ $size: '$participants' }, 2] },
        });

        if (!chat) return socket.emit('error', 'Chat does not exist');

        socket.join(getRoomId(socket.userId, otherUserId));
      } catch (err) {
        socket.emit('error', err.message);
      }
    });

    // Send message
    socket.on('sendMessage', async ({ chatId, otherUserId, text }) => {
      try {
        if (!text) throw new Error('Message text required');
        if (!otherUserId) throw new Error('otherUserId required');

        const message = await messageController.sendMessage({
          chatId: chatId || null,
          senderId: socket.userId,
          receiverId: otherUserId,
          text,
        });

        const roomId = getRoomId(socket.userId, otherUserId);
        socket.join(roomId);

        // Emit to the chat room (includes sender if they are in the room)
        io.to(roomId).emit('newMessage', message);

        // Emit preview update to receiver's personal room
        const previewPayload = {
          chatId: message.chatId,
          lastMessage: message.text,
          lastMessageAt: message.createdAt,
        };

        io.to(`user:${otherUserId}`).emit('previewUpdate', previewPayload);
        io.to(`user:${socket.userId}`).emit('previewUpdate', previewPayload);
      } catch (err) {
        socket.emit('error', err.message);
        console.error(err.stack || err);
      }
    });

    // Delete message
    socket.on('deleteMessage', async ({ messageId, otherUserId }) => {
      try {
        if (!messageId) throw new Error('messageId required');
        if (!otherUserId) throw new Error('otherUserId required');

        await messageController.deleteMessage(messageId, socket.userId);

        // Emit deletion to chat room
        io.to(getRoomId(socket.userId, otherUserId)).emit('messageDeleted', {
          messageId,
        });

        // Optionally update sidebar preview if last message was deleted
        const chat = await Chat.findOne({
          participants: { $all: [socket.userId, otherUserId] },
          $expr: { $eq: [{ $size: '$participants' }, 2] },
        }).populate('latestMessage');

        if (chat?.latestMessage) {
          const previewPayload = {
            chatId: chat._id,
            lastMessage: chat.latestMessage.text || '',
            lastMessageAt: chat.latestMessage.createdAt || null,
          };

          io.to(`user:${otherUserId}`).emit('previewUpdate', previewPayload);
          io.to(`user:${socket.userId}`).emit('previewUpdate', previewPayload);
        } else {
          const previewPayload = {
            chatId: chat?._id,
            lastMessage: '',
            lastMessageAt: null,
          };

          if (previewPayload.chatId) {
            io.to(`user:${otherUserId}`).emit('previewUpdate', previewPayload);
            io.to(`user:${socket.userId}`).emit('previewUpdate', previewPayload);
          }
        }
      } catch (err) {
        socket.emit('error', err.message);
        console.error(err.stack || err);
      }
    });

    socket.on('disconnect', (reason) => {
      console.log(`Client disconnected: ${socket.userId}, reason: ${reason}`);
    });
  });
}
