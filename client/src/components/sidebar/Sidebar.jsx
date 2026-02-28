import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChatList from './ChatList';
import NewChatButton from './NewChatButton';
import SearchUsers from './SearchUsers';

export default function Sidebar() {
  const [activeChat, setActiveChat] = useState(null);
  const { chatId } = useParams();
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (chatId) setActiveChat(chatId);
  }, [chatId]);

  const handleToggleNewChat = () => {
    setIsNewChatOpen((v) => !v);
  };

  const handleChatCreated = (chatId) => {
    setActiveChat(chatId);
    setIsNewChatOpen(false);
    setRefreshKey((k) => k + 1);
  };
  
  return (
    <div className="w-80 bg-gray-900 h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-white text-xl font-semibold">Chats</h2>
      </div>
      
      {/* New Chat Button */}
      <div className="p-4">
        <NewChatButton onClick={handleToggleNewChat} isOpen={isNewChatOpen} />
      </div>
      
      {/* Search Users */}
      {isNewChatOpen ? (
        <div className="px-4 pb-4">
          <SearchUsers onChatCreated={handleChatCreated} onClose={() => setIsNewChatOpen(false)} />
        </div>
      ) : null}
      
      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <ChatList activeChat={activeChat} setActiveChat={setActiveChat} refreshKey={refreshKey} />
      </div>
    </div>
  );
}