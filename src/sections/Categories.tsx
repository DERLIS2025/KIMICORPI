import { useRef, useEffect, useState } from 'react';
import { Leaf, Droplets, Flower2, Gem, Waves, ArrowRight } from 'lucide-react';
import { useCatalogData } from '@/domains/catalog/hooks/useCatalogData';
import type { View } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  Leaf,
  Droplets,
  Flower2,
  Gem,
  Waves,
};

interface CategoriesProps {
  onViewChange: (view: View) => void;
}

export function Categories({ onViewChange }: CategoriesProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { categories } = useCatalogData();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Explora por categoría</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encuentra todo lo que necesitas para crear y mantener el jardín de tus sueños
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category, index) => {
            const IconComponent = iconMap[category.icon];

            return (
              <button
                key={category.id}
                onClick={() => onViewChange('catalog')}
                className={`group relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-6 text-center transition-all duration-500 hover:shadow-lg hover:border-[#0066b3] hover:-translate-y-1 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-[#0066b3]/10 rounded-xl flex items-center justify-center group-hover:bg-[#0066b3] transition-colors">
                  {IconComponent && <IconComponent className="w-7 h-7 text-[#0066b3] group-hover:text-white transition-colors" />}
                </div>

                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-[#0066b3] transition-colors">{category.name}</h3>

                <p className="text-sm text-gray-500 line-clamp-2">{category.description}</p>

                <div className="mt-4 flex items-center justify-center gap-1 text-[#0066b3] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">Ver productos</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
