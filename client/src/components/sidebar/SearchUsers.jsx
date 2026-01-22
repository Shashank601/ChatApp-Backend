import React, { useState } from 'react';

export default function SearchUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div>
      <input
        type="text"
        placeholder="Search users..."
        className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}