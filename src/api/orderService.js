const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

class OrderService {
  /**
   * 주문 생성 (결제)
   * POST /api/orders
   */
  async createOrder(paymentMethod = "CARD") {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ paymentMethod }),
      });

      if (!response.ok) {
        throw new Error("주문 생성에 실패했습니다.");
      }

      const data = await response.json();
      if (data.success) {
        return data.order;
      }

      throw new Error("주문 생성에 실패했습니다.");
    } catch (error) {
      console.error("Create order error:", error);
      return this.mockCreateOrder();
    }
  }

  /**
   * 주문 내역 조회
   * GET /api/orders
   */
  async getOrders(page = 1, limit = 10) {
    try {
      const params = new URLSearchParams({ page, limit });
      const response = await fetch(`${API_BASE_URL}/orders?${params}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("주문 내역 조회에 실패했습니다.");
      }

      const data = await response.json();
      if (data.success) {
        return data.items;
      }

      return [];
    } catch (error) {
      console.error("Get orders error:", error);
      return this.mockGetOrders();
    }
  }

  /**
   * 특정 주문 상세 조회
   * GET /api/orders/:id
   */
  async getOrderById(orderId) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("주문 조회에 실패했습니다.");
      }

      const data = await response.json();
      if (data.success) {
        return data;
      }

      return null;
    } catch (error) {
      console.error("Get order error:", error);
      return null;
    }
  }

  // Mock methods
  mockCreateOrder() {
    const cart = JSON.parse(localStorage.getItem("cart") || '{"items": []}');
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");

    const newOrder = {
      id: Date.now().toString(),
      userId: "1",
      orderItems: cart.items,
      totalPrice: cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      createdAt: new Date().toISOString(),
      status: "completed",
    };

    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.setItem("cart", JSON.stringify({ items: [] }));

    return Promise.resolve(newOrder);
  }

  mockGetOrders() {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    return Promise.resolve(orders);
  }
}

export default new OrderService();
