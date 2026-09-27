import api from './axios.js';

export const updateMe = (data) => api.patch('/users/me', data).then((r) => r.data);
export const getPublicUser = (id) => api.get(`/users/${id}/public`).then((r) => r.data);