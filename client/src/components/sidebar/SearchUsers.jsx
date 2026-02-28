import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchUsers } from '../../api/users.api';
import { listChats } from '../../api/chats.api';
import { useAuth } from '../../context/AuthContext';

export default function SearchUsers({ onClose }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const trimmedQuery = useMemo(() => searchQuery.trim(), [searchQuery]);

  useEffect(() => {
    let cancelled = false;

    if (!trimmedQuery) {
      setResults([]);
      setError('');
      return () => {
        cancelled = true;
      };
    }

    const t = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const data = await searchUsers(trimmedQuery);
        if (cancelled) return;
        const list = Array.isArray(data) ? data : [];
        const filtered = user?.id ? list.filter((u) => String(u?._id) !== String(user.id)) : list;
        setResults(filtered);
      } catch (err) {
        if (cancelled) return;
        setError(err.response?.data?.message || err.message);
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [trimmedQuery, user?.id]);

  const handlePickUser = async (u) => {
    if (!u?._id) return;
    setError('');
    onClose?.();

    try {
      const chats = await listChats();
      const list = Array.isArray(chats) ? chats : [];

      const existing = list.find((c) => String(c?.user?._id) === String(u._id));
      if (existing?.chatId) {
        navigate(`/chat/${existing.chatId}`);
        return;
      }
    } catch {
      // ignore and fall back to new chat route
    }

    navigate(`/chat/new/${u._id}`, { state: { otherUser: u } });
  };

  return (
    <div className="space-y-3">
      <div>
        <input
          type="text"
          placeholder="Search users by username/email..."
          className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {error ? <div className="text-red-400 text-sm">{error}</div> : null}

      <div className="bg-gray-800/40 rounded-lg border border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-3 text-gray-400 text-sm">Searching...</div>
        ) : results.length ? (
          <div className="max-h-48 overflow-y-auto">
            {results.map((u) => (
              <button
                key={u._id}
                type="button"
                onClick={() => handlePickUser(u)}
                className="w-full text-left px-3 py-2 hover:bg-gray-700/60"
              >
                <div className="text-white text-sm font-medium">{u.username}</div>
                <div className="text-gray-400 text-xs">{u.email}</div>
              </button>
            ))}
          </div>
        ) : trimmedQuery ? (
          <div className="p-3 text-gray-400 text-sm">No users found.</div>
        ) : (
          <div className="p-3 text-gray-400 text-sm">Start typing to search.</div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-gray-300 hover:text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}