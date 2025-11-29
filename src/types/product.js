/**
 * Product data structure for DB schema
 */
export const ProductSchema = {
  id: "string",
  name: "string",
  description: "string",
  price: "number",
  originalPrice: "number",
  discount: "number",
  images: ["string"],
  colors: ["string"],
  sizes: ["number"],
  categories: ["string"], // Multi-category support
  material: "string",
  functions: ["string"],
  model: "string",
  gender: "string", // 'men' | 'women' | 'unisex'
  createdAt: "Date",
  updatedAt: "Date",
  saleStartDate: "Date | null",
  saleEndDate: "Date | null",
  inStock: "boolean",
  stockQuantity: "number",
};

/**
 * Auto-classification rules
 */
export const AutoClassification = {
  isNew: (createdAt) => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return new Date(createdAt) >= oneMonthAgo;
  },

  isOnSale: (saleStartDate, saleEndDate) => {
    const now = new Date();
    if (!saleStartDate || !saleEndDate) return false;
    return now >= new Date(saleStartDate) && now <= new Date(saleEndDate);
  },
};

/**
 * User roles
 */
export const UserRole = {
  CUSTOMER: "customer",
  ADMINISTRATOR: "administrator",
};

/**
 * Filter options
 */
export const FilterOptions = {
  sizes: [260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310],
  materials: [
    { id: "troo", label: "가볍고 시원한 troo" },
    { id: "wool", label: "부드럽고 따뜻한 wool" },
  ],
  functions: [
    { id: "business", label: "비즈니스" },
    { id: "casual", label: "캐주얼" },
    { id: "walking", label: "거리로 산책" },
    { id: "running", label: "러닝" },
    { id: "slipon", label: "슬립온" },
    { id: "sneakers", label: "운동화 스니커즈" },
    { id: "lifestyle", label: "라이프스타일" },
    { id: "athleisure", label: "애슬레저" },
  ],
  models: [
    { id: "runner", label: "러너" },
    { id: "dasher", label: "대셔" },
    { id: "goorumi", label: "구르미" },
    { id: "trailer", label: "트레이어" },
  ],
  categories: [
    { id: "new", label: "신제품", auto: true },
    { id: "lifestyle", label: "라이프 스타일" },
    { id: "sale", label: "세일", auto: true },
    { id: "slipon", label: "슬립온" },
  ],
};
