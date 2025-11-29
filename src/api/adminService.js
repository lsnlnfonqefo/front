const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

class AdminService {
  /**
   * 상품 관리 목록 조회
   * GET /api/admin/products
   */
  async getAdminProducts(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append("category", filters.category);
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);

      const response = await fetch(`${API_BASE_URL}/admin/products?${params}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("상품 목록 조회에 실패했습니다.");
      }

      const data = await response.json();
      if (data.success) {
        return data.items;
      }

      return [];
    } catch (error) {
      console.error("Get admin products error:", error);
      return [];
    }
  }

  /**
   * 상품 등록
   * POST /api/admin/products
   */
  async createProduct(productData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: productData.name,
          description: productData.description,
          price: productData.originalPrice,
          discountRate: productData.discountRate || 0,
          categories: productData.categories,
          sizes: productData.sizes,
          material: productData.material,
          imageUrls: productData.images,
          saleStart: productData.saleStartDate,
          saleEnd: productData.saleEndDate,
        }),
      });

      if (!response.ok) {
        throw new Error("상품 등록에 실패했습니다.");
      }

      const data = await response.json();
      if (data.success) {
        return data.product;
      }

      throw new Error("상품 등록에 실패했습니다.");
    } catch (error) {
      console.error("Create product error:", error);
      throw error;
    }
  }

  /**
   * 가용 사이즈 변경
   * PATCH /api/admin/products/:id/sizes
   */
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

      if (!response.ok) {
        throw new Error("사이즈 변경에 실패했습니다.");
      }

      const data = await response.json();
      if (data.success) {
        return data.product;
      }

      throw new Error("사이즈 변경에 실패했습니다.");
    } catch (error) {
      console.error("Update sizes error:", error);
      throw error;
    }
  }

  /**
   * 할인 정책 변경
   * PATCH /api/admin/products/:id/discount
   */
  async updateDiscount(productId, discountRate, saleStart, saleEnd) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/products/${productId}/discount`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ discountRate, saleStart, saleEnd }),
        }
      );

      if (!response.ok) {
        throw new Error("할인 정책 변경에 실패했습니다.");
      }

      const data = await response.json();
      if (data.success) {
        return data.product;
      }

      throw new Error("할인 정책 변경에 실패했습니다.");
    } catch (error) {
      console.error("Update discount error:", error);
      throw error;
    }
  }

  /**
   * 기간별 판매 현황
   * GET /api/admin/sales
   */
  async getSalesStatistics(from, to) {
    try {
      const params = new URLSearchParams();
      if (from) params.append("from", from);
      if (to) params.append("to", to);

      const response = await fetch(`${API_BASE_URL}/admin/sales?${params}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("판매 현황 조회에 실패했습니다.");
      }

      const data = await response.json();
      if (data.success) {
        return data.items;
      }

      return [];
    } catch (error) {
      console.error("Get sales statistics error:", error);
      return this.mockGetSalesStatistics();
    }
  }

  // Mock method
  mockGetSalesStatistics() {
    return Promise.resolve([
      {
        productId: "1",
        name: "남성 울 그루커 슬립온",
        totalQuantity: 50,
        totalRevenue: 5950000,
      },
      {
        productId: "2",
        name: "남성 그루커 슬립온 초콜릿",
        totalQuantity: 30,
        totalRevenue: 3570000,
      },
      {
        productId: "3",
        name: "남성 스트라이더",
        totalQuantity: 40,
        totalRevenue: 5600000,
      },
    ]);
  }
}

export default new AdminService();
