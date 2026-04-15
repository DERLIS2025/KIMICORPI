import { appConfig } from '@/config/app-config';

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat(appConfig.locale, {
    style: 'currency',
    currency: appConfig.currency,
    minimumFractionDigits: 0,
  }).format(price);
};
