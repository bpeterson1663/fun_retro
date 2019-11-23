import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000/api',
});

export const createRetro = payload => api.post(`/retro`, payload);
export const getAllRetros = userId => api.get(`/retros/${userId}`);
export const updateRetroById = (id, payload) => api.put(`/retro/${id}`, payload);
export const deleteRetroById = id => api.delete(`/retro/${id}`);
export const getRetroById = id => api.get(`/retro/${id}`);

export const createItem = payload => api.post(`/item`, payload);
export const getAllItems = (retroId, columnName) => api.get(`/retro/${retroId}/items/${columnName}`);
export const deleteItem = id => api.delete(`/item/${id}`);
export const updateItem = (id, payload) => api.put(`/item/${id}`, payload);

const apis = {
    createRetro,
    getAllRetros,
    updateRetroById,
    deleteRetroById,
    getRetroById,
    createItem,
    getAllItems,
    deleteItem,
    updateItem
};

export default apis;