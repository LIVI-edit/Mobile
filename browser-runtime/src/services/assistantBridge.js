import { CART_BRIDGE_REJECTION_CODES, validateCartBridgePayload } from './cartBridgeValidator.js';
import { processCartBridgeReplay } from './cartBridgeReplayLedger.js';

export const ASSISTANT_BRIDGE_NAMESPACE = 'ATB_ASSISTANT_BRIDGE';
export const STOREFRONT_BRIDGE_NAMESPACE = 'ATB_STOREFRONT_BRIDGE';
export const BRIDGE_VERSION = 'mvp0';
export const MAX_BRIDGE_PAYLOAD_BYTES = 12_000;
export const MAX_BRIDGE_ITEMS = 50;
export const MAX_BRIDGE_REQUEST_ID_LENGTH = 120;

export const ASSISTANT_MESSAGE_TYPES = Object.freeze({
  READY: 'ASSISTANT_READY',
  ADD_REQUESTED: 'ASSISTANT_ADD_REQUESTED'
});

export const STOREFRONT_MESSAGE_TYPES = Object.freeze({
  READY: 'STOREFRONT_READY',
  ADD_RESULT: 'STOREFRONT_ADD_RESULT',
  ERROR: 'STOREFRONT_ERROR'
});

export const ASSISTANT_ALLOWED_TYPES = new Set(Object.values(ASSISTANT_MESSAGE_TYPES));
export const STOREFRONT_ALLOWED_TYPES = new Set(Object.values(STOREFRONT_MESSAGE_TYPES));

export const FORBIDDEN_ASSISTANT_MESSAGE_TYPES = new Set([
  'ASSISTANT_CHECKOUT',
  'ASSISTANT_PAYMENT',
  'ASSISTANT_DELIVERY',
  'ASSISTANT_ORDER',
  'ASSISTANT_SET_PRICE',
  'ASSISTANT_SET_AVAILABILITY',
  'ASSISTANT_SET_CART_DIRECTLY',
  'ASSISTANT_WRITE_LOCAL_STORAGE',
  'ASSISTANT_IMPORT_CART_CONTEXT',
  'ASSISTANT_RUN_CHECKOUT',
  'ASSISTANT_CONFIRM_ORDER'
]);

export const BRIDGE_REJECTION_CODES = Object.freeze({
  INVALID_ORIGIN: 'INVALID_ORIGIN',
  INVALID_SOURCE: 'INVALID_SOURCE',
  INVALID_MESSAGE: 'INVALID_MESSAGE',
  INVALID_NAMESPACE: 'INVALID_NAMESPACE',
  INVALID_VERSION: 'INVALID_VERSION',
  UNKNOWN_TYPE: 'UNKNOWN_TYPE',
  FORBIDDEN_TYPE: 'FORBIDDEN_TYPE',
  INVALID_REQUEST_ID: 'INVALID_REQUEST_ID',
  INVALID_PAYLOAD: 'INVALID_PAYLOAD',
  PAYLOAD_TOO_LARGE: 'PAYLOAD_TOO_LARGE',
  WILDCARD_ORIGIN_FORBIDDEN: 'WILDCARD_ORIGIN_FORBIDDEN'
});

const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
const isPlainObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value)
  && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
const hasExactFields = (value, fields) => isPlainObject(value)
  && Object.keys(value).length === fields.length
  && fields.every((field) => hasOwn(value, field));

function estimatePayloadBytes(value) {
  try {
    return new TextEncoder().encode(JSON.stringify(value)).length;
  } catch {
    return Infinity;
  }
}

function isValidRequestId(value) {
  return typeof value === 'string'
    && value.length > 0
    && value.length <= MAX_BRIDGE_REQUEST_ID_LENGTH
    && value === value.trim();
}

function validateTargetOrigin(origin) {
  return typeof origin === 'string' && origin.length > 0 && origin === origin.trim() && origin !== '*';
}

function createEnvelope({ namespace, type, requestId = null, payload = {} }) {
  return {
    namespace,
    version: BRIDGE_VERSION,
    type,
    requestId,
    payload
  };
}

export function createStorefrontBridgeMessage({ type, requestId = null, payload = {} }) {
  if (!STOREFRONT_ALLOWED_TYPES.has(type)) {
    throw new Error(`Unknown storefront bridge message type: ${type}`);
  }

  if (!isPlainObject(payload)) throw new Error('Storefront bridge payload must be a plain object.');
  if (type === STOREFRONT_MESSAGE_TYPES.READY && (requestId !== null || !hasExactFields(payload, []))) {
    throw new Error('STOREFRONT_READY must have a null requestId and empty payload.');
  }
  if (type === STOREFRONT_MESSAGE_TYPES.ADD_RESULT && !isValidRequestId(requestId)) {
    throw new Error('STOREFRONT_ADD_RESULT requires a valid requestId.');
  }
  if (type === STOREFRONT_MESSAGE_TYPES.ERROR
    && !(requestId === null || isValidRequestId(requestId))) {
    throw new Error('STOREFRONT_ERROR requestId is invalid.');
  }

  return createEnvelope({
    namespace: STOREFRONT_BRIDGE_NAMESPACE,
    type,
    requestId,
    payload
  });
}

