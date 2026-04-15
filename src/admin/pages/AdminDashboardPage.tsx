import { useNavigate } from '@/app/router';

export function AdminDashboardPage() {
  const navigate = useNavigate();

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Admin</h1>
        <p className="text-slate-600">Base conectada a Supabase Auth + CRUD inicial para catálogo.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <button onClick={() => navigate('/admin/products')} className="rounded-xl border bg-white p-5 text-left hover:border-slate-400">
          <h2 className="font-semibold text-slate-800">Productos</h2>
          <p className="mt-2 text-sm text-slate-600">Administrar productos.</p>
        </button>
        <button onClick={() => navigate('/admin/categories')} className="rounded-xl border bg-white p-5 text-left hover:border-slate-400">
          <h2 className="font-semibold text-slate-800">Categorías</h2>
          <p className="mt-2 text-sm text-slate-600">Administrar categorías.</p>
        </button>
        <div className="rounded-xl border bg-white p-5">
          <h2 className="font-semibold text-slate-800">Próximo</h2>
          <p className="mt-2 text-sm text-slate-600">CRUD para hero, beneficios y settings.</p>
        </div>
      </div>
    </section>
  );
}
