import type { BudgetItem } from '@/domains/budget/services/budget.service';

export type BudgetStatus = 'nuevo' | 'pendiente' | 'atendido' | 'cerrado';

export interface BudgetRequest {
  id: string;
  requestCode: string;
  status: BudgetStatus;
  totalEstimated: number;
  createdAt: string;
}

export interface BudgetRequestItemPayload {
  product_id?: string;
  product_name: string;
  quantity: number;
  unit?: string;
  unit_price: number;
  subtotal: number;
  notes?: string;
}

export interface NewsletterLead {
  id: string;
  email: string;
  status: string;
  createdAt: string;
}

export interface CreateBudgetRequestInput {
  items: BudgetItem[];
  totalEstimated: number;
  notes?: string;
}
