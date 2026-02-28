import api from './axios';

export const listChats = async () => {
  const res = await api.get('/chats');
  return res.data;
};

export const getChatMessages = async (chatId) => {
  const res = await api.get(`/chats/${chatId}/messages`);
  return res.data;
};