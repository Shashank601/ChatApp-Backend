import React from 'react';

export default function ChatHeader({ title, subtitle }) {
  return (
    <div className="h-14 px-4 flex items-center justify-between border-b border-gray-800 bg-gray-950">
      <div className="min-w-0">
        <div className="text-white font-semibold truncate">{title}</div>
        {subtitle ? (
          <div className="text-xs text-gray-400 truncate">{subtitle}</div>
        ) : null}
      </div>
    </div>
  );
}
