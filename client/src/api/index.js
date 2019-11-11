import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000/api',
});

export const createRetro = payload => api.post(`/retro`, payload);
export const getAllRetros = userId => api.get(`/retros/${userId}`);
export const updateRetroById = (id, payload) => api.put(`/retro/${id}`, payload);
export const deleteRetroById = id => api.delete(`/retro/${id}`);
export const getRetroById = id => api.get(`/retro/${id}`);

const apis = {
    createRetro,
    getAllRetros,
    updateRetroById,
    deleteRetroById,
    getRetroById,
};

export default apis;