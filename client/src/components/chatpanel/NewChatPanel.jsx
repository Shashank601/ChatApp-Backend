import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { clearToken, getToken } from '../../utils/token';
import { useAuth } from '../../context/AuthContext';

export default function NewChatPanel() {
  const { otherUserId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const socketRef = useRef(null);
  const navigatedRef = useRef(false);

  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  const otherUser = location.state?.otherUser || null;
  const title = otherUser?.username || 'New chat';
  const subtitle = otherUser?.email || '';

  useEffect(() => {
    const latestToken = getToken();
    if (!latestToken) {
      clearToken();
      navigate('/login');
      return undefined;
    }

    if (!user?.id) return undefined;

    const socket = io('http://localhost:5000', {
      auth: { token: latestToken },
    });

    socketRef.current = socket;

    socket.on('newMessage', (msg) => {
      if (!msg) return;

      // Once chat exists, navigate to the real chat route.
      if (!navigatedRef.current && msg.chatId) {
        navigatedRef.current = true;
        navigate(`/chat/${msg.chatId}`);
      }

      setMessages((prev) => [...prev, msg]);
    });

    socket.on('connect_error', (e) => {
      setError(e?.message || 'Socket connection failed');
    });

    socket.on('error', (e) => {
      if (typeof e === 'string') setError(e);
    });

    return () => {
      socket.off('newMessage');
      socket.off('connect_error');
      socket.off('error');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [navigate, user?.id]);

  const handleSend = (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed) return;
    if (!otherUserId) {
      setError('Missing user');
      return;
    }
    if (!socketRef.current) {
      setError('Socket not connected');
      return;
    }

    socketRef.current.emit('sendMessage', {
      chatId: null,
      otherUserId,
      text: trimmed,
    });
  };

  return (
    <div className="h-full flex flex-col">
      <ChatHeader title={title} subtitle={subtitle} />

      {error ? <div className="p-4 text-red-400 text-sm">{error}</div> : null}

      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3">
        <MessageList messages={messages} currentUserId={user?.id} />
      </div>

      <div className="border-t border-gray-800 p-3">
        <MessageInput onSend={handleSend} disabled={!otherUserId} />
      </div>
    </div>
  );
}
