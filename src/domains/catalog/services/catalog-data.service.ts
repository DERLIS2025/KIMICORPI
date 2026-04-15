import type { Category, Product } from '@/domains/catalog/types/catalog.types';
import type { CategoryRow, ProductRow } from '@/domains/catalog/types/catalog.db.types';
import { mockCategories, mockProducts } from '@/domains/catalog/data/mock-catalog.data';
import { supabaseConfig, supabaseRest } from '@/integrations/supabase/client';

let productsCache: Product[] | null = null;
let categoriesCache: Category[] | null = null;

const mapCategory = (row: CategoryRow): Category => ({
  id: row.slug,
  name: row.name,
  icon: row.icon || 'Leaf',
  image: row.image_url || '/hero-jardin.jpg',
  description: row.description || '',
});

const mapProduct = (row: ProductRow, categorySlugById: Record<string, string>): Product => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  description: row.description || '',
  price: Number(row.price),
  originalPrice: row.original_price ? Number(row.original_price) : undefined,
  image: row.image_url || '/hero-jardin.jpg',
  category: categorySlugById[row.category_id] || 'general',
  rating: row.rating,
  reviews: row.reviews,
  inStock: row.in_stock,
  badge: row.badge || undefined,
  features: row.features || undefined,
  unit: row.unit,
  minQuantity: row.min_quantity,
});

const isSupabaseReady = () => supabaseConfig.enabled;

interface ProductsAdminPageFilters {
  categoryId?: string;
  search?: string;
}

interface ProductsAdminPageOptions {
  limit: number;
  offset: number;
  filters?: ProductsAdminPageFilters;
}

interface ProductsAdminPageResult {
  items: ProductRow[];
  total: number;
}

export const catalogDataService = {
  clearCache() {
    productsCache = null;
    categoriesCache = null;
  },

  async getCategories(): Promise<Category[]> {
    if (categoriesCache) return categoriesCache;

    if (!isSupabaseReady()) {
      categoriesCache = mockCategories;
      return categoriesCache;
    }

    try {
      const rows = await supabaseRest<CategoryRow[]>('categories', {
        query: { select: 'id,slug,name,description,icon,image_url,sort_order,active', order: 'sort_order.asc' },
      });

      categoriesCache = rows.map(mapCategory);
      return categoriesCache;
    } catch {
      categoriesCache = mockCategories;
      return categoriesCache;
    }
  },

  async getProducts(): Promise<Product[]> {
    if (productsCache) return productsCache;

    if (!isSupabaseReady()) {
      productsCache = mockProducts;
      return productsCache;
    }

    try {
      const [categoriesRows, productsRows] = await Promise.all([
        supabaseRest<CategoryRow[]>('categories', { query: { select: 'id,slug', order: 'sort_order.asc' } }),
        supabaseRest<ProductRow[]>('products', {
          query: {
            select: 'id,category_id,slug,name,description,price,original_price,image_url,rating,reviews,in_stock,badge,features,unit,min_quantity,active',
            order: 'created_at.desc',
          },
        }),
      ]);

      const slugById = Object.fromEntries(categoriesRows.map((category) => [category.id, category.slug]));
      productsCache = productsRows.map((row) => mapProduct(row, slugById));
      return productsCache;
    } catch {
      productsCache = mockProducts;
      return productsCache;
    }
  },

  async createCategory(payload: { slug: string; name: string; description?: string; icon?: string; image_url?: string }) {
    const rows = await supabaseRest<CategoryRow[]>('categories', {
      method: 'POST',
      useAuth: true,
      body: [{ ...payload, active: true }],
    });
    this.clearCache();
    return rows[0];
  },

  async updateCategory(id: string, payload: Partial<{ slug: string; name: string; description: string; icon: string; image_url: string }>) {
    const rows = await supabaseRest<CategoryRow[]>(`categories`, {
      method: 'PATCH',
      useAuth: true,
      query: { id: `eq.${id}` },
      body: payload,
    });
    this.clearCache();
    return rows[0];
  },

  async deleteCategory(id: string) {
    await supabaseRest<void>('categories', {
      method: 'DELETE',
      useAuth: true,
      query: { id: `eq.${id}` },
    });
    this.clearCache();
  },

  async getCategoriesAdmin(): Promise<CategoryRow[]> {
    return supabaseRest<CategoryRow[]>('categories', {
      useAuth: true,
      query: { select: 'id,slug,name,description,icon,image_url,sort_order,active', order: 'sort_order.asc' },
    });
  },

  async getProductsAdmin(): Promise<ProductRow[]> {
    return supabaseRest<ProductRow[]>('products', {
      useAuth: true,
      query: {
        select: 'id,category_id,slug,name,description,price,original_price,image_url,rating,reviews,in_stock,badge,features,unit,min_quantity,active',
        order: 'created_at.desc',
      },
    });
  },

  async getProductsAdminPage({
    limit,
    offset,
    filters,
  }: ProductsAdminPageOptions): Promise<ProductsAdminPageResult> {
    const baseFilters: Record<string, string> = {};

    if (filters?.categoryId) {
      baseFilters.category_id = `eq.${filters.categoryId}`;
    }

    if (filters?.search?.trim()) {
      baseFilters.name = `ilike.*${filters.search.trim()}*`;
    }

    const items = await supabaseRest<ProductRow[]>('products', {
      useAuth: true,
      query: {
        select: 'id,category_id,slug,name,description,price,original_price,image_url,rating,reviews,in_stock,badge,features,unit,min_quantity,active',
        order: 'created_at.desc',
        limit: String(limit),
        offset: String(offset),
        ...baseFilters,
      },
    });

    const totalRows = await supabaseRest<Array<{ id: string }>>('products', {
      useAuth: true,
      query: {
        select: 'id',
        ...baseFilters,
      },
    });

    return {
      items,
      total: totalRows.length,
    };
  },

  async createProduct(payload: {
    category_id: string;
    slug: string;
    name: string;
    description?: string;
    price: number;
    original_price?: number | null;
    image_url?: string;
    unit: 'm2' | 'unidad' | 'kg';
    min_quantity: number;
  }) {
    const rows = await supabaseRest<ProductRow[]>('products', {
      method: 'POST',
      useAuth: true,
      body: [{ ...payload, active: true, in_stock: true, rating: 5, reviews: 0, features: [] }],
    });
    this.clearCache();
    return rows[0];
  },

  async updateProduct(id: string, payload: Partial<ProductRow>) {
    const rows = await supabaseRest<ProductRow[]>('products', {
      method: 'PATCH',
      useAuth: true,
      query: { id: `eq.${id}` },
      body: payload,
    });
    this.clearCache();
    return rows[0];
  },

  async deleteProduct(id: string) {
    await supabaseRest<void>('products', {
      method: 'DELETE',
      useAuth: true,
      query: { id: `eq.${id}` },
    });
    this.clearCache();
  },
};
