import { supabaseConfig, supabaseRest } from '@/integrations/supabase/client';
import type { BudgetItem } from '@/domains/budget/services/budget.service';
import type { BudgetRequest, BudgetStatus, CreateBudgetRequestInput, NewsletterLead } from '@/domains/leads/types/leads.types';

interface BudgetRequestRow {
  id: string;
  request_code: string;
  status: BudgetStatus;
  total_estimated: number;
  created_at: string;
}

interface NewsletterLeadRow {
  id: string;
  email: string;
  status: string;
  created_at: string;
}

const generateRequestCode = () => `BR-${Date.now().toString().slice(-8)}`;

const mapBudget = (row: BudgetRequestRow): BudgetRequest => ({
  id: row.id,
  requestCode: row.request_code,
  status: row.status,
  totalEstimated: Number(row.total_estimated),
  createdAt: row.created_at,
});

const mapLead = (row: NewsletterLeadRow): NewsletterLead => ({
  id: row.id,
  email: row.email,
  status: row.status,
  createdAt: row.created_at,
});

export const leadsService = {
  async createBudgetRequest(input: CreateBudgetRequestInput): Promise<string | null> {
    if (!supabaseConfig.enabled) return null;

    const requestCode = generateRequestCode();

    const requestRows = await supabaseRest<BudgetRequestRow[]>('budget_requests', {
      method: 'POST',
      body: [{
        request_code: requestCode,
        total_estimated: input.totalEstimated,
        notes: input.notes || null,
        status: 'nuevo',
      }],
    });

    const request = requestRows[0];

    const itemsPayload = input.items.map((item: BudgetItem) => ({
      budget_request_id: request.id,
      product_id: item.product.id,
      product_name: item.product.name,
      quantity: item.quantity,
      unit: item.unit,
      unit_price: item.product.price,
      subtotal: item.product.price * item.quantity,
      notes: item.notes || null,
    }));

    await supabaseRest('budget_request_items', {
      method: 'POST',
      body: itemsPayload,
    });

    return requestCode;
  },

  async listBudgetRequests(status?: BudgetStatus): Promise<BudgetRequest[]> {
    const query: Record<string, string> = {
      select: 'id,request_code,status,total_estimated,created_at',
      order: 'created_at.desc',
    };

    if (status) query.status = `eq.${status}`;

    const rows = await supabaseRest<BudgetRequestRow[]>('budget_requests', {
      useAuth: true,
      query,
    });

    return rows.map(mapBudget);
  },

  async updateBudgetStatus(id: string, status: BudgetStatus): Promise<void> {
    await supabaseRest('budget_requests', {
      method: 'PATCH',
      useAuth: true,
      query: { id: `eq.${id}` },
      body: { status },
    });
  },

  async subscribeNewsletter(email: string): Promise<void> {
    if (!supabaseConfig.enabled) return;

    await supabaseRest('newsletter_subscribers', {
      method: 'POST',
      body: [{ email, status: 'active', source: 'web' }],
    });
  },

  async listNewsletterLeads(): Promise<NewsletterLead[]> {
    const rows = await supabaseRest<NewsletterLeadRow[]>('newsletter_subscribers', {
      useAuth: true,
      query: { select: 'id,email,status,created_at', order: 'created_at.desc' },
    });

    return rows.map(mapLead);
  },
};
