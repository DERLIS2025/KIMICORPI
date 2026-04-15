export interface Product {
  id: string;
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
  unit: 'm2' | 'unidad' | 'kg';
  minQuantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  description: string;
}

export type View = 'home' | 'catalog' | 'product' | 'budget';
