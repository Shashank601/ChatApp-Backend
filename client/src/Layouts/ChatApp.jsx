import React from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import { Outlet } from 'react-router-dom';


export default function ChatApp() {
  return (
    <div className="app">
      <Sidebar />
      <Outlet />
    </div>
  );
}
