import type { BenefitItem, HeroSlide } from '@/domains/marketing/types/marketing.types';
import { supabaseConfig, supabaseRest } from '@/integrations/supabase/client';

interface HeroSlideRow {
  id: string;
  title: string;
  subtitle: string;
  badge: string | null;
  description: string | null;
  image_url: string | null;
  cta_label: string | null;
  cta_target: string | null;
  gradient: string | null;
  active: boolean;
  sort_order: number;
}

interface BenefitRow {
  id: string;
  icon: BenefitItem['icon'];
  title: string;
  description: string | null;
  active: boolean;
  sort_order: number;
}

const fallbackSlides: HeroSlide[] = [
  {
    id: '1',
    badge: 'Destacado',
    title: 'Transforma tu jardín',
    subtitle: 'con césped premium',
    description: 'Rollos de césped natural de la más alta calidad. Instalación profesional incluida.',
    image: '/hero-jardin.jpg',
    cta: 'Ver césped',
    ctaTarget: '/catalogo',
    color: 'from-green-600 to-green-800',
    active: true,
    sortOrder: 0,
  },
  {
    id: '2',
    badge: 'Riego',
    title: 'Riego inteligente',
    subtitle: 'ahorra agua y tiempo',
    description: 'Sistemas de riego automático diseñados para tu espacio verde.',
    image: '/riego-automatico.jpg',
    cta: 'Ver sistemas de riego',
    ctaTarget: '/catalogo',
    color: 'from-blue-600 to-blue-800',
    active: true,
    sortOrder: 1,
  },
];

const fallbackBenefits: BenefitItem[] = [
  { id: '1', icon: 'Truck', title: 'Cobertura nacional', description: 'Trabajamos en todo Paraguay con envíos a cualquier ubicación', active: true, sortOrder: 0 },
  { id: '2', icon: 'Wrench', title: 'Instalación profesional', description: 'Servicio completo de instalación por expertos certificados', active: true, sortOrder: 1 },
  { id: '3', icon: 'Headphones', title: 'Atención personalizada', description: 'Soporte directo vía WhatsApp para resolver tus dudas', active: true, sortOrder: 2 },
  { id: '4', icon: 'Shield', title: 'Garantía de calidad', description: 'Todos nuestros productos cuentan con garantía', active: true, sortOrder: 3 },
];

let slidesCache: HeroSlide[] | null = null;
let benefitsCache: BenefitItem[] | null = null;

const mapSlide = (row: HeroSlideRow): HeroSlide => ({
  id: row.id,
  title: row.title,
  subtitle: row.subtitle,
  badge: row.badge || undefined,
  description: row.description || '',
  image: row.image_url || '/hero-jardin.jpg',
  cta: row.cta_label || 'Ver catálogo',
  ctaTarget: row.cta_target || '/catalogo',
  color: row.gradient || 'from-green-600 to-green-800',
  active: row.active,
  sortOrder: row.sort_order,
});

const mapBenefit = (row: BenefitRow): BenefitItem => ({
  id: row.id,
  icon: row.icon,
  title: row.title,
  description: row.description || '',
  active: row.active,
  sortOrder: row.sort_order,
});

