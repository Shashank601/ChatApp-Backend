import api from './axios';

export const getChats = async (chatId) => {
    const res = await api.get(`/chats/${chatId}/messages`);
    return res.data;
}

export const friendList = async () => {
    const res = await api.get('/api/chats');
    return res.data;
}