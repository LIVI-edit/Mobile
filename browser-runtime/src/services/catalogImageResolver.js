const FEATURED_PRODUCT_IMAGE_PATHS = Object.freeze({
  'veg-001': '/images/products/veg-001.jpg',
  'veg-002': '/images/products/veg-002.jpg',
  'veg-003': '/images/products/veg-003.jpg',
  'veg-004': '/images/products/veg-004.jpg',
  'veg-005': '/images/products/veg-005.jpg',
  'veg-006': '/images/products/veg-006.jpg',
  'veg-007': '/images/products/veg-007.jpg',
  'veg-008': '/images/products/veg-008.jpg',
  'veg-009': '/images/products/veg-009.jpg',
  'veg-010': '/images/products/veg-010.jpg',
  'veg-011': '/images/products/veg-011.jpg',
  'veg-012': '/images/products/veg-012.jpg',
  'veg-013': '/images/products/veg-013.jpg',
  'veg-014': '/images/products/veg-014.jpg',
  'veg-015': '/images/products/veg-015.jpg',
  'veg-016': '/images/products/veg-016.jpg',
  'veg-017': '/images/products/veg-017.jpg',
  'veg-018': '/images/products/veg-018.jpg',
  'meat-001': '/images/products/meat-001.jpg',
  'meat-002': '/images/products/meat-002.jpg',
  'meat-003': '/images/products/meat-003.jpg',
  'meat-004': '/images/products/meat-004.jpg',
  'meat-005': '/images/products/meat-005.jpg',
  'meat-006': '/images/products/meat-006.jpg',
  'meat-007': '/images/products/meat-007.jpg',
  'meat-008': '/images/products/meat-008.jpg',
  'meat-009': '/images/products/meat-009.jpg',
  'meat-010': '/images/products/meat-010.jpg',
  'meat-011': '/images/products/meat-011.jpg',
  'meat-012': '/images/products/meat-012.jpg',
  'dairy-001': '/images/products/dairy-001.jpg',
  'dairy-003': '/images/products/dairy-003.jpg',
  'dairy-005': '/images/products/dairy-005.jpg',
  'dairy-006': '/images/products/dairy-006.jpg',
  'dairy-007': '/images/products/dairy-007.jpg',
  'dairy-008': '/images/products/dairy-008.jpg',
  'dairy-009': '/images/products/dairy-009.jpg',
  'dairy-010': '/images/products/dairy-010.jpg',
  'bakery-001': '/images/products/bakery-001.jpg',
  'bakery-002': '/images/products/bakery-002.jpg',
  'bakery-003': '/images/products/bakery-003.jpg',
  'bakery-004': '/images/products/bakery-004.jpg',
  'bakery-005': '/images/products/bakery-005.jpg',
  'grocery-003': '/images/products/grocery-003.jpg',
  'grocery-009': '/images/products/grocery-009.jpg',
  'can-001': '/images/products/can-001.jpg',
  'sauce-001': '/images/products/sauce-001.jpg',
  'sauce-007': '/images/products/sauce-007.jpg',
  'drink-001': '/images/products/drink-001.jpg',
  'drink-007': '/images/products/drink-007.jpg',
  'sweet-001': '/images/products/sweet-001.jpg',
  'frozen-003': '/images/products/frozen-003.jpg',
  'house-001': '/images/products/house-001.jpg',
  'clean-007': '/images/products/clean-007.jpg'
});

const CATEGORY_PLACEHOLDER_PATHS = Object.freeze({
  'ovochi-frukty': '/images/catalog-placeholders/ovochi-frukty.jpg',
  'miaso-ptytsia': '/images/catalog-placeholders/miaso-ptytsia.jpg',
  'molochni-iaitsia': '/images/catalog-placeholders/molochni-iaitsia.jpg',
  'khlib-vypichka': '/images/catalog-placeholders/khlib-vypichka.jpg',
  bakaliia: '/images/catalog-placeholders/bakaliia.jpg',
  konservatsiia: '/images/catalog-placeholders/konservatsiia.jpg',
  'sousy-spetsii': '/images/catalog-placeholders/sousy-spetsii.jpg',
  napoi: '/images/catalog-placeholders/napoi.jpg',
  solodoshchi: '/images/catalog-placeholders/solodoshchi.jpg',
  zamorozheni: '/images/catalog-placeholders/zamorozheni.jpg',
  'pobutova-khimiia': '/images/catalog-placeholders/pobutova-khimiia.jpg',
  'tovary-dlia-prybyrannia': '/images/catalog-placeholders/tovary-dlia-prybyrannia.jpg'
});

export function normalizeCatalogPublicOrigin(publicOrigin) {
  if (publicOrigin === undefined) return undefined;
  if (typeof publicOrigin !== 'string' || publicOrigin.length === 0 || publicOrigin.trim() !== publicOrigin) {
    throw new Error('Invalid catalog public origin: expected a non-empty absolute HTTPS origin.');
  }

  let parsed;
  try {
    parsed = new URL(publicOrigin);
  } catch {
    throw new Error('Invalid catalog public origin: expected a non-empty absolute HTTPS origin.');
  }

  if (
    parsed.protocol !== 'https:'
    || parsed.username
    || parsed.password
    || parsed.pathname !== '/'
    || parsed.search
    || parsed.hash
  ) {
    throw new Error('Invalid catalog public origin: HTTPS is required and path, query, hash, and credentials are not allowed.');
  }

  return parsed.origin;
}

export function resolveCatalogProductImage(product, options = {}) {
  const path = FEATURED_PRODUCT_IMAGE_PATHS[product?.id]
    ?? CATEGORY_PLACEHOLDER_PATHS[product?.categorySlug];
  if (!path) throw new Error(`No packaged catalog image for category: ${String(product?.categorySlug)}`);

  const publicOrigin = normalizeCatalogPublicOrigin(options?.publicOrigin);
  return publicOrigin ? `${publicOrigin}${path}` : path;
}

export function getFeaturedProductImagePaths() {
  return { ...FEATURED_PRODUCT_IMAGE_PATHS };
}

export function getCatalogPlaceholderPaths() {
  return { ...CATEGORY_PLACEHOLDER_PATHS };
}
