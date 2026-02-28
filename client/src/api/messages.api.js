import api from './axios';



/*
If chatId is provided → receiverId ignored

If chatId is missing → receiverId required
*/

export const sendMessage = async (data) => {
    const res = await api.post('/messages', data);
    return res.data;
}

export const deleteMessage = async (msgId) => {
    const res = await api.delete(`/messages/${msgId}`);
    return res.data;
};
