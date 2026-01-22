import React from 'react';

export default function ChatList({ activeChat, setActiveChat }) {
  // Mock data for now
  const chats = [
    { id: 1, name: 'John Doe', lastMessage: 'Hey there!', time: '2:30 PM' },
    { id: 2, name: 'Jane Smith', lastMessage: 'See you tomorrow', time: '1:15 PM' },
  ];
  
  return (
    <div>
      {chats.map(chat => (
        <div
          key={chat.id}
          onClick={() => setActiveChat(chat.id)}
          className={`p-4 hover:bg-gray-800 cursor-pointer border-b border-gray-700 ${
            activeChat === chat.id ? 'bg-gray-800' : ''
          }`}
        >
          <div className="flex justify-between items-start">
            <h3 className="text-white font-medium">{chat.name}</h3>
            <span className="text-gray-400 text-sm">{chat.time}</span>
          </div>
          <p className="text-gray-400 text-sm mt-1">{chat.lastMessage}</p>
        </div>
      ))}
    </div>
  );
}