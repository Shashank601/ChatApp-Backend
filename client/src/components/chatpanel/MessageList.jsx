import React from 'react';

export default function MessageList({ messages, currentUserId, onDeleteMessage }) {
  const formatTime = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!messages?.length) {
    return (
      <div className="text-gray-400 text-sm text-center py-6">
        No messages yet.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {messages.map((m) => {
        const isMine = String(m.sender) === String(currentUserId);
        const time = formatTime(m.createdAt);

        return (
          <div key={m._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`group max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                isMine
                  ? 'bg-blue-600 text-white rounded-br-md'
                  : 'bg-gray-800 text-gray-100 rounded-bl-md'
              }`}
            >
              <div className="whitespace-pre-wrap break-words">{m.text}</div>
              <div className="mt-1 flex items-center justify-end gap-2">
                <span className={`text-[11px] ${isMine ? 'text-blue-100' : 'text-gray-400'}`}>
                  {time}
                </span>
                {isMine ? (
                  <button
                    type="button"
                    onClick={() => onDeleteMessage?.(m._id)}
                    className="hidden group-hover:inline text-[11px] text-white/80 hover:text-white"
                  >
                    Delete
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}