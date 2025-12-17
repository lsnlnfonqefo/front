import api from './axios';

export const cartAPI = {
  // GET /api/cart - 장바구니 조회
  getCart: async () => {
    const response = await api.get('/cart');
    // 응답: { success: true, data: { items: [...], totalPrice: n } }
    const cartData = response.data?.data || { items: [], totalPrice: 0 };
    // totalPrice를 total로 변환하여 프론트엔드에서 사용
    return {
      items: cartData.items || [],
      total: Number(cartData.totalPrice || 0)
    };
  },

  // POST /api/cart/items - 장바구니에 상품 추가
  addItem: async (productId, size, quantity = 1) => {
    const response = await api.post('/cart/items', {
      productId,
      size,
      quantity,
    });
    return response.data;
  },

  // PATCH /api/cart/items/:cartItemId - 수량 변경
  updateItem: async (cartItemId, quantity) => {
    const response = await api.patch(`/cart/items/${cartItemId}`, { quantity });
    return response.data;
  },

  // DELETE /api/cart/items/:cartItemId - 항목 삭제
  removeItem: async (cartItemId) => {
    const response = await api.delete(`/cart/items/${cartItemId}`);
    return response.data;
  },

  // DELETE /api/cart - 장바구니 비우기
  clearCart: async () => {
    const response = await api.delete('/cart');
    return response.data;
  },
};
