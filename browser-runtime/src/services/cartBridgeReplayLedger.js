export const CART_BRIDGE_REPLAY_TTL_MS = 10 * 60 * 1000;
export const CART_BRIDGE_REPLAY_MAX_ENTRIES = 256;

const replayLedger = new Map();
let serializedTail = Promise.resolve();

function deepClone(value) {
  return structuredClone(value);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const nested of Object.values(value)) deepFreeze(nested);
  return value;
}

function immutableClone(value) {
  return deepFreeze(deepClone(value));
}

function evictExpired(now) {
  for (const [requestId, entry] of replayLedger.entries()) {
    if (entry.expiresAt <= now) replayLedger.delete(requestId);
  }
}

function evictOverflow() {
  while (replayLedger.size > CART_BRIDGE_REPLAY_MAX_ENTRIES) {
    const oldest = [...replayLedger.entries()].sort((left, right) => {
      if (left[1].createdAt !== right[1].createdAt) return left[1].createdAt - right[1].createdAt;
      return left[0].localeCompare(right[0]);
    })[0];
    if (!oldest) return;
    replayLedger.delete(oldest[0]);
  }
}

function enqueue(operation) {
  const scheduled = serializedTail.then(operation, operation);
  serializedTail = scheduled.then(() => undefined, () => undefined);
  return scheduled;
}

export function canonicalizeCartBridgePayload(payload) {
  return JSON.stringify({
    items: payload.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unit: item.unit
    }))
  });
}

export async function processCartBridgeReplay({
  requestId,
  payload,
  execute,
  createConflictResult,
  now = Date.now()
}) {
  return enqueue(async () => {
    evictExpired(now);
    const fingerprint = canonicalizeCartBridgePayload(payload);
    const existing = replayLedger.get(requestId);

    if (existing) {
      if (existing.fingerprint !== fingerprint) {
        return {
          status: 'conflict',
          result: immutableClone(createConflictResult())
        };
      }

      return {
        status: 'replay',
        result: immutableClone(existing.result)
      };
    }

    const result = immutableClone(await execute());
    replayLedger.set(requestId, Object.freeze({
      requestId,
      fingerprint,
      result,
      createdAt: now,
      expiresAt: now + CART_BRIDGE_REPLAY_TTL_MS
    }));
    evictOverflow();

    return {
      status: 'executed',
      result: immutableClone(result)
    };
  });
}

export function resetCartBridgeReplayLedgerForTests() {
  replayLedger.clear();
  serializedTail = Promise.resolve();
}

export function inspectCartBridgeReplayLedgerForTests({ now = Date.now() } = {}) {
  evictExpired(now);
  return [...replayLedger.values()]
    .sort((left, right) => left.createdAt - right.createdAt || left.requestId.localeCompare(right.requestId))
    .map((entry) => ({
      requestId: entry.requestId,
      fingerprint: entry.fingerprint,
      createdAt: entry.createdAt,
      expiresAt: entry.expiresAt
    }));
}
