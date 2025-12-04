import api from './axios';

export const reviewAPI = {
  // 리뷰 작성 (API 명세에 없으면 추후 추가)
  createReview: async (productId, rating, content) => {
    const response = await api.post(`/products/${productId}/reviews`, {
      rating,
      content,
    });
    return response.data;
  },
};
