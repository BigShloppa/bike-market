import api from './axios.js';

export const listBikes = (params) => api.get('/bikes', { params }).then((r) => r.data);
export const getBike = (id) => api.get(`/bikes/${id}`).then((r) => r.data);
export const createBike = (data) => api.post('/bikes', data).then((r) => r.data);
export const updateBike = (id, data) => api.put(`/bikes/${id}`, data).then((r) => r.data);
export const deleteBike = (id) => api.delete(`/bikes/${id}`).then((r) => r.data);
export const myBikes = () => api.get('/users/me/bikes').then((r) => r.data);

export const uploadImage = (file) => {
  const fd = new FormData();
  fd.append('image', file);
  return api
    .post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((r) => r.data);
};