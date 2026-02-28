import React from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import { Outlet } from 'react-router-dom';

export default function ChatApp() {
  return (
    <div className="h-screen w-screen flex bg-gray-950 text-white overflow-hidden">
      <aside className="shrink-0">
        <Sidebar />
      </aside>

      <main className="flex-1 min-w-0 h-full bg-gray-950">
        <Outlet />
      </main>
    </div>
  );
}
