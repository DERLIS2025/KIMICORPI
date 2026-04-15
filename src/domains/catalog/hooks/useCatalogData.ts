import { useEffect, useState } from 'react';
import type { Category, Product } from '@/domains/catalog/types/catalog.types';
import { catalogDataService } from '@/domains/catalog/services/catalog-data.service';

export function useCatalogData() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      const [categoriesData, productsData] = await Promise.all([
        catalogDataService.getCategories(),
        catalogDataService.getProducts(),
      ]);

      if (!mounted) return;
      setCategories(categoriesData);
      setProducts(productsData);
      setLoading(false);
    };

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  return { categories, products, loading };
}
