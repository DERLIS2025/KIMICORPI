import { useEffect, useState } from 'react';
import { Truck, Wrench, Headphones, Shield } from 'lucide-react';
import { marketingService } from '@/domains/marketing/services/marketing.service';
import type { BenefitItem } from '@/domains/marketing/types/marketing.types';

const iconMap = {
  Truck,
  Wrench,
  Headphones,
  Shield,
};

export function Benefits() {
  const [benefits, setBenefits] = useState<BenefitItem[]>([]);

  useEffect(() => {
    void marketingService.getBenefits().then(setBenefits);
  }, []);

  if (benefits.length === 0) return null;

  return (
    <section id="servicios" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Nuestras ventajas</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Te ofrecemos soluciones prácticas para que tu experiencia de compra sea más simple, clara y confiable
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit) => {
            const IconComponent = iconMap[benefit.icon];
            return (
              <div key={benefit.id} className="group text-center p-6 rounded-2xl bg-green-50 hover:bg-green-100 transition-colors">
                <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
