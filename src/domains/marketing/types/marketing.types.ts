export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  description: string;
  image: string;
  cta: string;
  ctaTarget: string;
  color: string;
  active?: boolean;
  sortOrder?: number;
}

export interface BenefitItem {
  id: string;
  icon: 'Truck' | 'Wrench' | 'Headphones' | 'Shield';
  title: string;
  description: string;
  active?: boolean;
  sortOrder?: number;
}
