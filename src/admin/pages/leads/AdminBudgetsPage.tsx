import { useEffect, useState } from 'react';
import { leadsService } from '@/domains/leads/services/leads.service';
import type { BudgetRequest, BudgetStatus } from '@/domains/leads/types/leads.types';
import { toast } from 'sonner';

const statuses: BudgetStatus[] = ['nuevo', 'pendiente', 'atendido', 'cerrado'];

export function AdminBudgetsPage() {
  const [items, setItems] = useState<BudgetRequest[]>([]);
  const [filter, setFilter] = useState<BudgetStatus | ''>('');

  const load = async () => {
    try {
      const data = await leadsService.listBudgetRequests(filter || undefined);
      setItems(data);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error cargando solicitudes');
    }
  };

  useEffect(() => {
    void load();
  }, [filter]);

  const onChangeStatus = async (id: string, status: BudgetStatus) => {
    try {
      await leadsService.updateBudgetStatus(id, status);
      toast.success('Cambios guardados');
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error actualizando estado');
    }
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Solicitudes de Presupuesto</h1>
      </header>

      <div className="rounded-xl border bg-white p-4">
        <label className="text-sm text-slate-600">Filtrar por estado</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value as BudgetStatus | '')} className="mt-2 rounded border px-3 py-2">
          <option value="">Todos</option>
          {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-3 py-2 text-left">Código</th>
              <th className="px-3 py-2 text-left">Total</th>
              <th className="px-3 py-2 text-left">Estado</th>
              <th className="px-3 py-2 text-left">Fecha</th>
              <th className="px-3 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-3 py-2">{item.requestCode}</td>
                <td className="px-3 py-2">{item.totalEstimated.toLocaleString('es-PY')}</td>
                <td className="px-3 py-2">{item.status}</td>
                <td className="px-3 py-2">{new Date(item.createdAt).toLocaleString('es-PY')}</td>
                <td className="px-3 py-2">
                  <select value={item.status} onChange={(e) => void onChangeStatus(item.id, e.target.value as BudgetStatus)} className="rounded border px-2 py-1">
                    {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
