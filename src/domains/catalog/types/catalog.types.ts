export type ProductUnit = 'm2' | 'unidad' | 'kg';

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  subcategory?: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  badge?: string;
  features?: string[];
  unit: ProductUnit;
  minQuantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  description: string;
}
