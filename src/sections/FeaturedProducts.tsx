import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { catalogService } from '@/domains/catalog/services/catalog.service';
import { useCatalogData } from '@/domains/catalog/hooks/useCatalogData';
import type { View } from '@/types';

interface FeaturedProductsProps {
  onViewChange: (view: View) => void;
  onProductSelect: (productSlug: string) => void;
}

export function FeaturedProducts({ onViewChange, onProductSelect }: FeaturedProductsProps) {
  const { products } = useCatalogData();
  const featuredProducts = catalogService.getFeaturedProducts(products);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <span className="inline-block px-3 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-full mb-3">
              Ofertas especiales
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Los más vendidos</h2>
            <p className="text-gray-600 mt-2 max-w-xl">Productos destacados con los mejores precios y calidad garantizada</p>
          </div>
          <Button
            onClick={() => onViewChange('catalog')}
            variant="outline"
            className="mt-4 sm:mt-0 border-[#0066b3] text-[#0066b3] hover:bg-[#0066b3] hover:text-white"
          >
            Ver todos
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onClick={() => onProductSelect(product.slug)} variant="featured" />
          ))}
        </div>
      </div>
    </section>
  );
}
