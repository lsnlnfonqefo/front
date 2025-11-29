import { AutoClassification } from "../types/product";

// API Base URL - 환경변수로 관리
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * Product API Service
 */
class ProductService {
  /**
   * Fetch all products with optional filters
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Array>} Product list
   */
  async getProducts(filters = {}) {
    try {
      const queryParams = new URLSearchParams();

      // Build query string from filters
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          queryParams.append(key, value.join(","));
        } else if (value !== null && value !== undefined && value !== "") {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(
        `${API_BASE_URL}/products?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Apply auto-classification on client side
      return data.map((product) => this.enrichProduct(product));
    } catch (error) {
      console.error("Error fetching products:", error);
      // Return mock data for development
      return this.getMockProducts(filters);
    }
  }

  /**
   * Fetch single product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Object>} Product details
   */
  async getProductById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const product = await response.json();
      return this.enrichProduct(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  }

  /**
   * Enrich product with auto-classifications
   * @param {Object} product - Raw product data
   * @returns {Object} Enriched product
   */
  enrichProduct(product) {
    const enriched = { ...product };

    // Auto-classify as "New"
    enriched.isNew = AutoClassification.isNew(product.createdAt);

    // Auto-classify as "On Sale"
    enriched.isOnSale = AutoClassification.isOnSale(
      product.saleStartDate,
      product.saleEndDate
    );

    // Calculate discount percentage
    if (product.originalPrice && product.price) {
      enriched.discountPercentage = Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      );
    }

    return enriched;
  }

  /**
   * Mock data for development (DB 연동 전까지 사용)
   */
  getMockProducts(filters = {}) {
    const mockProducts = [
      {
        id: "1",
        name: "남성 울 그루커 슬립온",
        description: "슬립온, 라이프스타일, 캐주얼",
        price: 119000,
        originalPrice: 170000,
        images: ["/img/slideimg1.jpg"],
        colors: ["black", "white", "gray", "beige"],
        sizes: [260, 265, 270, 275, 280, 285, 290, 295],
        categories: ["lifestyle", "slipon"],
        material: "wool",
        functions: ["casual", "lifestyle", "slipon"],
        model: "goorumi",
        gender: "men",
        createdAt: new Date("2024-11-01"),
        saleStartDate: new Date("2024-11-01"),
        saleEndDate: new Date("2024-12-31"),
        inStock: true,
        stockQuantity: 50,
      },
      {
        id: "2",
        name: "남성 그루커 슬립온 초콜릿",
        description: "슬립온, 라이프스타일, 캐주얼",
        price: 119000,
        originalPrice: 170000,
        images: ["/img/slideimg1.jpg"],
        colors: ["beige", "black", "brown"],
        sizes: [270, 275, 280, 285, 290],
        categories: ["lifestyle", "slipon"],
        material: "wool",
        functions: ["casual", "lifestyle", "slipon"],
        model: "goorumi",
        gender: "men",
        createdAt: new Date("2024-10-15"),
        saleStartDate: new Date("2024-11-01"),
        saleEndDate: new Date("2024-12-31"),
        inStock: true,
        stockQuantity: 30,
      },
      {
        id: "3",
        name: "남성 스트라이더",
        description: "러닝, 라이프스타일, 애슬레저",
        price: 140000,
        originalPrice: 200000,
        images: ["/img/slideimg1.jpg"],
        colors: ["black", "white", "navy", "red"],
        sizes: [260, 270, 280, 290, 300],
        categories: ["lifestyle"],
        material: "troo",
        functions: ["running", "lifestyle", "athleisure"],
        model: "runner",
        gender: "men",
        createdAt: new Date("2024-11-20"),
        saleStartDate: new Date("2024-11-01"),
        saleEndDate: new Date("2024-12-31"),
        inStock: true,
        stockQuantity: 40,
      },
      {
        id: "4",
        name: "남성 그루커",
        description: "캐주얼, 거리로 산책, 운동화 스니커즈",
        price: 105000,
        originalPrice: 150000,
        images: ["/img/slideimg1.jpg"],
        colors: ["black", "white", "gray", "beige"],
        sizes: [265, 270, 275, 280, 285, 290, 295],
        categories: ["lifestyle"],
        material: "troo",
        functions: ["casual", "walking", "sneakers"],
        model: "goorumi",
        gender: "men",
        createdAt: new Date("2024-09-01"),
        saleStartDate: new Date("2024-11-01"),
        saleEndDate: new Date("2024-12-31"),
        inStock: true,
        stockQuantity: 60,
      },
      {
        id: "5",
        name: "남성 러너 N2 레드트",
        description: "캐주얼, 비즈니스, 운동화 스니커즈",
        price: 154000,
        originalPrice: 220000,
        images: ["/img/slideimg1.jpg"],
        colors: ["white", "black"],
        sizes: [270, 280, 290],
        categories: [],
        material: "troo",
        functions: ["casual", "business", "sneakers"],
        model: "runner",
        gender: "men",
        createdAt: new Date("2024-08-01"),
        saleStartDate: new Date("2024-11-01"),
        saleEndDate: new Date("2024-12-31"),
        inStock: true,
        stockQuantity: 25,
      },
      {
        id: "6",
        name: "남성 그루커 미드 밑스플래시",
        description: "캐주얼, 거리로 산책, 운동화 스니커즈",
        price: 154000,
        originalPrice: 220000,
        images: ["/img/slideimg1.jpg"],
        colors: ["olive", "black", "brown"],
        sizes: [270, 275, 280, 285, 290, 295],
        categories: ["lifestyle"],
        material: "wool",
        functions: ["casual", "walking", "sneakers"],
        model: "goorumi",
        gender: "men",
        createdAt: new Date("2024-11-25"),
        saleStartDate: new Date("2024-11-01"),
        saleEndDate: new Date("2024-12-31"),
        inStock: true,
        stockQuantity: 35,
      },
      {
        id: "7",
        name: "남성 울 스트라이더",
        description: "러닝, 라이프스타일, 애슬레저",
        price: 140000,
        originalPrice: 200000,
        images: ["/img/slideimg1.jpg"],
        colors: ["beige", "gray"],
        sizes: [260, 270, 280, 290],
        categories: ["lifestyle"],
        material: "wool",
        functions: ["running", "lifestyle", "athleisure"],
        model: "runner",
        gender: "men",
        createdAt: new Date("2024-10-01"),
        saleStartDate: new Date("2024-11-01"),
        saleEndDate: new Date("2024-12-31"),
        inStock: true,
        stockQuantity: 45,
      },
      {
        id: "8",
        name: "남성 그루커 초콜릿",
        description: "캐주얼, 거리로 산책, 운동화 스니커즈",
        price: 119000,
        originalPrice: 170000,
        images: ["/img/slideimg1.jpg"],
        colors: ["white"],
        sizes: [270, 280, 290],
        categories: ["slipon"],
        material: "troo",
        functions: ["casual", "walking", "sneakers"],
        model: "goorumi",
        gender: "men",
        createdAt: new Date("2024-09-15"),
        saleStartDate: new Date("2024-11-01"),
        saleEndDate: new Date("2024-12-31"),
        inStock: true,
        stockQuantity: 20,
      },
      {
        id: "9",
        name: "남성 그루커 레니스",
        description: "캐주얼, 거리로 산책, 운동화 스니커즈",
        price: 154000,
        originalPrice: 220000,
        images: ["/img/slideimg1.jpg"],
        colors: ["white"],
        sizes: [270, 280, 290, 300],
        categories: [],
        material: "troo",
        functions: ["casual", "walking", "sneakers"],
        model: "goorumi",
        gender: "men",
        createdAt: new Date("2024-07-01"),
        saleStartDate: null,
        saleEndDate: null,
        inStock: true,
        stockQuantity: 15,
      },
    ];

    // Apply client-side filtering for mock data
    return mockProducts
      .map((product) => this.enrichProduct(product))
      .filter((product) => this.applyFilters(product, filters));
  }

  /**
   * Apply filters to product (for mock data)
   */
  applyFilters(product, filters) {
    // Gender filter
    if (filters.gender && product.gender !== filters.gender) {
      return false;
    }

    // Size filter
    if (filters.sizes && filters.sizes.length > 0) {
      const hasMatchingSize = filters.sizes.some((size) =>
        product.sizes.includes(parseInt(size))
      );
      if (!hasMatchingSize) return false;
    }

    // Material filter
    if (filters.materials && filters.materials.length > 0) {
      if (!filters.materials.includes(product.material)) {
        return false;
      }
    }

    // Function filter
    if (filters.functions && filters.functions.length > 0) {
      const hasMatchingFunction = filters.functions.some((func) =>
        product.functions.includes(func)
      );
      if (!hasMatchingFunction) return false;
    }

    // Model filter
    if (filters.models && filters.models.length > 0) {
      if (!filters.models.includes(product.model)) {
        return false;
      }
    }

    // Category filter
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
