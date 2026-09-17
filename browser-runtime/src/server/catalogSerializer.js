import { createHash } from 'node:crypto';
import { products } from '../data/products.js';
import { categories } from '../data/categories.js';
import {
  normalizeCatalogPublicOrigin,
  resolveCatalogProductImage
} from '../services/catalogImageResolver.js';

export const CATALOG_SOURCE = 'retail-ai-showcase-us-sandbox';
export const CATALOG_VERSION = 'us-market-v1';
export const CATALOG_CURRENCY = 'USD';
export const CATALOG_UPDATED_AT = '2026-08-17T00:00:00.000Z';

const SAFE_PRODUCT_FIELDS = [
  'id', 'name', 'category', 'categorySlug', 'subcategory', 'price', 'oldPrice',
  'unit', 'packageSize', 'image', 'inStock', 'isPromo', 'tags', 'description', 'brand'
];
const SAFE_CATEGORY_FIELDS = ['id', 'slug', 'name', 'description', 'icon', 'sortOrder'];

function pickSafeFields(source, allowedFields) {
  const result = {};
  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(source, field)) result[field] = source[field];
  }
  return result;
}

function resolveConfiguredPublicOrigin(options) {
  const publicOrigin = Object.prototype.hasOwnProperty.call(options, 'publicOrigin')
    ? options.publicOrigin
    : process.env.CATALOG_PUBLIC_ORIGIN;

  try {
    return normalizeCatalogPublicOrigin(publicOrigin);
  } catch (error) {
    throw new Error(`Invalid CATALOG_PUBLIC_ORIGIN configuration: ${error.message}`, { cause: error });
  }
}

export function serializeProduct(product, { publicOrigin } = {}) {
  return {
    ...pickSafeFields(product, SAFE_PRODUCT_FIELDS),
    image: resolveCatalogProductImage(product, { publicOrigin })
  };
}

export function serializeCategory(category) {
  return pickSafeFields(category, SAFE_CATEGORY_FIELDS);
}

export function canonicalCatalogJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalCatalogJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalCatalogJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function calculateCatalogSnapshotId(content) {
  return `sha256:${createHash('sha256').update(canonicalCatalogJson(content)).digest('hex')}`;
}

function assertUnique(values, label) {
  if (new Set(values).size !== values.length) throw new Error(`Duplicate catalog ${label}.`);
}

function assertCatalogIdentity(productSource, categorySource) {
  assertUnique(productSource.map((product) => product.id), 'product identity');
  assertUnique(categorySource.map((category) => category.id), 'category identity');
  assertUnique(categorySource.map((category) => category.slug), 'category slug');
}

export function getCanonicalCatalogContent(options = {}) {
  const {
    productSource = products,
    categorySource = categories
  } = options;
  const publicOrigin = resolveConfiguredPublicOrigin(options);

  assertCatalogIdentity(productSource, categorySource);
  return {
    source: CATALOG_SOURCE,
    version: CATALOG_VERSION,
    currency: CATALOG_CURRENCY,
    products: productSource.map((product) => serializeProduct(product, { publicOrigin })),
    categories: categorySource.map(serializeCategory)
  };
}

function identityFor(content) {
  return {
    source: content.source,
    version: content.version,
    currency: content.currency,
    updatedAt: CATALOG_UPDATED_AT,
    snapshotId: calculateCatalogSnapshotId(content)
  };
}

export function getCatalogProductsPayload(options = {}) {
  const content = getCanonicalCatalogContent(options);
  return { ...identityFor(content), products: content.products };
}

export function getCatalogCategoriesPayload(options = {}) {
  const content = getCanonicalCatalogContent(options);
  return { ...identityFor(content), categories: content.categories };
}

export function getCatalogSnapshotPayload(options = {}) {
  const content = getCanonicalCatalogContent(options);
  return { ...identityFor(content), products: content.products, categories: content.categories };
}

export function getStorefrontProductsSource() { return products; }
export function getStorefrontCategoriesSource() { return categories; }
