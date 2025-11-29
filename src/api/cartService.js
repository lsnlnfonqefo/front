const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

class CartService {
  /**
   * 장바구니 조회
   * GET /api/cart
   */
  async getCart() {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("장바구니 조회에 실패했습니다.");
      }

      const data = await response.json();
      if (data.success) {
        return { items: data.items, totalPrice: data.totalPrice };
      }

      return { items: [] };
    } catch (error) {
      console.error("Get cart error:", error);
      return this.mockGetCart();
    }
  }

  /**
   * 장바구니에 상품 추가
   * POST /api/cart/items
   */
  async addToCart(productId, size, quantity = 1) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, size, quantity }),
      });

      if (!response.ok) {
        throw new Error("장바구니 추가에 실패했습니다.");
      }

      const data = await response.json();
      if (data.success) {
        return data.cart;
      }

      throw new Error("장바구니 추가에 실패했습니다.");
    } catch (error) {
      console.error("Add to cart error:", error);
      return this.mockAddToCart(productId, size, quantity);
    }
  }

  /**
   * 장바구니 수량 변경
   * PATCH /api/cart/items/:id
   */
  async updateQuantity(cartItemId, quantity) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/items/${cartItemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error("수량 변경에 실패했습니다.");
      }

      const data = await response.json();
      if (data.success) {
        return data.cart;
      }

      throw new Error("수량 변경에 실패했습니다.");
    } catch (error) {
      console.error("Update quantity error:", error);
      return this.mockUpdateQuantity(cartItemId, quantity);
    }
  }

  /**
   * 장바구니 상품 삭제
   * DELETE /api/cart/items/:id
   */
  async removeFromCart(cartItemId) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/items/${cartItemId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("상품 삭제에 실패했습니다.");
      }

      const data = await response.json();
      if (data.success) {
        return data.cart;
      }

      throw new Error("상품 삭제에 실패했습니다.");
    } catch (error) {
      console.error("Remove from cart error:", error);
      return this.mockRemoveFromCart(cartItemId);
    }
  }

  /**
   * 장바구니 전체 비우기
   * DELETE /api/cart
   */
  async clearCart() {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("장바구니 비우기에 실패했습니다.");
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Clear cart error:", error);
      localStorage.setItem("cart", JSON.stringify({ items: [] }));
      return true;
    }
  }

  // Mock methods
  mockGetCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || '{"items": []}');
    return Promise.resolve(cart);
  }

  mockAddToCart(productId, size, quantity) {
    const cart = JSON.parse(localStorage.getItem("cart") || '{"items": []}');

    const existingItem = cart.items.find(
      (item) => item.productId === productId && item.size === size
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        id: Date.now().toString(),
        productId,
        size,
        quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    return Promise.resolve(cart);
  }

  mockUpdateQuantity(cartItemId, quantity) {
    const cart = JSON.parse(localStorage.getItem("cart") || '{"items": []}');
    const item = cart.items.find((i) => i.id === cartItemId);

    if (item) {
      item.quantity = quantity;
      localStorage.setItem("cart", JSON.stringify(cart));
    }

    return Promise.resolve(cart);
  }

  mockRemoveFromCart(cartItemId) {
    const cart = JSON.parse(localStorage.getItem("cart") || '{"items": []}');
    cart.items = cart.items.filter((item) => item.id !== cartItemId);
    localStorage.setItem("cart", JSON.stringify(cart));
    return Promise.resolve(cart);
  }
}

export default new CartService();
