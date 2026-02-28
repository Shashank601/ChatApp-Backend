import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { listChats } from '../../api/chats.api';
import { getToken } from '../../utils/token';

export default function ChatList({ activeChat, setActiveChat, refreshKey }) {
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await listChats();
        if (ignore) return;
        setChats(Array.isArray(data) ? data : []);
      } catch (err) {
        if (ignore) return;
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
  }, [refreshKey]);

  useEffect(() => {
    const latestToken = getToken();
    if (!latestToken) return undefined;

    const socket = io('http://localhost:5000', {
      auth: { token: latestToken },
    });

    socketRef.current = socket;

    const refreshChats = async () => {
      try {
        const data = await listChats();
        setChats(Array.isArray(data) ? data : []);
      } catch {
        // ignore
      }
    };

    socket.on('previewUpdate', (payload) => {
      const { chatId, lastMessage, lastMessageAt } = payload || {};
      if (!chatId) return;

      setChats((prev) => {
        const idx = prev.findIndex((c) => c.chatId === chatId);
        if (idx === -1) {
          refreshChats();
          return prev;
        }

        const next = [...prev];
        next[idx] = {
          ...next[idx],
          msg: {
            ...(next[idx].msg || {}),
            text: lastMessage ?? next[idx]?.msg?.text ?? '',
            createdAt: lastMessageAt ?? next[idx]?.msg?.createdAt ?? null,
          },
        };

        return next;
      });
    });

    return () => {
      socket.off('previewUpdate');
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const formatTime = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSelect = (chat) => {
    if (!chat?.chatId) return;
    setActiveChat(chat.chatId);
    navigate(`/chat/${chat.chatId}`);
  };

  if (loading) {
    return (
      <div className="p-4 text-gray-400 text-sm">
        Loading chats...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  if (!chats.length) {
    return (
      <div className="p-4 text-gray-400 text-sm">
        No chats yet.
      </div>
    );
  }

  return (
    <div>
      {chats.map((chat) => {
        const displayName =
          typeof chat.user === 'string'
            ? chat.user
            : chat.user?.username || 'Unknown';

        const lastText = chat.msg?.text || '';
        const time = formatTime(chat.msg?.createdAt);
        const isActive = activeChat === chat.chatId;

        return (
          <div
            key={chat.chatId}
            onClick={() => handleSelect(chat)}
            className={`p-4 hover:bg-gray-800 cursor-pointer border-b border-gray-700 ${
              isActive ? 'bg-gray-800' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-white font-medium truncate pr-2">{displayName}</h3>
              <span className="text-gray-400 text-sm shrink-0">{time}</span>
            </div>
            <p className="text-gray-400 text-sm mt-1 truncate">{lastText}</p>
          </div>
        );
      })}
    </div>
  );
}