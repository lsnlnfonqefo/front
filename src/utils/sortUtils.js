export const SortOptions = {
  RECOMMENDED: "recommended",
  SALES: "sales",
  PRICE_LOW: "price_low",
  PRICE_HIGH: "price_high",
  NEWEST: "newest",
};

export const SortLabels = {
  [SortOptions.RECOMMENDED]: "추천순",
  [SortOptions.SALES]: "판매순",
  [SortOptions.PRICE_LOW]: "가격 낮은 순",
  [SortOptions.PRICE_HIGH]: "가격 높은 순",
  [SortOptions.NEWEST]: "최신 등록 순",
};

export function sortProducts(products, sortType) {
  const sorted = [...products];

  switch (sortType) {
    case SortOptions.RECOMMENDED:
      return sorted.sort((a, b) => {
        const scoreA = (a.salesCount || 0) * 0.7 + (a.averageRating || 0) * 30;
        const scoreB = (b.salesCount || 0) * 0.7 + (b.averageRating || 0) * 30;
        return scoreB - scoreA;
      });

    case SortOptions.SALES:
      return sorted.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));

    case SortOptions.PRICE_LOW:
      return sorted.sort((a, b) => a.price - b.price);

    case SortOptions.PRICE_HIGH:
      return sorted.sort((a, b) => b.price - a.price);

    case SortOptions.NEWEST:
      return sorted.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

    default:
      return sorted;
  }
}
