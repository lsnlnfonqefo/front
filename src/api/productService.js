import { AutoClassification } from "../types/product";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

class ProductService {
  /**
   * 실시간 인기 슬라이드
   * GET /api/products/popular
   */
  async getPopularProducts(offset = 0, limit = 5) {
    try {
      const params = new URLSearchParams({ offset, limit });
      const response = await fetch(
        `${API_BASE_URL}/products/popular?${params}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.items : [];
    } catch (error) {
      console.error("Error fetching popular products:", error);
      return [];
    }
  }

  /**
   * 상품 목록 조회 (필터링)
   * GET /api/products
   */
  async getProducts(filters = {}) {
    try {
      const queryParams = new URLSearchParams();

      // 필터 파라미터 구성
      if (filters.gender) queryParams.append("gender", filters.gender);
      if (filters.categories && filters.categories.length > 0) {
        filters.categories.forEach((cat) =>
          queryParams.append("category", cat)
        );
      }
      if (filters.sizes && filters.sizes.length > 0) {
        queryParams.append("size", filters.sizes.join(","));
      }
      if (filters.materials && filters.materials.length > 0) {
        queryParams.append("material", filters.materials.join(","));
      }
      if (filters.page) queryParams.append("page", filters.page);
      if (filters.limit) queryParams.append("limit", filters.limit);

      const response = await fetch(`${API_BASE_URL}/products?${queryParams}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        return data.items.map((product) => this.enrichProduct(product));
      }

      return [];
    } catch (error) {
      console.error("Error fetching products:", error);
      return this.getMockProducts(filters);
    }
  }

