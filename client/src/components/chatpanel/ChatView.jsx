import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { getChatMessages, listChats } from '../../api/chats.api';
import { clearToken, getToken } from '../../utils/token';
import { useAuth } from '../../context/AuthContext';

export default function ChatView({ chatId }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [otherUser, setOtherUser] = useState(null);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [chatList, chatMessages] = await Promise.all([
          listChats(),
          getChatMessages(chatId),
        ]);

        if (ignore) return;

        const list = Array.isArray(chatList) ? chatList : [];
        const active = list.find((c) => c.chatId === chatId);
        setOtherUser(active && typeof active.user === 'object' ? active.user : null);

        setMessages(Array.isArray(chatMessages) ? chatMessages : []);
      } catch (err) {
        if (ignore) return;
        if (err?.response?.status === 401) {
          clearToken();
          navigate('/login');
          return;
        }
        setError(err.response?.data?.message || err.message);
      } finally {
        if (ignore) return;
        setLoading(false);
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, [chatId, navigate]);

  useEffect(() => {
    const latestToken = getToken();
    if (!latestToken) return undefined;
    if (!user?.id) return undefined;

    const socket = io('http://localhost:5000', {
      auth: { token: latestToken },
    });

    socketRef.current = socket;

    socket.on('newMessage', (msg) => {
      if (!msg || String(msg.chatId) !== String(chatId)) return;
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('messageDeleted', ({ messageId }) => {
      if (!messageId) return;
      setMessages((prev) => prev.filter((m) => String(m._id) !== String(messageId)));
    });

    socket.on('connect_error', (e) => {
      setError(e?.message || 'Socket connection failed');
    });

    socket.on('error', (e) => {
      // backend sometimes emits string error
      if (typeof e === 'string') setError(e);
    });

    return () => {
      socket.off('newMessage');
      socket.off('messageDeleted');
      socket.off('error');
      socket.off('connect_error');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [chatId, user?.id, navigate]);

  useEffect(() => {
    if (!socketRef.current) return;
    if (!otherUser?._id) return;

    socketRef.current.emit('joinChat', { otherUserId: otherUser._id });
  }, [otherUser?._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed) return;
    if (!otherUser?._id) {
      setError('Unable to send: missing chat participant');
      return;
    }
    if (!socketRef.current) {
      setError('Socket not connected');
      return;
    }

    socketRef.current.emit('sendMessage', {
      chatId,
      otherUserId: otherUser._id,
      text: trimmed,
    });
  };

  const handleDelete = (messageId) => {
    if (!messageId) return;
    if (!otherUser?._id) {
      setError('Unable to delete: missing chat participant');
      return;
    }
    if (!socketRef.current) {
      setError('Socket not connected');
      return;
    }

    socketRef.current.emit('deleteMessage', {
      messageId,
      otherUserId: otherUser._id,
    });
  };

  const title = otherUser?.username || 'Chat';
  const subtitle = otherUser?.email || '';

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Loading chat...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col">
        <ChatHeader title={title} subtitle={subtitle} />
        <div className="p-4 text-red-400 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <ChatHeader title={title} subtitle={subtitle} />

      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3">
        <MessageList
          messages={messages}
          currentUserId={user?.id}
          onDeleteMessage={handleDelete}
        />
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-gray-800 p-3">
        <MessageInput onSend={handleSend} disabled={!otherUser?._id} />
      </div>
    </div>
  );
}