import { useEffect, useState } from 'react';
import { catalogDataService } from '@/domains/catalog/services/catalog-data.service';
import type { CategoryRow } from '@/domains/catalog/types/catalog.db.types';

const initialForm = { slug: '', name: '', description: '' };

export function AdminCategoriesPage() {
  const [items, setItems] = useState<CategoryRow[]>([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setItems(await catalogDataService.getCategoriesAdmin());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error cargando categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    await catalogDataService.createCategory(form);
    setForm(initialForm);
    await load();
  };

  const onDelete = async (id: string) => {
    await catalogDataService.deleteCategory(id);
    await load();
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Categorías</h1>
        <p className="text-slate-600">CRUD básico conectado a Supabase.</p>
      </header>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}

      <form onSubmit={onCreate} className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-4">
        <input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} placeholder="slug" className="rounded border px-3 py-2" required />
        <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="nombre" className="rounded border px-3 py-2" required />
        <input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="descripción" className="rounded border px-3 py-2" />
        <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-white">Crear</button>
      </form>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-3 py-2 text-left">Slug</th>
              <th className="px-3 py-2 text-left">Nombre</th>
              <th className="px-3 py-2 text-left">Descripción</th>
              <th className="px-3 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-3 py-3" colSpan={4}>Cargando...</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-3 py-2">{item.slug}</td>
                  <td className="px-3 py-2">{item.name}</td>
                  <td className="px-3 py-2">{item.description}</td>
                  <td className="px-3 py-2">
                    <button onClick={() => void onDelete(item.id)} className="rounded border px-2 py-1 text-red-600">Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
