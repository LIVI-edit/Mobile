import { categories } from './categories';
import { products } from './products';
import type { RetailerCatalog } from '../types';

const productsById = new Map(products.map((product) => [product.id, product]));

export const demoRetailer: RetailerCatalog = {
  id: 'demo-retailer-1',
  name: 'Demo Retailer',
  currency: 'USD',
  products,
  categories,
  getProductById(productId: string) {
    return productsById.get(productId) ?? null;
  },
};
