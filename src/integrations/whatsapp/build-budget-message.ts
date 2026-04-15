import { formatPrice } from '@/domains/catalog/utils/price';
import { getUnitLabel } from '@/domains/catalog/utils/unit';
import type { Product, ProductUnit } from '@/domains/catalog/types/catalog.types';

export interface WhatsAppBudgetItem {
  product: Product;
  quantity: number;
  unit: ProductUnit;
  notes?: string;
}

export const buildBudgetWhatsAppMessage = (items: WhatsAppBudgetItem[], estimatedTotal: number): string => {
  if (items.length === 0) return '';

  let message = '¡Hola Corpi & Cia! 👋\n\n';
  message += 'Me interesa solicitar un presupuesto para los siguientes productos:\n\n';

  items.forEach((item, index) => {
    const subtotal = item.product.price * item.quantity;
    message += `${index + 1}. *${item.product.name}*\n`;
    message += `   Cantidad: ${item.quantity} ${getUnitLabel(item.unit)}\n`;
    message += `   Precio estimado: ${formatPrice(subtotal)}\n`;
    if (item.notes) {
      message += `   Notas: ${item.notes}\n`;
    }
    message += '\n';
  });

  message += `*Total estimado: ${formatPrice(estimatedTotal)}*\n\n`;
  message += 'Por favor, confirmen disponibilidad y me envían el presupuesto final. ¡Gracias! 🌱';

  return encodeURIComponent(message);
};

export const buildSingleProductWhatsAppMessage = (productName: string, quantity: number, unitLabel: string, estimatedPrice: string): string => {
  const message = `Hola Corpi & Cia, me interesa el producto: ${productName}\nCantidad: ${quantity} ${unitLabel}\nPrecio estimado: ${estimatedPrice}`;
  return encodeURIComponent(message);
};
