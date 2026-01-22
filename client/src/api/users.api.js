import api from './axios';


export const searchUsers = async (query) => {
    const res = await api.get('/users/search', {
        params: { q: query }
    });
    return res.data;
};

export const me = async () => {
    const res = await api.get('/users/me');
    return res.data;
};