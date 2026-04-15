export interface CategoryRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  sort_order: number;
  active: boolean;
}

export interface ProductRow {
  id: string;
  category_id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
  rating: number;
  reviews: number;
  in_stock: boolean;
  badge: string | null;
  features: string[] | null;
  unit: 'm2' | 'unidad' | 'kg';
  min_quantity: number;
  active: boolean;
}
