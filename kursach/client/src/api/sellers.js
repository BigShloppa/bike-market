import api from './axios.js';

export const getSeller = (id) => api.get(`/sellers/${id}`).then((r) => r.data);