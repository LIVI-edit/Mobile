import { createContext, type ReactNode, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { activeRetailer } from '../retailers/activeRetailer';
import type { Product } from '../retailers/types';

type CartState = Record<string, number>;

export type CartItem = {
  product: Product;
  quantity: number;
  lineTotal: number;
};

type AddToCartResult = {
  productId: string;
  quantity: number;
};

type CartContextValue = {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (productId: string, quantity?: number) => AddToCartResult | null;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function sanitizeQuantity(quantity: unknown): number {
  const numericQuantity = Number(quantity);

  if (!Number.isFinite(numericQuantity) || numericQuantity <= 0) {
    return 1;
  }

  return Math.floor(numericQuantity);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>({});
  const cartRef = useRef<CartState>({});

  const replaceCart = useCallback((nextCart: CartState) => {
    cartRef.current = nextCart;
    setCart(nextCart);
  }, []);

  const addToCart = useCallback((productId: string, quantity = 1): AddToCartResult | null => {
    if (!activeRetailer.getProductById(productId)) {
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

  const removeFromCart = useCallback((productId: string) => {
    const nextCart = { ...cartRef.current };
    delete nextCart[productId];
    replaceCart(nextCart);
  }, [replaceCart]);

  const increaseQuantity = useCallback((productId: string) => {
    addToCart(productId, 1);
  }, [addToCart]);

  const decreaseQuantity = useCallback((productId: string) => {
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
  }, [replaceCart]);

  const clearCart = useCallback(() => {
    replaceCart({});
  }, [replaceCart]);

  const cartItems = useMemo<CartItem[]>(() => {
    return Object.entries(cart).flatMap(([productId, quantity]) => {
      const product = activeRetailer.getProductById(productId);

      if (!product) {
        return [];
      }

      return [{
        product,
        quantity,
        lineTotal: product.price * quantity,
      }];
    });
  }, [cart]);

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.lineTotal, 0),
    [cartItems],
  );

  const value = useMemo<CartContextValue>(() => ({
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  }), [
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
}