export function postStorefrontBridgeMessage({ targetWindow, targetOrigin, type, requestId = null, payload = {} }) {
  if (!targetWindow || typeof targetWindow.postMessage !== 'function') {
    return { ok: false, reason: BRIDGE_REJECTION_CODES.INVALID_SOURCE };
  }

  if (!validateTargetOrigin(targetOrigin)) {
    return { ok: false, reason: BRIDGE_REJECTION_CODES.WILDCARD_ORIGIN_FORBIDDEN };
  }

  try {
    targetWindow.postMessage(createStorefrontBridgeMessage({ type, requestId, payload }), targetOrigin);
    return { ok: true, reason: null };
  } catch {
    return { ok: false, reason: 'DELIVERY_FAILED' };
  }
}

export function sanitizeAssistantAddPayload(payload) {
  if (!hasExactFields(payload, ['items']) || !Array.isArray(payload.items)) {
    return { valid: false, reason: BRIDGE_REJECTION_CODES.INVALID_PAYLOAD, items: [] };
  }

  if (estimatePayloadBytes(payload) > MAX_BRIDGE_PAYLOAD_BYTES) {
    return { valid: false, reason: BRIDGE_REJECTION_CODES.PAYLOAD_TOO_LARGE, items: [] };
  }

  if (payload.items.length < 1 || payload.items.length > MAX_BRIDGE_ITEMS) {
    return { valid: false, reason: BRIDGE_REJECTION_CODES.INVALID_PAYLOAD, items: [] };
  }

  const items = [];

  for (const item of payload.items) {
    if (!hasExactFields(item, ['productId', 'quantity', 'unit'])) {
      return { valid: false, reason: BRIDGE_REJECTION_CODES.INVALID_PAYLOAD, items: [] };
    }

    if (typeof item.productId !== 'string' || item.productId.length < 1 || item.productId.length > 120
      || item.productId !== item.productId.trim()
      || typeof item.quantity !== 'number' || !Number.isFinite(item.quantity)
      || typeof item.unit !== 'string' || item.unit.length < 1 || item.unit.length > 16
      || item.unit !== item.unit.trim()) {
      return { valid: false, reason: BRIDGE_REJECTION_CODES.INVALID_PAYLOAD, items: [] };
    }

    items.push(Object.freeze({
      productId: item.productId,
      quantity: item.quantity,
      unit: item.unit
    }));
  }

  return { valid: true, reason: null, items: Object.freeze(items) };
}

export function validateAssistantBridgeEvent({ event, allowedOrigin, iframeWindow }) {
  if (event?.origin !== allowedOrigin) return { valid: false, reason: BRIDGE_REJECTION_CODES.INVALID_ORIGIN, message: null };
  if (event?.source !== iframeWindow) return { valid: false, reason: BRIDGE_REJECTION_CODES.INVALID_SOURCE, message: null };

  const message = event?.data;
  if (!hasExactFields(message, ['namespace', 'version', 'type', 'requestId', 'payload'])) {
    return { valid: false, reason: BRIDGE_REJECTION_CODES.INVALID_MESSAGE, message: null };
  }
  if (message.namespace !== ASSISTANT_BRIDGE_NAMESPACE) return { valid: false, reason: BRIDGE_REJECTION_CODES.INVALID_NAMESPACE, message: null };
  if (message.version !== BRIDGE_VERSION) return { valid: false, reason: BRIDGE_REJECTION_CODES.INVALID_VERSION, message: null };
  if (FORBIDDEN_ASSISTANT_MESSAGE_TYPES.has(message.type)) return { valid: false, reason: BRIDGE_REJECTION_CODES.FORBIDDEN_TYPE, message: null };
  if (!ASSISTANT_ALLOWED_TYPES.has(message.type)) return { valid: false, reason: BRIDGE_REJECTION_CODES.UNKNOWN_TYPE, message: null };
  if (!isPlainObject(message.payload)) return { valid: false, reason: BRIDGE_REJECTION_CODES.INVALID_PAYLOAD, message: null };

  if (message.type === ASSISTANT_MESSAGE_TYPES.READY) {
    if (message.requestId !== null || !hasExactFields(message.payload, [])) {
      return { valid: false, reason: BRIDGE_REJECTION_CODES.INVALID_PAYLOAD, message: null };
    }
    return { valid: true, reason: null, message: structuredClone(message) };
  }

  if (!isValidRequestId(message.requestId)) {
    return { valid: false, reason: BRIDGE_REJECTION_CODES.INVALID_REQUEST_ID, message: null };
  }

  const sanitized = sanitizeAssistantAddPayload(message.payload);
  if (!sanitized.valid) return { valid: false, reason: sanitized.reason, message: null };

  return {
    valid: true,
    reason: null,
    message: {
      ...structuredClone(message),
      payload: { items: sanitized.items.map((item) => ({ ...item })) }
    }
  };
}

