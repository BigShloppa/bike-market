import api from './axios.js';

export const listReviews = (sellerId) =>
  api.get(`/reviews/seller/${sellerId}`).then((r) => r.data);

export const upsertReview = (sellerId, data) =>
  api.post(`/reviews/seller/${sellerId}`, data).then((r) => r.data);