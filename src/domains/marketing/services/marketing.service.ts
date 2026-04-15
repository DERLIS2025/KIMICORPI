import type { BenefitItem, HeroSlide } from '@/domains/marketing/types/marketing.types';
import { supabaseConfig, supabaseRest } from '@/integrations/supabase/client';

interface HeroSlideRow {
  id: string;
  title: string;
  subtitle: string;
  description: string | null;
  image_url: string | null;
  cta_label: string | null;
  cta_target: string | null;
  gradient: string | null;
}

interface BenefitRow {
  id: string;
  icon: BenefitItem['icon'];
  title: string;
  description: string | null;
}

const fallbackSlides: HeroSlide[] = [
  {
    id: '1',
    title: 'Transforma tu jardín',
    subtitle: 'con césped premium',
    description: 'Rollos de césped natural de la más alta calidad. Instalación profesional incluida.',
    image: '/hero-jardin.jpg',
    cta: 'Ver césped',
    ctaTarget: '/catalogo',
    color: 'from-green-600 to-green-800',
  },
  {
    id: '2',
    title: 'Riego inteligente',
    subtitle: 'ahorra agua y tiempo',
    description: 'Sistemas de riego automático diseñados para tu espacio verde.',
    image: '/riego-automatico.jpg',
    cta: 'Ver sistemas de riego',
    ctaTarget: '/catalogo',
    color: 'from-blue-600 to-blue-800',
  },
  {
    id: '3',
    title: 'Plantas que dan vida',
    subtitle: 'a tu hogar',
    description: 'Selección de plantas ornamentales para interior y exterior.',
    image: '/planta-ornamental.jpg',
    cta: 'Ver plantas',
    ctaTarget: '/catalogo',
    color: 'from-emerald-600 to-emerald-800',
  },
];

const fallbackBenefits: BenefitItem[] = [
  { id: '1', icon: 'Truck', title: 'Cobertura nacional', description: 'Trabajamos en todo Paraguay con envíos a cualquier ubicación' },
  { id: '2', icon: 'Wrench', title: 'Instalación profesional', description: 'Servicio completo de instalación por expertos certificados' },
  { id: '3', icon: 'Headphones', title: 'Atención personalizada', description: 'Soporte directo vía WhatsApp para resolver tus dudas' },
  { id: '4', icon: 'Shield', title: 'Garantía de calidad', description: 'Todos nuestros productos cuentan con garantía' },
];

let slidesCache: HeroSlide[] | null = null;
let benefitsCache: BenefitItem[] | null = null;

export const marketingService = {
  async getHeroSlides(): Promise<HeroSlide[]> {
    if (slidesCache) return slidesCache;
    if (!supabaseConfig.enabled) {
      slidesCache = fallbackSlides;
      return slidesCache;
    }

    try {
      const rows = await supabaseRest<HeroSlideRow[]>('hero_slides', {
        query: {
          select: 'id,title,subtitle,description,image_url,cta_label,cta_target,gradient',
          order: 'sort_order.asc',
        },
      });

      slidesCache = rows.map((row) => ({
        id: row.id,
        title: row.title,
        subtitle: row.subtitle,
        description: row.description || '',
        image: row.image_url || '/hero-jardin.jpg',
        cta: row.cta_label || 'Ver catálogo',
        ctaTarget: row.cta_target || '/catalogo',
        color: row.gradient || 'from-green-600 to-green-800',
      }));
      return slidesCache;
    } catch {
      slidesCache = fallbackSlides;
      return slidesCache;
    }
  },

  async getBenefits(): Promise<BenefitItem[]> {
    if (benefitsCache) return benefitsCache;
    if (!supabaseConfig.enabled) {
      benefitsCache = fallbackBenefits;
      return benefitsCache;
    }

    try {
      const rows = await supabaseRest<BenefitRow[]>('benefits', {
        query: { select: 'id,icon,title,description', order: 'sort_order.asc' },
      });
      benefitsCache = rows.map((row) => ({
        id: row.id,
        icon: row.icon,
        title: row.title,
        description: row.description || '',
      }));
      return benefitsCache;
    } catch {
      benefitsCache = fallbackBenefits;
      return benefitsCache;
    }
  },
};
