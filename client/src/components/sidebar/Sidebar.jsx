import React, { useState } from 'react';
import ChatList from './ChatList';
import NewChatButton from './NewChatButton';
import SearchUsers from './SearchUsers';

export default function Sidebar() {
  const [activeChat, setActiveChat] = useState(null);
  
  return (
    <div className="w-80 bg-gray-900 h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-white text-xl font-semibold">Chats</h2>
      </div>
      
      {/* New Chat Button */}
      <div className="p-4">
        <NewChatButton />
      </div>
      
      {/* Search Users */}
      <div className="px-4 pb-4">
        <SearchUsers />
      </div>
      
      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <ChatList activeChat={activeChat} setActiveChat={setActiveChat} />
      </div>
    </div>
  );
}