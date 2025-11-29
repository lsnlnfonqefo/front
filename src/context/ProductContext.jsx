import { createContext, useState, useEffect, useCallback } from "react";
import productService from "../api/productService";

export const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    gender: "men",
    sizes: [],
    materials: [],
    functions: [],
    models: [],
    categories: [],
  });

  /**
   * Fetch products from API
   */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await productService.getProducts(filters);
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Update filters
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Toggle filter value (for arrays)
   */
  const toggleFilter = useCallback((filterKey, value) => {
    setFilters((prev) => {
      const currentValues = prev[filterKey] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      return { ...prev, [filterKey]: newValues };
    });
  }, []);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setFilters({
      gender: filters.gender, // Keep gender
      sizes: [],
      materials: [],
      functions: [],
      models: [],
      categories: [],
    });
  }, [filters.gender]);

  /**
   * Get active filter count
   */
  const getActiveFilterCount = useCallback(() => {
    return Object.entries(filters).reduce((count, [key, value]) => {
      if (key === "gender") return count;
      if (Array.isArray(value)) return count + value.length;
      return count;
    }, 0);
  }, [filters]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const value = {
    products,
    filteredProducts,
    loading,
    error,
    filters,
    updateFilters,
    toggleFilter,
    clearFilters,
    getActiveFilterCount,
    refetch: fetchProducts,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}
