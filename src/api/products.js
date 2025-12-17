import api from './axios';

export const productAPI = {
  // GET /api/products/popular - 실시간 인기 상품
  getPopular: async (offset = 0, limit = 5) => {
    const response = await api.get('/products/popular', {
      params: { offset, limit },
    });
    // 응답: { success: true, data: { items: [...], totalCount: n } }
    return response.data?.data?.items || [];
  },

  // GET /api/products - 상품 목록 조회
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    // 응답: { success: true, data: { items: [...], totalCount: n } }
    return response.data?.data?.items || [];
  },

  // GET /api/products/:productId - 상품 상세 조회
  getProduct: async (productId) => {
    const response = await api.get(`/products/${productId}`);
    // 응답: { success: true, data: { ...product } }
    return response.data?.data || null;
  },
};
