import { useEffect, useState } from 'react';
import { leadsService } from '@/domains/leads/services/leads.service';
import type { NewsletterLead } from '@/domains/leads/types/leads.types';

export function AdminLeadsPage() {
  const [items, setItems] = useState<NewsletterLead[]>([]);

  useEffect(() => {
    void leadsService.listNewsletterLeads().then(setItems);
  }, []);

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Leads Newsletter</h1>
      </header>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Estado</th>
              <th className="px-3 py-2 text-left">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-3 py-2">{item.email}</td>
                <td className="px-3 py-2">{item.status}</td>
                <td className="px-3 py-2">{new Date(item.createdAt).toLocaleString('es-PY')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
