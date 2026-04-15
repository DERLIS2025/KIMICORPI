import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Leaf, Droplets, Flower2 } from 'lucide-react';
import type { View } from '@/types';
import { marketingService } from '@/domains/marketing/services/marketing.service';
import type { HeroSlide } from '@/domains/marketing/types/marketing.types';

interface HeroProps {
  onViewChange: (view: View) => void;
}

const featureCards = [
  { icon: Leaf, title: 'Césped Premium', desc: 'Calidad garantizada' },
  { icon: Droplets, title: 'Riego Inteligente', desc: 'Sistemas automáticos' },
  { icon: Flower2, title: 'Plantas Saludables', desc: 'Selección curada' },
];

export function Hero({ onViewChange }: HeroProps) {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    void marketingService.getHeroSlides().then(setSlides);
  }, []);

  const nextSlide = () => {
    if (isAnimating || slides.length === 0) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating || slides.length === 0) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    if (slides.length === 0) return;
    intervalRef.current = setInterval(nextSlide, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  if (slides.length === 0) {
    return null;
  }

  const slide = slides[currentSlide];

  return (
    <section className="relative bg-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 min-h-[500px] lg:min-h-[600px]">
          <div className="relative z-10 flex flex-col justify-center px-4 sm:px-6 lg:px-12 py-12 lg:py-0 order-2 lg:order-1">
            <div key={slide.id} className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm mb-6">
                <Leaf className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Corpi & Cia - Jardinería Profesional</span>
              </div>

              {slide.badge && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full shadow-sm mb-4 text-sm font-medium">{slide.badge}</div>
              )}

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-2">{slide.title}</h1>
              <p className={`text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r ${slide.color} bg-clip-text text-transparent mb-6`}>
                {slide.subtitle}
              </p>

              <p className="text-lg text-gray-600 mb-8 max-w-md">{slide.description}</p>

              <button
                onClick={() => onViewChange('catalog')}
                className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${slide.color} text-white font-semibold rounded-lg hover:shadow-lg transition-all hover:-translate-y-0.5`}
              >
                {slide.cta}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4 mt-12">
              <button onClick={prevSlide} className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentSlide ? 'w-8 bg-[#0066b3]' : 'bg-gray-300 hover:bg-gray-400'}`}
                  />
                ))}
              </div>
              <button onClick={nextSlide} className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="relative h-64 lg:h-auto order-1 lg:order-2">
            {slides.map((s, index) => (
              <div key={s.id} className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-transparent to-transparent lg:bg-gradient-to-l" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 py-6">
            {featureCards.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <feature.icon className="w-8 h-8 text-[#0066b3] mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
