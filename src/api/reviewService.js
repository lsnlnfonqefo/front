const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

class ReviewService {
  async getReviews(productId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/products/${productId}/reviews`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("후기 조회에 실패했습니다.");
      return await response.json();
    } catch (error) {
      console.error("Get reviews error:", error);
      return this.mockGetReviews(productId);
    }
  }

  async createReview(productId, orderId, rating, content) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/products/${productId}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ orderId, rating, content }),
        }
      );
      if (!response.ok) throw new Error("후기 작성에 실패했습니다.");
      return await response.json();
    } catch (error) {
      console.error("Create review error:", error);
      return this.mockCreateReview(productId, orderId, rating, content);
    }
  }

  mockGetReviews(productId) {
    const reviews = JSON.parse(
      localStorage.getItem(`reviews_${productId}`) || "[]"
    );
    return Promise.resolve(reviews);
  }

  mockCreateReview(productId, orderId, rating, content) {
    const reviews = JSON.parse(
      localStorage.getItem(`reviews_${productId}`) || "[]"
    );
    const user = JSON.parse(localStorage.getItem("currentUser"));

    const newReview = {
      id: Date.now().toString(),
      productId,
      orderId,
      userId: user?.id || "1",
      userName: user?.name || "고객",
      rating,
      content,
      createdAt: new Date().toISOString(),
    };

    reviews.push(newReview);
    localStorage.setItem(`reviews_${productId}`, JSON.stringify(reviews));

    return Promise.resolve(newReview);
  }
}

export default new ReviewService();
