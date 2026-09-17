export type Product = {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  subcategory: string;
  price: number;
  oldPrice: number | null;
  unit: string;
  packageSize: string;
  image: string;
  inStock: boolean;
  isPromo: boolean;
  tags: string[];
  description: string;
  brand: string | null;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  sortOrder: number;
};

export type RetailerCatalog = {
  id: string;
  name: string;
  currency: string;
  products: Product[];
  categories: Category[];
  getProductById(productId: string): Product | null;
};
