import {
  handleCatalogCategories,
  handleCatalogProducts,
  handleCatalogSnapshot
} from '../../src/server/catalogApi.js';

const handlers = Object.freeze({
  categories: handleCatalogCategories,
  products: handleCatalogProducts,
  snapshot: handleCatalogSnapshot
});

export default function handler(req, res) {
  const resource = Array.isArray(req?.query?.resource) ? null : req?.query?.resource;
  const resourceHandler = typeof resource === 'string' ? handlers[resource] : null;

  if (!resourceHandler) {
    res.statusCode = 404;
    if (typeof res.setHeader === 'function') {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
    }
    res.end(JSON.stringify({ ok: false, code: 'catalog_resource_not_found' }));
    return;
  }

  return resourceHandler(req, res);
}
