const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

class AdminService {
  async createProduct(productData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(productData),
      });
      if (!response.ok) throw new Error("상품 등록에 실패했습니다.");
      return await response.json();
    } catch (error) {
      console.error("Create product error:", error);
      throw error;
    }
  }

  async updateAvailableSizes(productId, sizes) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/products/${productId}/sizes`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ sizes }),
        }
      );
      if (!response.ok) throw new Error("사이즈 변경에 실패했습니다.");
      return await response.json();
    } catch (error) {
      console.error("Update sizes error:", error);
      throw error;
    }
  }

  async updateDiscount(productId, saleStartDate, saleEndDate, discountRate) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/products/${productId}/discount`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ saleStartDate, saleEndDate, discountRate }),
        }
      );
      if (!response.ok) throw new Error("할인 정책 변경에 실패했습니다.");
      return await response.json();
    } catch (error) {
      console.error("Update discount error:", error);
      throw error;
    }
  }

  async getSalesStatistics(startDate, endDate) {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await fetch(
        `${API_BASE_URL}/admin/sales?${params.toString()}`,
        { credentials: "include" }
      );
      if (!response.ok) throw new Error("판매 현황 조회에 실패했습니다.");
      return await response.json();
    } catch (error) {
      console.error("Get sales statistics error:", error);
      return this.mockGetSalesStatistics();
    }
  }

  mockGetSalesStatistics() {
    return Promise.resolve([
      {
        productId: "1",
        productName: "남성 울 그루커 슬립온",
        salesCount: 50,
        revenue: 5950000,
      },
      {
        productId: "2",
        productName: "남성 그루커 슬립온 초콜릿",
        salesCount: 30,
        revenue: 3570000,
      },
      {
        productId: "3",
        productName: "남성 스트라이더",
        salesCount: 40,
        revenue: 5600000,
      },
    ]);
  }
}

export default new AdminService();
