import { useNavigate } from '@/app/router';

export function AdminDashboardPage() {
  const navigate = useNavigate();

  const cards = [
    { title: 'Productos', desc: 'Gestionar catálogo de productos.', to: '/admin/products' },
    { title: 'Categorías', desc: 'Gestionar categorías públicas.', to: '/admin/categories' },
    { title: 'Hero Slides', desc: 'Editar home hero y orden.', to: '/admin/hero-slides' },
    { title: 'Benefits', desc: 'Editar ventajas comerciales.', to: '/admin/benefits' },
    { title: 'Site Settings', desc: 'Config global de marca y contacto.', to: '/admin/site-settings' },
    { title: 'Budgets', desc: 'Solicitudes de presupuesto.', to: '/admin/budgets' },
    { title: 'Leads', desc: 'Suscripciones y leads.', to: '/admin/leads' },
  ];

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Admin</h1>
        <p className="text-slate-600">Panel central para contenido, catálogo y leads.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <button key={card.to} onClick={() => navigate(card.to)} className="rounded-xl border bg-white p-5 text-left hover:border-slate-400">
            <h2 className="font-semibold text-slate-800">{card.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{card.desc}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
