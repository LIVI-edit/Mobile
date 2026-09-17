import { createHash, timingSafeEqual } from 'node:crypto';

const MAX_CREDENTIAL_LENGTH = 512;

function digestCredential(value) {
  return createHash('sha256').update(value, 'utf8').digest();
}

function configuredCatalogKey(env = process.env) {
  const value = typeof env?.CATALOG_API_KEY === 'string' ? env.CATALOG_API_KEY : '';
  if (!value || value.length > MAX_CREDENTIAL_LENGTH || value.trim() !== value || /[\s\0]/u.test(value)) return null;
  return value;
}

function requestBearer(req) {
  const header = req?.headers?.authorization ?? req?.headers?.Authorization;
  if (typeof header !== 'string' || header.length > MAX_CREDENTIAL_LENGTH + 16) return null;
  const match = header.match(/^Bearer ([^\s]+)$/u);
  return match?.[1] ?? null;
}

function constantTimeCredentialMatch(supplied, expected) {
  if (typeof supplied !== 'string' || typeof expected !== 'string') return false;
  return timingSafeEqual(digestCredential(supplied), digestCredential(expected));
}

export function validateCatalogAuthorization(req, env = process.env) {
  const expected = configuredCatalogKey(env);
  if (!expected) {
    return { ok: false, statusCode: 503, code: 'CATALOG_AUTH_UNAVAILABLE', message: 'Catalog API is unavailable.' };
  }
  const supplied = requestBearer(req);
  if (!supplied || !constantTimeCredentialMatch(supplied, expected)) {
    return { ok: false, statusCode: 401, code: 'CATALOG_AUTH_REQUIRED', message: 'Catalog API authorization is required.' };
  }
  return { ok: true };
}
