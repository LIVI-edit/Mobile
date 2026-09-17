import { products } from '../data/products.js';
import {
  validateCartBridgeItem,
  validateCartBridgePayload
} from './cartBridgeValidator.js';

function sanitizeCurrentCart(currentCart) {
  if (!currentCart || typeof currentCart !== 'object' || Array.isArray(currentCart)) return {};

  return Object.entries(currentCart).reduce((safeCart, [productId, quantity]) => {
    const numericQuantity = Number(quantity);
    if (productId && Number.isFinite(numericQuantity) && numericQuantity > 0) {
      safeCart[productId] = Math.floor(numericQuantity);
    }
    return safeCart;
  }, {});
}

function createAcceptedItem({ product, quantity, unit }) {
  return {
    productId: product.id,
    quantity,
    unit,
    title: product.name,
    price: product.price,
    category: product.category
  };
}

function createRejectedItem(item, reason) {
  return {
    productId: typeof item?.productId === 'string' && item.productId.trim() ? item.productId.trim() : null,
    reason
  };
}

export function countCartItems(cart) {
  return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
}

export function addManyToCart({
  currentCart = {},
  items,
  productCatalog = products,
  strictBridge = false
} = {}) {
  const payloadValidation = validateCartBridgePayload(items, { strictBridge });
  const nextCart = sanitizeCurrentCart(currentCart);
  const acceptedItems = [];
  const rejectedItems = [];

  if (!payloadValidation.valid) {
    return {
      ok: false,
      acceptedItems,
      rejectedItems: [{ productId: null, reason: payloadValidation.reason }],
      cartItemCount: countCartItems(nextCart),
      cart: nextCart
    };
  }

  for (const item of items) {
    const validation = validateCartBridgeItem(item, {
      productCatalog,
      exactItemFields: strictBridge,
      requireCanonicalUnit: strictBridge
    });

    if (!validation.valid) {
      rejectedItems.push(createRejectedItem(item, validation.reason));
      continue;
    }

    const productId = validation.product.id;
    nextCart[productId] = (nextCart[productId] || 0) + validation.quantity;
    acceptedItems.push(createAcceptedItem({
      product: validation.product,
      quantity: validation.quantity,
      unit: validation.unit
    }));
  }

  return {
    ok: rejectedItems.length === 0,
    acceptedItems,
    rejectedItems,
    cartItemCount: countCartItems(nextCart),
    cart: nextCart
  };
}
