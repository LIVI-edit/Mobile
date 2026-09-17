import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { products } from '../data/products.js';
import { loadCartFromStorage, saveCartToStorage } from '../utils/cartStorage.js';
import {
  addManyToCart as addManyToCartBridge,
  countCartItems
} from '../services/cartBridge.js';

const CartContext = createContext(null);
const productsById = new Map(products.map((product) => [product.id, product]));

function sanitizeQuantity(quantity) {
  const numericQuantity = Number(quantity);

  if (!Number.isFinite(numericQuantity) || numericQuantity <= 0) {
    return 1;
  }

  return Math.floor(numericQuantity);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => loadCartFromStorage());
  const cartRef = useRef(cart);

  const replaceCart = useCallback((nextCart) => {
    cartRef.current = nextCart;
    setCart(nextCart);
  }, []);

  const addToCart = useCallback((productId, quantity = 1) => {
    if (!productsById.has(productId)) {
      console.warn(`Товар з id ${productId} не знайдено.`);
      return null;
    }

    const safeQuantity = sanitizeQuantity(quantity);
    const currentCart = cartRef.current;
    replaceCart({
      ...currentCart,
      [productId]: (currentCart[productId] || 0) + safeQuantity,
    });

    return { productId, quantity: safeQuantity };
  }, [replaceCart]);

  const applyBridgeCartRequest = useCallback((items) => {
    const bridgeResult = addManyToCartBridge({
      currentCart: cartRef.current,
      items,
      strictBridge: true
    });
    replaceCart(bridgeResult.cart);
    return bridgeResult;
  }, [replaceCart]);

  const getCartItemCount = useCallback(() => countCartItems(cartRef.current), []);

  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  function removeFromCart(productId) {
    const nextCart = { ...cartRef.current };
    delete nextCart[productId];
    replaceCart(nextCart);
  }

  function increaseQuantity(productId) {
    addToCart(productId, 1);
  }

  function decreaseQuantity(productId) {
    const currentCart = cartRef.current;
    const currentQuantity = currentCart[productId] || 0;

    if (currentQuantity <= 1) {
      const nextCart = { ...currentCart };
      delete nextCart[productId];
      replaceCart(nextCart);
      return;
    }

    replaceCart({
      ...currentCart,
      [productId]: currentQuantity - 1,
    });
  }

  function clearCart() {
    replaceCart({});
  }

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([productId, quantity]) => {
        const product = productsById.get(productId);

        if (!product) {
          return null;
        }

        return {
          product,
          quantity,
          lineTotal: product.price * quantity,
        };
      })
      .filter(Boolean);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.lineTotal, 0);
  }, [cartItems]);

  const value = useMemo(
    () => ({
      cart,
      cartItems,
      cartCount,
      cartTotal,
      addToCart,
      applyBridgeCartRequest,
      getCartItemCount,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
    }),
    [cart, cartItems, cartCount, cartTotal, addToCart, applyBridgeCartRequest, getCartItemCount],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
}
