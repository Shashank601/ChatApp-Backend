import React from 'react';

export default function NewChatButton({ onClick, isOpen }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-white py-2 px-4 rounded-lg transition-colors ${
        isOpen ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {isOpen ? 'Close' : '+ New Chat'}
    </button>
  );
}