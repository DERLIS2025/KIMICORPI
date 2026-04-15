import type { Product } from '@/domains/catalog/types/catalog.types';

export const catalogService = {
  getProductsByCategory(products: Product[], categoryId: string): Product[] {
    return products.filter((product) => product.category === categoryId);
  },

  getProductBySlug(products: Product[], slug: string): Product | undefined {
    return products.find((product) => product.slug === slug);
  },

  getProductById(products: Product[], id: string): Product | undefined {
    return products.find((product) => product.id === id);
  },

  getFeaturedProducts(products: Product[]): Product[] {
    return products.filter((product) => product.badge);
  },
};
