const CART_STORAGE_KEY = 'atb-mini-site-cart';

export function loadCartFromStorage() {
  try {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!storedCart) {
      return {};
    }

    const parsedCart = JSON.parse(storedCart);

    if (!parsedCart || typeof parsedCart !== 'object' || Array.isArray(parsedCart)) {
      return {};
    }

    return Object.entries(parsedCart).reduce((safeCart, [productId, quantity]) => {
      const numericQuantity = Number(quantity);

      if (productId && Number.isFinite(numericQuantity) && numericQuantity > 0) {
        safeCart[productId] = Math.floor(numericQuantity);
      }

      return safeCart;
    }, {});
  } catch (error) {
    console.warn('Не вдалося прочитати кошик з localStorage:', error);
    return {};
  }
}

export function saveCartToStorage(cart) {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.warn('Не вдалося зберегти кошик у localStorage:', error);
  }
}
