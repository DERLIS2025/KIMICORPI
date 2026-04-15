export const appConfig = {
  brand: {
    name: 'CORPI',
    suffix: '& Cia',
    tagline: 'Corpi & Cia - Jardinería Profesional',
  },
  locale: 'es-PY',
  currency: 'PYG',
  contact: {
    whatsappNumber: '595992588770',
    phone: '+595 992 588 770',
    email: 'info@corpicia.com',
    city: 'Asunción, Paraguay',
  },
  social: {
    facebook: 'https://facebook.com/corpi.jardin',
    instagram: 'https://instagram.com/corpi_y_ciaa',
    whatsapp: 'https://wa.me/595992588770',
  },
  promotions: {
    freeShippingThreshold: 500000,
  },
} as const;

export type AppConfig = typeof appConfig;
