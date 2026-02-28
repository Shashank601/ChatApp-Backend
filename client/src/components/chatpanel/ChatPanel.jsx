import React from 'react';
import { useParams } from 'react-router-dom';
import ChatView from './ChatView';

export default function ChatPanel() {
  const { chatId } = useParams();

  if (!chatId) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Select a chat
      </div>
    );
  }

  return (
    <ChatView chatId={chatId} />
  );
}