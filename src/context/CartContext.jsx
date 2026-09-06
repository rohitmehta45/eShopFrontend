import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { cartApi } from '../services/api';
import { toast } from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    totalItems: 0,
  });

  const [loading, setLoading] = useState(false);

  // ==================== FETCH CART ====================

  const fetchCart = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setCart({
        items: [],
        totalItems: 0,
      });
      return;
    }

    setLoading(true);

    try {
      const { data } = await cartApi.getCart();

      setCart(
        data.cart || {
          items: [],
          totalItems: 0,
        }
      );
    } catch (error) {
      console.error('❌ Failed to fetch cart:', error);

      setCart({
        items: [],
        totalItems: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart when component loads
  useEffect(() => {
    fetchCart();
  }, []);

  // ==================== ADD TO CART ====================

  const addToCart = async (productId, quantity = 1) => {
    try {
      const { data } = await cartApi.addItem({
        productId,
        quantity,
      });

      setCart(data.cart);

      toast.success('Product added to cart');

      return data;
    } catch (error) {
      console.error('❌ Add to cart error:', error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Unable to add to cart';

      toast.error(message);

      throw error;
    }
  };

  // ==================== UPDATE QUANTITY ====================

  const updateQuantity = async (productId, quantity) => {
    try {
      const { data } = await cartApi.updateItem(
        productId,
        quantity
      );

      setCart(data.cart);

      return data;
    } catch (error) {
      console.error('❌ Update cart error:', error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Unable to update cart';

      toast.error(message);

      throw error;
    }
  };

  // ==================== REMOVE FROM CART ====================

  const removeFromCart = async (productId) => {
    try {
      const { data } = await cartApi.removeItem(productId);

      setCart(data.cart);

      toast.success('Item removed from cart');

      return data;
    } catch (error) {
      console.error('❌ Remove cart item error:', error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Unable to remove item';

      toast.error(message);

      throw error;
    }
  };

  // ==================== CLEAR CART ====================

  const clearCart = async () => {
    try {
      const { data } = await cartApi.clearCart();

      setCart(data.cart);

      toast.success('Cart cleared');

      return data;
    } catch (error) {
      console.error('❌ Clear cart error:', error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Unable to clear cart';

      toast.error(message);

      throw error;
    }
  };

  // ==================== TOTAL ITEMS ====================

  const totalItems = useMemo(() => {
    return cart.items.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );
  }, [cart.items]);

  // ==================== TOTAL PRICE ====================

  const totalPrice = useMemo(() => {
    return cart.items.reduce(
      (sum, item) =>
        sum +
        (item.product?.price || 0) *
          (item.quantity || 0),
      0
    );
  }, [cart.items]);

  // ==================== CONTEXT VALUE ====================

  const value = useMemo(
    () => ({
      cart,
      loading,
      totalItems,
      totalPrice,
      fetchCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    }),
    [
      cart,
      loading,
      totalItems,
      totalPrice,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// ==================== USE CART HOOK ====================

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      'useCart must be used within CartProvider'
    );
  }

  return context;
};