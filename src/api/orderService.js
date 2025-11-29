const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

class OrderService {
  async createOrder(cartItems) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ items: cartItems }),
      });
      if (!response.ok) throw new Error("주문 생성에 실패했습니다.");
      return await response.json();
    } catch (error) {
      console.error("Create order error:", error);
      return this.mockCreateOrder(cartItems);
    }
  }

  async getOrders() {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("주문 내역 조회에 실패했습니다.");
      return await response.json();
    } catch (error) {
      console.error("Get orders error:", error);
      return this.mockGetOrders();
    }
  }

  mockCreateOrder(cartItems) {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");

    const newOrder = {
      id: Date.now().toString(),
      userId: "1",
      items: cartItems,
      totalAmount: cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      orderDate: new Date().toISOString(),
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
