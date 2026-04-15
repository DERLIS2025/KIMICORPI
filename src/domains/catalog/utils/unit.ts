import type { ProductUnit } from '@/domains/catalog/types/catalog.types';

export const getUnitLabel = (unit: ProductUnit): string => {
  switch (unit) {
    case 'm2':
      return 'm²';
    case 'unidad':
      return 'unidad';
    case 'kg':
      return 'kg';
    default:
      return unit;
  }
};

export const getStepByUnit = (unit: ProductUnit): number => {
  return unit === 'm2' ? 5 : 1;
};
