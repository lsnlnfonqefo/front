const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

class ReviewService {
  /**
   * 상품 리뷰 목록 조회
   * GET /api/products/:pId/reviews
   */
  async getReviews(productId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/products/${productId}/reviews`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("후기 조회에 실패했습니다.");
      }

      const data = await response.json();
      if (data.success) {
        return data.items;
      }

      return [];
    } catch (error) {
      console.error("Get reviews error:", error);
      return this.mockGetReviews(productId);
    }
  }

  /**
   * 리뷰 작성
   * POST /api/products/:pId/reviews
   */
  async createReview(productId, orderItemId, rating, comment) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/products/${productId}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ orderItemId, rating, comment }),
        }
      );

      if (!response.ok) {
        throw new Error("후기 작성에 실패했습니다.");
      }

      const data = await response.json();
      if (data.success) {
        return data.review;
      }

      throw new Error("후기 작성에 실패했습니다.");
    } catch (error) {
      console.error("Create review error:", error);
      return this.mockCreateReview(productId, orderItemId, rating, comment);
    }
  }

  /**
   * 리뷰 수정
   * PATCH /api/reviews/:rId
   */
  async updateReview(reviewId, rating, comment) {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rating, comment }),
      });

      if (!response.ok) {
        throw new Error("후기 수정에 실패했습니다.");
      }

      const data = await response.json();
      if (data.success) {
        return data.review;
      }

      throw new Error("후기 수정에 실패했습니다.");
    } catch (error) {
      console.error("Update review error:", error);
      throw error;
    }
  }

  /**
   * 리뷰 삭제
   * DELETE /api/reviews/:rId
   */
  async deleteReview(reviewId) {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("후기 삭제에 실패했습니다.");
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Delete review error:", error);
      throw error;
    }
  }

  // Mock methods
  mockGetReviews(productId) {
    const reviews = JSON.parse(
      localStorage.getItem(`reviews_${productId}`) || "[]"
    );
    return Promise.resolve(reviews);
  }

  mockCreateReview(productId, orderItemId, rating, comment) {
    const reviews = JSON.parse(
      localStorage.getItem(`reviews_${productId}`) || "[]"
    );
    const user = JSON.parse(localStorage.getItem("currentUser"));

    const newReview = {
      id: Date.now().toString(),
      productId,
      orderItemId,
      userId: user?.id || "1",
      authorName: user?.name || "고객",
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    reviews.push(newReview);
    localStorage.setItem(`reviews_${productId}`, JSON.stringify(reviews));

    return Promise.resolve(newReview);
  }
}

export default new ReviewService();
