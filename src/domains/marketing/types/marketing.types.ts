export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta: string;
  ctaTarget: string;
  color: string;
}

export interface BenefitItem {
  id: string;
  icon: 'Truck' | 'Wrench' | 'Headphones' | 'Shield';
  title: string;
  description: string;
}
