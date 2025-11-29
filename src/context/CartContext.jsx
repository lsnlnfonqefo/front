import { createContext, useState, useEffect, useCallback } from "react";
import cartService from "../api/cartService";
import productService from "../api/productService";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const loadCart = useCallback(async () => {
    setLoading(true);
    try {
      const cart = await cartService.getCart();

      const itemsWithProduct = await Promise.all(
        cart.items.map(async (item) => {
          try {
            const product = await productService.getProductById(item.productId);
            return {
              ...item,
              productName: product.name,
              productImage: product.images[0],
              price: product.price,
            };
          } catch {
            return item;
          }
        })
      );

      setCartItems(itemsWithProduct);
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = useCallback(
    async (product, size) => {
      try {
        await cartService.addToCart(product.id, size, 1);
        await loadCart();
        setIsOpen(true);
      } catch (error) {
        console.error("Failed to add to cart:", error);
        throw error;
      }
    },
    [loadCart]
  );

  const updateQuantity = useCallback(
    async (cartItemId, quantity) => {
      try {
        await cartService.updateQuantity(cartItemId, quantity);
        await loadCart();
      } catch (error) {
        console.error("Failed to update quantity:", error);
        throw error;
      }
    },
    [loadCart]
  );

  const removeFromCart = useCallback(
    async (cartItemId) => {
      try {
        await cartService.removeFromCart(cartItemId);
        await loadCart();
      } catch (error) {
        console.error("Failed to remove from cart:", error);
        throw error;
      }
    },
    [loadCart]
  );

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const getTotalQuantity = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const value = {
    cartItems,
    loading,
    isOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    openCart,
    closeCart,
    getTotalQuantity,
    getTotalPrice,
    refreshCart: loadCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
