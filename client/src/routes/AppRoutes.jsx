// dont forget to delete from below
import { Routes, Route, Navigate } from 'react-router-dom';
import ChatPanel from '../components/chatpanel/ChatPanel';
import NewChatPanel from '../components/chatpanel/NewChatPanel';
import ChatApp from '../Layouts/ChatApp.jsx';
import Login from '../pages/Login';
import Register from '../pages/Register';
import RequireAuth from '../context/requireAuth';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/chat"
        element={
          <RequireAuth>
            <ChatApp />
          </RequireAuth>
        }
      >
        <Route index element={<div>Select a chat</div>} />
        <Route path="new/:otherUserId" element={<NewChatPanel />} />
        <Route path=":chatId" element={<ChatPanel />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
