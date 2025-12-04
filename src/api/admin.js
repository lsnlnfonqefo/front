import api from './axios';

export const adminAPI = {
  // GET /api/admin/products - 관리자용 상품 목록
  getProducts: async (params = {}) => {
    const response = await api.get('/admin/products', { params });
    // 응답: { success: true, data: { items: [...] } }
    return response.data?.data?.items || [];
  },

  // POST /api/admin/products - 상품 등록
  createProduct: async (productData) => {
    const response = await api.post('/admin/products', productData);
    return response.data;
  },

  // PATCH /api/admin/products/:productId/sizes - 가용 사이즈 변경
  updateSizes: async (productId, sizes) => {
    const response = await api.patch(`/admin/products/${productId}/sizes`, {
      sizes,
    });
    return response.data;
  },

  // PATCH /api/admin/products/:productId/discount - 할인 정책 변경
  updateDiscount: async (productId, discountRate, saleStart, saleEnd) => {
    const response = await api.patch(`/admin/products/${productId}/discount`, {
      discountRate,
      saleStart,
      saleEnd,
    });
    return response.data;
  },

  // GET /api/admin/sales - 판매현황 조회
  getSales: async (from, to) => {
    const params = {};
    if (from) params.from = from;
    if (to) params.to = to;
    const response = await api.get('/admin/sales', { params });
    // 응답: { success: true, data: { items: [...] } } 또는 { success: true, data: [...] }
    const data = response.data?.data;
    return Array.isArray(data) ? data : (data?.items || []);
  },

  // GET /api/admin/sales/:productId - 개별 상품 판매현황
  getProductSales: async (productId, from, to) => {
    const params = {};
    if (from) params.from = from;
    if (to) params.to = to;
    const response = await api.get(`/admin/sales/${productId}`, { params });
    return response.data?.data || response.data;
  },
};
