import { useEffect, useState } from 'react';
import type { BenefitItem } from '@/domains/marketing/types/marketing.types';
import { marketingService } from '@/domains/marketing/services/marketing.service';

const initialForm: Partial<BenefitItem> = {
  icon: 'Shield',
  title: '',
  description: '',
  sortOrder: 0,
  active: true,
};

export function AdminBenefitsPage() {
  const [items, setItems] = useState<BenefitItem[]>([]);
  const [form, setForm] = useState<Partial<BenefitItem>>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = async () => setItems(await marketingService.getBenefitsAdmin());

  useEffect(() => {
    void load();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      await marketingService.updateBenefit(editingId, form);
      setEditingId(null);
    } else {
      await marketingService.createBenefit(form);
    }

    setForm(initialForm);
    await load();
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Benefits</h1>
        <p className="text-slate-600">CRUD: icono, título, descripción, orden y estado.</p>
      </header>

      <form onSubmit={onSubmit} className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-4">
        <select value={form.icon} onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value as BenefitItem['icon'] }))} className="rounded border px-3 py-2">
          <option value="Shield">Shield</option>
          <option value="Truck">Truck</option>
          <option value="Wrench">Wrench</option>
          <option value="Headphones">Headphones</option>
        </select>
        <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Título" className="rounded border px-3 py-2" required />
        <input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Descripción" className="rounded border px-3 py-2" required />
        <input type="number" value={form.sortOrder} onChange={(e) => setForm((p) => ({ ...p, sortOrder: Number(e.target.value) }))} placeholder="Orden" className="rounded border px-3 py-2" />
        <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-white">{editingId ? 'Guardar cambios' : 'Crear beneficio'}</button>
      </form>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border bg-white p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-slate-600">{item.description}</p>
                <p className="text-xs text-slate-500">{item.icon} · Orden: {item.sortOrder} · {item.active ? 'Activo' : 'Inactivo'}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => { setEditingId(item.id); setForm(item); }} className="rounded border px-3 py-1 text-sm">Editar</button>
                <button onClick={() => void marketingService.updateBenefit(item.id, { active: !item.active }).then(load)} className="rounded border px-3 py-1 text-sm">
                  {item.active ? 'Desactivar' : 'Activar'}
                </button>
                <button onClick={() => void marketingService.updateBenefit(item.id, { sortOrder: (item.sortOrder || 0) - 1 }).then(load)} className="rounded border px-3 py-1 text-sm">↑</button>
                <button onClick={() => void marketingService.updateBenefit(item.id, { sortOrder: (item.sortOrder || 0) + 1 }).then(load)} className="rounded border px-3 py-1 text-sm">↓</button>
                <button onClick={() => void marketingService.deleteBenefit(item.id).then(load)} className="rounded border px-3 py-1 text-sm text-red-600">Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
