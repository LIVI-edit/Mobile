import { products } from '../data/products.js';

export const CART_BRIDGE_REJECTION_CODES = Object.freeze({
  PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND',
  INVALID_QUANTITY: 'INVALID_QUANTITY',
  QUANTITY_TOO_LARGE: 'QUANTITY_TOO_LARGE',
  PRODUCT_RESTRICTED: 'PRODUCT_RESTRICTED',
  PRODUCT_UNAVAILABLE: 'PRODUCT_UNAVAILABLE',
  UNIT_MISMATCH: 'UNIT_MISMATCH',
  REQUEST_ID_CONFLICT: 'REQUEST_ID_CONFLICT',
  DUPLICATE_PRODUCT_ID: 'DUPLICATE_PRODUCT_ID',
  INVALID_PAYLOAD: 'INVALID_PAYLOAD'
});

export const MAX_CART_BRIDGE_QUANTITY = 99;
export const CART_BRIDGE_CANONICAL_UNITS = Object.freeze(['pack', 'pcs', 'kg', 'l']);

const exactKeys = (value, keys) => value && typeof value === 'object' && !Array.isArray(value)
  && Object.keys(value).length === keys.length
  && keys.every((key) => Object.prototype.hasOwnProperty.call(value, key));

function toProductsById(productCatalog = products) {
  return new Map(productCatalog.map((product) => [product.id, product]));
}

function isRestrictedProduct(product) {
  return Boolean(product?.restricted || product?.ageRestricted || product?.restrictedReason);
}

function isUnavailableProduct(product) {
  return product?.inStock === false || product?.available === false;
}

function normalizeBridgeQuantity(quantity) {
  if (typeof quantity !== 'number' || !Number.isFinite(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
    return { ok: false, reason: CART_BRIDGE_REJECTION_CODES.INVALID_QUANTITY, quantity: null };
  }

  if (quantity > MAX_CART_BRIDGE_QUANTITY) {
    return { ok: false, reason: CART_BRIDGE_REJECTION_CODES.QUANTITY_TOO_LARGE, quantity: null };
  }

  return { ok: true, reason: null, quantity };
}

function normalizeText(value) {
  return String(value ?? '').toLowerCase().trim();
}

function parsePackageUnit(product) {
  const text = normalizeText(product?.packageSize || product?.unit || '1 pc').replace(',', '.');
  if (/^\d+(?:\.\d+)?\s*kg\b/u.test(text)) return 'kg';
  if (/^\d+(?:\.\d+)?\s*l\b/u.test(text)) return 'l';
  if (/^1\s*(?:pc|pcs|ct|head|bunch|pair)\b/u.test(text)) return 'pcs';
  return 'pack';
}

export function resolveCurrentProductBridgeUnit(product) {
  const rawUnit = normalizeText(product?.unit);
  if (CART_BRIDGE_CANONICAL_UNITS.includes(rawUnit)) return rawUnit;
  return parsePackageUnit(product);
}

export function validateCartBridgePayload(items, { strictBridge = false } = {}) {
  if (!Array.isArray(items)) {
    return {
      valid: false,
      reason: CART_BRIDGE_REJECTION_CODES.INVALID_PAYLOAD,
      message: 'Sandbox cart bridge payload must contain an items array.'
    };
  }

  if (strictBridge) {
    const productIds = new Set();
    for (const item of items) {
      const productId = typeof item?.productId === 'string' ? item.productId : null;
      if (productId !== null && productIds.has(productId)) {
        return {
          valid: false,
          reason: CART_BRIDGE_REJECTION_CODES.DUPLICATE_PRODUCT_ID,
          message: 'Strict bridge payload contains duplicate productId values.'
        };
      }
      if (productId !== null) productIds.add(productId);
    }
  }

  return { valid: true, reason: null, message: null };
}

export function validateCartBridgeItem(item, {
  productCatalog = products,
  exactItemFields = false,
  requireCanonicalUnit = false
} = {}) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    return { valid: false, reason: CART_BRIDGE_REJECTION_CODES.INVALID_PAYLOAD, product: null, quantity: null, unit: null };
  }

  if (exactItemFields && !exactKeys(item, ['productId', 'quantity', 'unit'])) {
    return { valid: false, reason: CART_BRIDGE_REJECTION_CODES.INVALID_PAYLOAD, product: null, quantity: null, unit: null };
  }

  const productId = typeof item.productId === 'string'
    ? (exactItemFields ? item.productId : item.productId.trim())
    : '';
  if (!productId || productId !== productId.trim()) {
    return { valid: false, reason: CART_BRIDGE_REJECTION_CODES.INVALID_PAYLOAD, product: null, quantity: null, unit: null };
  }

  const productsById = toProductsById(productCatalog);
  const product = productsById.get(productId);
  if (!product) {
    return { valid: false, reason: CART_BRIDGE_REJECTION_CODES.PRODUCT_NOT_FOUND, product: null, quantity: null, unit: null };
  }

  const quantityResult = normalizeBridgeQuantity(item.quantity);
  if (!quantityResult.ok) {
    return { valid: false, reason: quantityResult.reason, product, quantity: null, unit: null };
  }

  const currentUnit = resolveCurrentProductBridgeUnit(product);
  if (requireCanonicalUnit) {
    if (typeof item.unit !== 'string' || !CART_BRIDGE_CANONICAL_UNITS.includes(item.unit) || item.unit !== currentUnit) {
      return { valid: false, reason: CART_BRIDGE_REJECTION_CODES.UNIT_MISMATCH, product, quantity: quantityResult.quantity, unit: currentUnit };
    }
  }

  if (isRestrictedProduct(product)) {
    return { valid: false, reason: CART_BRIDGE_REJECTION_CODES.PRODUCT_RESTRICTED, product, quantity: quantityResult.quantity, unit: currentUnit };
  }

  if (isUnavailableProduct(product)) {
    return { valid: false, reason: CART_BRIDGE_REJECTION_CODES.PRODUCT_UNAVAILABLE, product, quantity: quantityResult.quantity, unit: currentUnit };
  }

  return {
    valid: true,
    reason: null,
    product,
    quantity: quantityResult.quantity,
    unit: currentUnit
  };
}
