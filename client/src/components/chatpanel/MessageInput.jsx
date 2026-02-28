import React, { useState } from 'react';

export default function MessageInput({ onSend, disabled }) {
  const [text, setText] = useState('');

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend?.(trimmed);
    setText('');
  };

  return (
    <div className="flex gap-2 items-end">
      <textarea
        rows={1}
        value={text}
        disabled={disabled}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder={disabled ? 'Select a user to start chatting' : 'Type a message...'}
        className="flex-1 resize-none bg-gray-900 text-white border border-gray-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="button"
        disabled={disabled || !text.trim()}
        onClick={submit}
        className={`px-4 py-2 rounded-xl text-white font-semibold ${
          disabled || !text.trim()
            ? 'bg-blue-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        Send
      </button>
    </div>
  );
}