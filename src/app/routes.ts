import type { View } from '@/types';

export const appPaths = {
  home: '/',
  catalog: '/catalogo',
  product: '/producto/:slug',
  budget: '/presupuesto',
  adminLogin: '/admin/login',
  adminHome: '/admin',
  adminProducts: '/admin/products',
  adminCategories: '/admin/categories',
  adminHeroSlides: '/admin/hero-slides',
  adminBenefits: '/admin/benefits',
  adminSiteSettings: '/admin/site-settings',
  adminBudgets: '/admin/budgets',
  adminLeads: '/admin/leads',
} as const;

export const viewToPath: Record<Exclude<View, 'product'>, string> = {
  home: appPaths.home,
  catalog: appPaths.catalog,
  budget: appPaths.budget,
};

export const pathToView = (pathname: string): View => {
  if (pathname.startsWith('/catalogo')) return 'catalog';
  if (pathname.startsWith('/producto/')) return 'product';
  if (pathname.startsWith('/presupuesto')) return 'budget';
  return 'home';
};