export function createStorefrontAddResultPayload(cartResult) {
  return {
    ok: Boolean(cartResult?.ok),
    acceptedItems: Array.isArray(cartResult?.acceptedItems)
      ? cartResult.acceptedItems.map((item) => ({ productId: item.productId, quantity: item.quantity }))
      : [],
    rejectedItems: Array.isArray(cartResult?.rejectedItems)
      ? cartResult.rejectedItems.map((item) => ({ productId: item.productId ?? null, reason: item.reason ?? 'UNKNOWN' }))
      : [],
    cartItemCount: Number.isInteger(cartResult?.cartItemCount) && cartResult.cartItemCount >= 0
      ? cartResult.cartItemCount
      : 0
  };
}

function safeCartItemCount(getCartItemCount) {
  try {
    const cartItemCount = typeof getCartItemCount === 'function' ? getCartItemCount() : 0;
    return Number.isInteger(cartItemCount) && cartItemCount >= 0 ? cartItemCount : 0;
  } catch {
    return 0;
  }
}

function createConflictCartResult(getCartItemCount) {
  return {
    ok: false,
    acceptedItems: [],
    rejectedItems: [{ productId: null, reason: CART_BRIDGE_REJECTION_CODES.REQUEST_ID_CONFLICT }],
    cartItemCount: safeCartItemCount(getCartItemCount)
  };
}

function createCartUnavailableResult(getCartItemCount) {
  return {
    ok: false,
    acceptedItems: [],
    rejectedItems: [{ productId: null, reason: 'CART_UNAVAILABLE' }],
    cartItemCount: safeCartItemCount(getCartItemCount)
  };
}

async function deliverStorefrontMessage(postMessageToAssistant, message) {
  if (typeof postMessageToAssistant !== 'function') return 'failed';
  try {
    const outcome = await postMessageToAssistant(message);
    if (outcome === false || outcome?.ok === false) return 'failed';
    return 'delivered';
  } catch {
    return 'failed';
  }
}

export async function handleAssistantBridgeEvent({
  event,
  allowedOrigin,
  iframeWindow,
  addManyToCart,
  getCartItemCount,
  postMessageToAssistant,
  now = Date.now()
}) {
  const validation = validateAssistantBridgeEvent({ event, allowedOrigin, iframeWindow });
  if (!validation.valid) return { handled: false, mutatedCart: false, reason: validation.reason };

  const message = validation.message;

  if (message.type === ASSISTANT_MESSAGE_TYPES.READY) {
    const deliveryStatus = await deliverStorefrontMessage(postMessageToAssistant, {
      type: STOREFRONT_MESSAGE_TYPES.READY,
      requestId: null,
      payload: {}
    });
    return { handled: true, mutatedCart: false, reason: null, replayStatus: null, deliveryStatus };
  }

  let replay;
  try {
    replay = await processCartBridgeReplay({
      requestId: message.requestId,
      payload: message.payload,
      now,
      createConflictResult: () => createConflictCartResult(getCartItemCount),
      execute: async () => {
        const strictPayloadValidation = validateCartBridgePayload(message.payload.items, { strictBridge: true });
        if (!strictPayloadValidation.valid) {
          return {
            ok: false,
            acceptedItems: [],
            rejectedItems: [{ productId: null, reason: strictPayloadValidation.reason }],
            cartItemCount: safeCartItemCount(getCartItemCount)
          };
        }
        if (typeof addManyToCart !== 'function') return createCartUnavailableResult(getCartItemCount);
        return addManyToCart(message.payload.items);
      }
    });
  } catch {
    const payload = createStorefrontAddResultPayload(createCartUnavailableResult(getCartItemCount));
    const deliveryStatus = await deliverStorefrontMessage(postMessageToAssistant, {
      type: STOREFRONT_MESSAGE_TYPES.ADD_RESULT,
      requestId: message.requestId,
      payload
    });
    return {
      handled: true,
      mutatedCart: false,
      reason: 'CART_UNAVAILABLE',
      replayStatus: 'failed',
      deliveryStatus,
      payload
    };
  }

  const payload = createStorefrontAddResultPayload(replay.result);
  const deliveryStatus = await deliverStorefrontMessage(postMessageToAssistant, {
    type: STOREFRONT_MESSAGE_TYPES.ADD_RESULT,
    requestId: message.requestId,
    payload
  });

  return {
    handled: true,
    mutatedCart: replay.status === 'executed' && payload.acceptedItems.length > 0,
    reason: replay.status === 'conflict' ? CART_BRIDGE_REJECTION_CODES.REQUEST_ID_CONFLICT : null,
    replayStatus: replay.status,
    deliveryStatus,
    payload
  };
}
