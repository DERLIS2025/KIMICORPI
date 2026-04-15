import { mockCategories, mockProducts } from '@/domains/catalog/data/mock-catalog.data';
import { catalogService } from '@/domains/catalog/services/catalog.service';
import { formatPrice } from '@/domains/catalog/utils/price';
import { getUnitLabel } from '@/domains/catalog/utils/unit';

export type { Product as ProductWithUnit } from '@/domains/catalog/types/catalog.types';

export const categories = mockCategories;
export const products = mockProducts;

export const getProductsByCategory = (categoryId: string) => catalogService.getProductsByCategory(mockProducts, categoryId);
export const getProductById = (id: string) => catalogService.getProductById(mockProducts, id);
export const getProductBySlug = (slug: string) => catalogService.getProductBySlug(mockProducts, slug);
export const getFeaturedProducts = () => catalogService.getFeaturedProducts(mockProducts);

export { formatPrice, getUnitLabel };
