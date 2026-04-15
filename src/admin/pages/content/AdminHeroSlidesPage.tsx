import { useEffect, useState } from 'react';
import type { HeroSlide } from '@/domains/marketing/types/marketing.types';
import { marketingService } from '@/domains/marketing/services/marketing.service';
import { toast } from 'sonner';

const initialForm: Partial<HeroSlide> = {
  title: '',
  subtitle: '',
  badge: '',
  description: '',
  cta: '',
  ctaTarget: '/catalogo',
  image: '',
  color: 'from-green-600 to-green-800',
  sortOrder: 0,
  active: true,
};

export function AdminHeroSlidesPage() {
  const [items, setItems] = useState<HeroSlide[]>([]);
  const [form, setForm] = useState<Partial<HeroSlide>>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = async () => {
    try {
      setItems(await marketingService.getHeroSlidesAdmin());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error cargando slides');
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await marketingService.updateHeroSlide(editingId, form);
        setEditingId(null);
        toast.success('Cambios guardados');
      } else {
        await marketingService.createHeroSlide(form);
        toast.success('Creado correctamente');
      }

      setForm(initialForm);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error guardando slide');
    }
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Hero Slides</h1>
        <p className="text-slate-600">CRUD completo: título, subtítulo, badge, CTA, link, imagen, orden y estado.</p>
      </header>

      <form onSubmit={onSubmit} className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-3">
        <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Título" className="rounded border px-3 py-2" required />
        <input value={form.subtitle} onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))} placeholder="Subtítulo" className="rounded border px-3 py-2" required />
        <input value={form.badge} onChange={(e) => setForm((p) => ({ ...p, badge: e.target.value }))} placeholder="Badge" className="rounded border px-3 py-2" />
        <input value={form.cta} onChange={(e) => setForm((p) => ({ ...p, cta: e.target.value }))} placeholder="Texto CTA" className="rounded border px-3 py-2" />
        <input value={form.ctaTarget} onChange={(e) => setForm((p) => ({ ...p, ctaTarget: e.target.value }))} placeholder="Link CTA" className="rounded border px-3 py-2" />
        <input value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} placeholder="URL Imagen" className="rounded border px-3 py-2" />
        <input value={form.color} onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))} placeholder="Gradiente" className="rounded border px-3 py-2" />
        <input type="number" value={form.sortOrder} onChange={(e) => setForm((p) => ({ ...p, sortOrder: Number(e.target.value) }))} placeholder="Orden" className="rounded border px-3 py-2" />
        <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-white">{editingId ? 'Guardar cambios' : 'Crear slide'}</button>
      </form>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border bg-white p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-slate-600">{item.subtitle}</p>
                <p className="text-xs text-slate-500">Orden: {item.sortOrder} · {item.active ? 'Activo' : 'Inactivo'}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => { setEditingId(item.id); setForm(item); }} className="rounded border px-3 py-1 text-sm">Editar</button>
                <button onClick={() => void marketingService.updateHeroSlide(item.id, { active: !item.active }).then(() => { toast.success('Cambios guardados'); return load(); }).catch((e) => { toast.error(e instanceof Error ? e.message : 'Error guardando cambios'); })} className="rounded border px-3 py-1 text-sm">
                  {item.active ? 'Desactivar' : 'Activar'}
                </button>
                <button onClick={() => void marketingService.updateHeroSlide(item.id, { sortOrder: (item.sortOrder || 0) - 1 }).then(() => { toast.success('Cambios guardados'); return load(); }).catch((e) => { toast.error(e instanceof Error ? e.message : 'Error guardando cambios'); })} className="rounded border px-3 py-1 text-sm">↑</button>
                <button onClick={() => void marketingService.updateHeroSlide(item.id, { sortOrder: (item.sortOrder || 0) + 1 }).then(() => { toast.success('Cambios guardados'); return load(); }).catch((e) => { toast.error(e instanceof Error ? e.message : 'Error guardando cambios'); })} className="rounded border px-3 py-1 text-sm">↓</button>
                <button onClick={() => void marketingService.deleteHeroSlide(item.id).then(() => { toast.success('Eliminado correctamente'); return load(); }).catch((e) => { toast.error(e instanceof Error ? e.message : 'Error eliminando slide'); })} className="rounded border px-3 py-1 text-sm text-red-600">Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
