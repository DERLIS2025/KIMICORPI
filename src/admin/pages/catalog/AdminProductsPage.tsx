import { useCallback, useEffect, useState } from 'react';
import { catalogDataService } from '@/domains/catalog/services/catalog-data.service';
import type { CategoryRow, ProductRow } from '@/domains/catalog/types/catalog.db.types';
import { supabase } from '@/integrations/supabase/client';

const initialForm = {
  category_id: '',
  slug: '',
  name: '',
  description: '',
  price: 0,
  image_url: '',
  unit: 'unidad' as const,
  min_quantity: 1,
};

export function AdminProductsPage() {
  const [items, setItems] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        catalogDataService.getCategoriesAdmin(),
        catalogDataService.getProductsAdmin(),
      ]);
      setCategories(categoriesRes);
      setItems(productsRes);

      if (!form.category_id && categoriesRes[0]) {
        setForm((prev) => ({ ...prev, category_id: categoriesRes[0].id }));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error cargando productos');
    } finally {
      setLoading(false);
    }
  }, [form.category_id]);

  useEffect(() => {
    void load();
  }, [load]);

  const onCreate = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      let imageUrl = '';

      // 🔥 subir imagen automáticamente
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('images')
          .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
      }

      await catalogDataService.createProduct({
        ...form,
        image_url: imageUrl,
      });

      setForm((prev) => ({
        ...initialForm,
        category_id: prev.category_id,
      }));

      setImageFile(null);

      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error creando producto');
    }
  };

  const onDelete = async (id: string) => {
    await catalogDataService.deleteProduct(id);
    await load();
  };

  const categoryNameById = Object.fromEntries(
    categories.map((category) => [category.id, category.name])
  );

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Productos</h1>
        <p className="text-slate-600">CRUD básico conectado a Supabase.</p>
      </header>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={onCreate}
        className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-4"
      >
        <select
          value={form.category_id}
          onChange={(e) =>
            setForm((p) => ({ ...p, category_id: e.target.value }))
          }
          className="rounded border px-3 py-2"
          required
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          value={form.slug}
          onChange={(e) =>
            setForm((p) => ({ ...p, slug: e.target.value }))
          }
          placeholder="slug"
          className="rounded border px-3 py-2"
          required
        />

        <input
          value={form.name}
          onChange={(e) =>
            setForm((p) => ({ ...p, name: e.target.value }))
          }
          placeholder="nombre"
          className="rounded border px-3 py-2"
          required
        />

        <input
          type="number"
          value={form.price}
          onChange={(e) =>
            setForm((p) => ({ ...p, price: Number(e.target.value) }))
          }
          placeholder="precio"
          className="rounded border px-3 py-2"
          required
        />

        <input
          value={form.description}
          onChange={(e) =>
            setForm((p) => ({ ...p, description: e.target.value }))
          }
          placeholder="descripción"
          className="rounded border px-3 py-2 md:col-span-2"
        />

        {/* 🔥 SOLO SUBIR IMAGEN DESDE PC */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="rounded border px-3 py-2"
        />

        <select
          value={form.unit}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              unit: e.target.value as typeof form.unit,
            }))
          }
          className="rounded border px-3 py-2"
        >
          <option value="unidad">unidad</option>
          <option value="m2">m2</option>
          <option value="kg">kg</option>
        </select>

        <input
          type="number"
          value={form.min_quantity}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              min_quantity: Number(e.target.value),
            }))
          }
          placeholder="mínimo"
          className="rounded border px-3 py-2"
        />

        <button
          type="submit"
          className="rounded bg-slate-900 px-4 py-2 text-white"
        >
          Crear
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-3 py-2 text-left">Nombre</th>
              <th className="px-3 py-2 text-left">Categoría</th>
              <th className="px-3 py-2 text-left">Precio</th>
              <th className="px-3 py-2 text-left">Unidad</th>
              <th className="px-3 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-3 py-3" colSpan={5}>
                  Cargando...
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-3 py-2">{item.name}</td>
                  <td className="px-3 py-2">
                    {categoryNameById[item.category_id] || '-'}
                  </td>
                  <td className="px-3 py-2">{item.price}</td>
                  <td className="px-3 py-2">{item.unit}</td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => void onDelete(item.id)}
                      className="rounded border px-2 py-1 text-red-600"
                    >
                      Eliminar
                    </button>
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
