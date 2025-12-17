import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart({ items: [], total: 0 });
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const cartData = await cartAPI.getCart();
      // cartAPI가 이미 { items: [], total: 0 } 형태로 반환
      setCart({
        items: Array.isArray(cartData.items) ? cartData.items : [],
        total: cartData.total || 0,
      });
    } catch (error) {
      console.error('장바구니 조회 실패:', error);
      setCart({ items: [], total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId, size, quantity = 1) => {
    try {
      await cartAPI.addItem(productId, size, quantity);
      await fetchCart();
      setIsOpen(true); // PPT: 클릭 시 좌측에 장바구니 현황 자동 표시
    } catch (error) {
      console.error('장바구니 추가 실패:', error);
      throw error;
    }
  };

  const updateItem = async (cartItemId, quantity) => {
    try {
      await cartAPI.updateItem(cartItemId, quantity);
      await fetchCart();
    } catch (error) {
      console.error('수량 변경 실패:', error);
      throw error;
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await cartAPI.removeItem(cartItemId);
      await fetchCart();
    } catch (error) {
      console.error('상품 삭제 실패:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCart({ items: [], total: 0 });
    } catch (error) {
      console.error('장바구니 비우기 실패:', error);
    }
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen(!isOpen);

  const itemCount = cart.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        loading,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        fetchCart,
        openCart,
        closeCart,
        toggleCart,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
