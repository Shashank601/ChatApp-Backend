import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './src/config/env.js';
import * as messageController from './src/controllers/message.controller.js';
import Chat from './src/models/Chat.model.js';

// Deterministic 1-on-1 room ID
const getRoomId = (a, b) => [a, b].sort().join('_');

export function initSockets(io) {
  // Socket auth
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

    //join personal room for sidebar / notifications
    socket.join(`user:${socket.userId}`);

    // Join 1-on-1 chat room
    socket.on('joinChat', async ({ otherUserId }) => {
      try {
        const chat = await Chat.findOne({
          participants: { $all: [socket.userId, otherUserId] },
        });

        if (!chat) return socket.emit('error', 'Chat does not exist');

        socket.join(getRoomId(socket.userId, otherUserId));
      } catch (err) {
        socket.emit('error', err.message);
      }
    });

    // Send message
    socket.on('sendMessage', async ({ otherUserId, text }) => {
      try {
        const req = {
          body: { chatId: null, receiverId: otherUserId, text },
          user: { id: socket.userId }
        };

        const res = { 
          json: (data) => {
            // emit to chat room (existing logic)
            io.to(getRoomId(socket.userId, otherUserId)).emit('newMessage', data);

            // NEW: emit to receiver's personal room for sidebar preview
            io.to(`user:${otherUserId}`).emit('previewUpdate', {
              chatId: data.chatId,
              lastMessage: data.text,
              lastMessageAt: data.createdAt || new Date()
            });
          } 
        };

        await messageController.sendMessageController(req, res);
      } catch (err) {
        console.error(err.stack || err);
      }
    });

    // Delete message
    socket.on('deleteMessage', async ({ messageId, otherUserId }) => {
      try {
        const req = { params: { id: messageId }, user: { id: socket.userId } };
        const res = { 
          json: () => io.to(getRoomId(socket.userId, otherUserId)).emit('messageDeleted', { messageId }) 
        };

        await messageController.deleteMessageController(req, res);
      } catch (err) {
        console.error(err.stack || err);
      }
    });

    socket.on('disconnect', (reason) => {
      console.log(`Client disconnected: ${socket.userId}, reason: ${reason}`);
    });
  });
}
