import api from './axios.js';

export const listConversations = () => api.get('/messages').then((r) => r.data);
export const getUnreadCount = () => api.get('/messages/unread').then((r) => r.data);
export const getMessages = (bikeId, peerId) =>
  api.get(`/messages/${bikeId}/${peerId}`).then((r) => r.data);
export const sendMessage = (bikeId, peerId, text) =>
  api.post(`/messages/${bikeId}/${peerId}`, { text }).then((r) => r.data);