export const marketingService = {
  clearCache() {
    slidesCache = null;
    benefitsCache = null;
  },

  async getHeroSlides(): Promise<HeroSlide[]> {
    if (slidesCache) return slidesCache;
    if (!supabaseConfig.enabled) {
      slidesCache = fallbackSlides;
      return slidesCache;
    }

    try {
      const rows = await supabaseRest<HeroSlideRow[]>('hero_slides', {
        query: {
          select: 'id,title,subtitle,badge,description,image_url,cta_label,cta_target,gradient,active,sort_order',
          order: 'sort_order.asc',
        },
      });

      slidesCache = rows.filter((row) => row.active).map(mapSlide);
      return slidesCache;
    } catch {
      slidesCache = fallbackSlides;
      return slidesCache;
    }
  },

  async getHeroSlidesAdmin(): Promise<HeroSlide[]> {
    const rows = await supabaseRest<HeroSlideRow[]>('hero_slides', {
      useAuth: true,
      query: {
        select: 'id,title,subtitle,badge,description,image_url,cta_label,cta_target,gradient,active,sort_order',
        order: 'sort_order.asc',
      },
    });
    return rows.map(mapSlide);
  },

  async createHeroSlide(payload: Partial<HeroSlide>) {
    await supabaseRest('hero_slides', {
      method: 'POST',
      useAuth: true,
      body: [{
        title: payload.title,
        subtitle: payload.subtitle,
        badge: payload.badge || null,
        description: payload.description || '',
        image_url: payload.image || null,
        cta_label: payload.cta || null,
        cta_target: payload.ctaTarget || '/catalogo',
        gradient: payload.color || 'from-green-600 to-green-800',
        active: payload.active ?? true,
        sort_order: payload.sortOrder ?? 0,
      }],
    });
    this.clearCache();
  },

  async updateHeroSlide(id: string, payload: Partial<HeroSlide>) {
    await supabaseRest('hero_slides', {
      method: 'PATCH',
      useAuth: true,
      query: { id: `eq.${id}` },
      body: {
        ...(payload.title !== undefined ? { title: payload.title } : {}),
        ...(payload.subtitle !== undefined ? { subtitle: payload.subtitle } : {}),
        ...(payload.badge !== undefined ? { badge: payload.badge } : {}),
        ...(payload.description !== undefined ? { description: payload.description } : {}),
        ...(payload.image !== undefined ? { image_url: payload.image } : {}),
        ...(payload.cta !== undefined ? { cta_label: payload.cta } : {}),
        ...(payload.ctaTarget !== undefined ? { cta_target: payload.ctaTarget } : {}),
        ...(payload.color !== undefined ? { gradient: payload.color } : {}),
        ...(payload.active !== undefined ? { active: payload.active } : {}),
        ...(payload.sortOrder !== undefined ? { sort_order: payload.sortOrder } : {}),
      },
    });
    this.clearCache();
  },

  async deleteHeroSlide(id: string) {
    await supabaseRest('hero_slides', {
      method: 'DELETE',
      useAuth: true,
      query: { id: `eq.${id}` },
    });
    this.clearCache();
  },

  async getBenefits(): Promise<BenefitItem[]> {
    if (benefitsCache) return benefitsCache;
    if (!supabaseConfig.enabled) {
      benefitsCache = fallbackBenefits;
      return benefitsCache;
    }

    try {
      const rows = await supabaseRest<BenefitRow[]>('benefits', {
        query: { select: 'id,icon,title,description,active,sort_order', order: 'sort_order.asc' },
      });
      benefitsCache = rows.filter((row) => row.active).map(mapBenefit);
      return benefitsCache;
    } catch {
      benefitsCache = fallbackBenefits;
      return benefitsCache;
    }
  },

  async getBenefitsAdmin(): Promise<BenefitItem[]> {
    const rows = await supabaseRest<BenefitRow[]>('benefits', {
      useAuth: true,
      query: { select: 'id,icon,title,description,active,sort_order', order: 'sort_order.asc' },
    });
    return rows.map(mapBenefit);
  },

  async createBenefit(payload: Partial<BenefitItem>) {
    await supabaseRest('benefits', {
      method: 'POST',
      useAuth: true,
      body: [{
        icon: payload.icon || 'Shield',
        title: payload.title,
        description: payload.description || '',
        active: payload.active ?? true,
        sort_order: payload.sortOrder ?? 0,
      }],
    });
    this.clearCache();
  },

  async updateBenefit(id: string, payload: Partial<BenefitItem>) {
    await supabaseRest('benefits', {
      method: 'PATCH',
      useAuth: true,
      query: { id: `eq.${id}` },
      body: {
        ...(payload.icon !== undefined ? { icon: payload.icon } : {}),
        ...(payload.title !== undefined ? { title: payload.title } : {}),
        ...(payload.description !== undefined ? { description: payload.description } : {}),
        ...(payload.active !== undefined ? { active: payload.active } : {}),
        ...(payload.sortOrder !== undefined ? { sort_order: payload.sortOrder } : {}),
      },
    });
    this.clearCache();
  },

  async deleteBenefit(id: string) {
    await supabaseRest('benefits', {
      method: 'DELETE',
      useAuth: true,
      query: { id: `eq.${id}` },
    });
    this.clearCache();
  },
};