  /**
   * 상품 상세 조회
   * GET /api/products/:id
   */
  async getProductById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        return this.enrichProduct(data);
      }

      throw new Error("상품을 찾을 수 없습니다.");
    } catch (error) {
      console.error("Error fetching product:", error);
      // Fallback to mock
      const mockProducts = this.getMockProducts({});
      return mockProducts.find((p) => p.id === id) || null;
    }
  }

  /**
   * 상품 데이터 보강
   */
  enrichProduct(product) {
    const enriched = { ...product };

    // 자동 분류
    enriched.isNew = AutoClassification.isNew(product.createdAt);
    enriched.isOnSale = AutoClassification.isOnSale(
      product.saleStart,
      product.saleEnd
    );

    // 할인율 계산
    if (product.price && product.finalPrice) {
      enriched.discountPercentage = Math.round(
        ((product.price - product.finalPrice) / product.price) * 100
      );
    }

    // images 배열이 없으면 기본 이미지 설정
    if (!enriched.images || enriched.images.length === 0) {
      enriched.images = ["/img/slideimg1.jpg"];
    }

    return enriched;
  }

  /**
   * Mock 데이터 (개발용)
   */
  getMockProducts(filters = {}) {
    const mockProducts = [
      {
        id: "1",
        name: "남성 울 그루커 슬립온",
        description: "슬립온, 라이프스타일, 캐주얼",
        price: 170000,
        finalPrice: 119000,
        discountRate: 30,
        images: ["/img/slideimg1.jpg"],
        colors: ["black", "white", "gray", "beige"],
        sizes: [260, 265, 270, 275, 280, 285, 290, 295],
        categories: ["lifestyle", "slipon"],
        material: "wool",
        functions: ["casual", "lifestyle", "slipon"],
        model: "goorumi",
        gender: "men",
        createdAt: new Date("2024-11-01").toISOString(),
        saleStart: new Date("2024-11-01").toISOString(),
        saleEnd: new Date("2024-12-31").toISOString(),
        inStock: true,
        stockQuantity: 50,
      },
      {
        id: "2",
        name: "남성 그루커 슬립온 초콜릿",
        description: "슬립온, 라이프스타일, 캐주얼",
        price: 170000,
        finalPrice: 119000,
        discountRate: 30,
        images: ["/img/slideimg1.jpg"],
        colors: ["beige", "black", "brown"],
        sizes: [270, 275, 280, 285, 290],
        categories: ["lifestyle", "slipon"],
        material: "wool",
        functions: ["casual", "lifestyle", "slipon"],
        model: "goorumi",
        gender: "men",
        createdAt: new Date("2024-10-15").toISOString(),
        saleStart: new Date("2024-11-01").toISOString(),
        saleEnd: new Date("2024-12-31").toISOString(),
        inStock: true,
        stockQuantity: 30,
      },
      {
        id: "3",
        name: "남성 스트라이더",
        description: "러닝, 라이프스타일, 애슬레저",
        price: 200000,
        finalPrice: 140000,
        discountRate: 30,
        images: ["/img/slideimg1.jpg"],
        colors: ["black", "white", "navy", "red"],
        sizes: [260, 270, 280, 290, 300],
        categories: ["lifestyle"],
        material: "troo",
        functions: ["running", "lifestyle", "athleisure"],
        model: "runner",
        gender: "men",
        createdAt: new Date("2024-11-20").toISOString(),
        saleStart: new Date("2024-11-01").toISOString(),
        saleEnd: new Date("2024-12-31").toISOString(),
        inStock: true,
        stockQuantity: 40,
      },
      {
        id: "4",
        name: "남성 그루커",
        description: "캐주얼, 거리로 산책, 운동화 스니커즈",
        price: 150000,
        finalPrice: 105000,
        discountRate: 30,
        images: ["/img/slideimg1.jpg"],
        colors: ["black", "white", "gray", "beige"],
        sizes: [265, 270, 275, 280, 285, 290, 295],
        categories: ["lifestyle"],
        material: "troo",
        functions: ["casual", "walking", "sneakers"],
        model: "goorumi",
        gender: "men",
        createdAt: new Date("2024-09-01").toISOString(),
        saleStart: new Date("2024-11-01").toISOString(),
        saleEnd: new Date("2024-12-31").toISOString(),
        inStock: true,
        stockQuantity: 60,
      },
      {
        id: "5",
        name: "남성 러너 N2 레드트",
        description: "캐주얼, 비즈니스, 운동화 스니커즈",
        price: 220000,
        finalPrice: 154000,
        discountRate: 30,
        images: ["/img/slideimg1.jpg"],
        colors: ["white", "black"],
        sizes: [270, 280, 290],
        categories: [],
        material: "troo",
        functions: ["casual", "business", "sneakers"],
        model: "runner",
        gender: "men",
        createdAt: new Date("2024-08-01").toISOString(),
        saleStart: new Date("2024-11-01").toISOString(),
        saleEnd: new Date("2024-12-31").toISOString(),
        inStock: true,
        stockQuantity: 25,
      },
      {
        id: "6",
        name: "남성 그루커 미드 밑스플래시",
        description: "캐주얼, 거리로 산책, 운동화 스니커즈",
        price: 220000,
        finalPrice: 154000,
        discountRate: 30,
        images: ["/img/slideimg1.jpg"],
        colors: ["olive", "black", "brown"],
        sizes: [270, 275, 280, 285, 290, 295],
        categories: ["lifestyle"],
        material: "wool",
        functions: ["casual", "walking", "sneakers"],
        model: "goorumi",
        gender: "men",
        createdAt: new Date("2024-11-25").toISOString(),
        saleStart: new Date("2024-11-01").toISOString(),
        saleEnd: new Date("2024-12-31").toISOString(),
        inStock: true,
        stockQuantity: 35,
      },
      {
        id: "7",
        name: "남성 울 스트라이더",
        description: "러닝, 라이프스타일, 애슬레저",
        price: 200000,
        finalPrice: 140000,
        discountRate: 30,
        images: ["/img/slideimg1.jpg"],
        colors: ["beige", "gray"],
        sizes: [260, 270, 280, 290],
        categories: ["lifestyle"],
        material: "wool",
        functions: ["running", "lifestyle", "athleisure"],
        model: "runner",
        gender: "men",
        createdAt: new Date("2024-10-01").toISOString(),
        saleStart: new Date("2024-11-01").toISOString(),
        saleEnd: new Date("2024-12-31").toISOString(),
        inStock: true,
        stockQuantity: 45,
      },
      {
        id: "8",
        name: "남성 그루커 초콜릿",
        description: "캐주얼, 거리로 산책, 운동화 스니커즈",
        price: 170000,
        finalPrice: 119000,
        discountRate: 30,
        images: ["/img/slideimg1.jpg"],
        colors: ["white"],
        sizes: [270, 280, 290],
        categories: ["slipon"],
        material: "troo",
        functions: ["casual", "walking", "sneakers"],
        model: "goorumi",
        gender: "men",
        createdAt: new Date("2024-09-15").toISOString(),
        saleStart: new Date("2024-11-01").toISOString(),
        saleEnd: new Date("2024-12-31").toISOString(),
        inStock: true,
        stockQuantity: 20,
      },
      {
        id: "9",
        name: "남성 그루커 레니스",
        description: "캐주얼, 거리로 산책, 운동화 스니커즈",
        price: 220000,
        finalPrice: 220000,
        discountRate: 0,
        images: ["/img/slideimg1.jpg"],
        colors: ["white"],
        sizes: [270, 280, 290, 300],
        categories: [],
        material: "troo",
        functions: ["casual", "walking", "sneakers"],
        model: "goorumi",
        gender: "men",
        createdAt: new Date("2024-07-01").toISOString(),
        saleStart: null,
        saleEnd: null,
        inStock: true,
        stockQuantity: 15,
      },
    ];

    return mockProducts
      .map((product) => this.enrichProduct(product))
      .filter((product) => this.applyFilters(product, filters));
  }

  applyFilters(product, filters) {
    if (filters.gender && product.gender !== filters.gender) {
      return false;
    }

    if (filters.sizes && filters.sizes.length > 0) {
      const hasMatchingSize = filters.sizes.some((size) =>
        product.sizes.includes(parseInt(size))
      );
      if (!hasMatchingSize) return false;
    }

    if (filters.materials && filters.materials.length > 0) {
      if (!filters.materials.includes(product.material)) {
        return false;
      }
    }

    if (filters.functions && filters.functions.length > 0) {
      const hasMatchingFunction = filters.functions.some((func) =>
        product.functions.includes(func)
      );
      if (!hasMatchingFunction) return false;
    }

    if (filters.models && filters.models.length > 0) {
      if (!filters.models.includes(product.model)) {
        return false;
      }
    }

    if (filters.categories && filters.categories.length > 0) {
      const hasMatchingCategory = filters.categories.some((cat) => {
        if (cat === "new") return product.isNew;
        if (cat === "sale") return product.isOnSale;
        return product.categories.includes(cat);
      });
      if (!hasMatchingCategory) return false;
    }

    return true;
  }
}

export default new ProductService();
