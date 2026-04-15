import type { Product, ProductUnit } from '@/domains/catalog/types/catalog.types';
import { buildBudgetWhatsAppMessage, type WhatsAppBudgetItem } from '@/integrations/whatsapp/build-budget-message';

export interface BudgetItem extends WhatsAppBudgetItem {
  product: Product;
  quantity: number;
  unit: ProductUnit;
  notes?: string;
}

export const budgetService = {
  calculateTotalItems(items: BudgetItem[]): number {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  },

  calculateEstimatedTotal(items: BudgetItem[]): number {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  },

  buildWhatsAppMessage(items: BudgetItem[]): string {
    const estimatedTotal = this.calculateEstimatedTotal(items);
    return buildBudgetWhatsAppMessage(items as WhatsAppBudgetItem[], estimatedTotal);
  },
};
