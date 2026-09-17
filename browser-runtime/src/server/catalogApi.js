import {
  getCatalogCategoriesPayload,
  getCatalogProductsPayload,
  getCatalogSnapshotPayload
} from './catalogSerializer.js';
import { validateCatalogAuthorization } from './catalogAuth.js';

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  if (typeof res.setHeader === 'function') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  }
  res.end(JSON.stringify(payload));
}

export function createSafeApiError(code, message) {
  return { error: { code, message } };
}

export function rejectNonGet(req, res) {
  if (req.method === 'GET') return false;
  if (typeof res.setHeader === 'function') res.setHeader('Allow', 'GET');
  sendJson(res, 405, createSafeApiError('METHOD_NOT_ALLOWED', 'Only GET is supported for the sandbox catalog API.'));
  return true;
}

function rejectUnauthorized(req, res) {
  const authorization = validateCatalogAuthorization(req);
  if (authorization.ok) return false;
  if (authorization.statusCode === 401 && typeof res.setHeader === 'function') {
    res.setHeader('WWW-Authenticate', 'Bearer');
  }
  sendJson(res, authorization.statusCode, createSafeApiError(authorization.code, authorization.message));
  return true;
}

export function handleCatalogProducts(req, res) {
  if (rejectNonGet(req, res) || rejectUnauthorized(req, res)) return;
  sendJson(res, 200, getCatalogProductsPayload());
}

export function handleCatalogCategories(req, res) {
  if (rejectNonGet(req, res) || rejectUnauthorized(req, res)) return;
  sendJson(res, 200, getCatalogCategoriesPayload());
}

export function handleCatalogSnapshot(req, res) {
  if (rejectNonGet(req, res) || rejectUnauthorized(req, res)) return;
  sendJson(res, 200, getCatalogSnapshotPayload());
}
