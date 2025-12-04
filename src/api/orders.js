import api from './axios';

export const orderAPI = {
  // POST /api/orders - 주문 생성 (결제)
  createOrder: async (paymentMethod = 'CARD') => {
    const response = await api.post('/orders', { paymentMethod });
    return response.data;
  },

  // GET /api/orders - 주문 목록 조회
  getOrders: async (page = 1, limit = 10) => {
    const response = await api.get('/orders', {
      params: { page, limit },
    });
    // 응답: { success: true, data: { items: [...] } } 또는 { success: true, data: [...] }
    const data = response.data?.data;
    return Array.isArray(data) ? data : (data?.items || []);
  },

  // GET /api/orders/:orderId - 단일 주문 상세 조회
  getOrder: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data?.data || response.data;
  },
};
