import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from '@/app/router';
import { catalogDataService } from '@/domains/catalog/services/catalog-data.service';
import { leadsService } from '@/domains/leads/services/leads.service';
import type { BudgetRequest, NewsletterLead } from '@/domains/leads/types/leads.types';
import type { CategoryRow, ProductRow } from '@/domains/catalog/types/catalog.db.types';
import { toast } from 'sonner';

type ActivityItem = {
  id: string;
  title: string;
  subtitle: string;
  createdAt: string;
};

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [budgets, setBudgets] = useState<BudgetRequest[]>([]);
  const [leads, setLeads] = useState<NewsletterLead[]>([]);
  const [loading, setLoading] = useState(true);

  const cards = [
    { title: 'Productos', desc: 'Gestionar catálogo de productos.', to: '/admin/products' },
    { title: 'Categorías', desc: 'Gestionar categorías públicas.', to: '/admin/categories' },
    { title: 'Hero Slides', desc: 'Editar home hero y orden.', to: '/admin/hero-slides' },
    { title: 'Benefits', desc: 'Editar ventajas comerciales.', to: '/admin/benefits' },
    { title: 'Site Settings', desc: 'Config global de marca y contacto.', to: '/admin/site-settings' },
    { title: 'Budgets', desc: 'Solicitudes de presupuesto.', to: '/admin/budgets' },
    { title: 'Leads', desc: 'Suscripciones y leads.', to: '/admin/leads' },
  ];

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes, budgetsRes, leadsRes] = await Promise.all([
          catalogDataService.getProductsAdmin(),
          catalogDataService.getCategoriesAdmin(),
          leadsService.listBudgetRequests(),
          leadsService.listNewsletterLeads(),
        ]);
        setProducts(productsRes);
        setCategories(categoriesRes);
        setBudgets(budgetsRes);
        setLeads(leadsRes);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'No se pudo cargar el dashboard';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  const metricCards = useMemo(() => {
    const budgetsPending = budgets.filter((item) => item.status === 'nuevo').length;
    return [
      { title: 'Productos activos', value: String(products.length), note: 'Catálogo disponible' },
      { title: 'Categorías', value: String(categories.length), note: 'Secciones del catálogo' },
      { title: 'Leads', value: String(leads.length), note: 'Suscriptores registrados' },
      { title: 'Presupuestos nuevos', value: String(budgetsPending), note: 'Pendientes de revisión' },
    ];
  }, [budgets, categories.length, leads.length, products.length]);

  const recentActivity = useMemo<ActivityItem[]>(() => {
    const budgetItems = budgets.slice(0, 5).map((item) => ({
      id: `budget-${item.id}`,
      title: `Presupuesto ${item.requestCode}`,
      subtitle: `Estado: ${item.status} · Total estimado $${item.totalEstimated}`,
      createdAt: item.createdAt,
    }));

    const leadItems = leads.slice(0, 5).map((item) => ({
      id: `lead-${item.id}`,
      title: 'Nuevo lead de newsletter',
      subtitle: item.email,
      createdAt: item.createdAt,
    }));

    return [...budgetItems, ...leadItems]
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      .slice(0, 6);
  }, [budgets, leads]);

  const categoryNameById = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.id, category.name])),
    [categories]
  );

  const featuredProducts = useMemo(
    () => products.slice(0, 4),
    [products]
  );

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Admin</h1>
        <p className="text-slate-600">Panel central para operación comercial, catálogo y marketing.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((metric) => (
          <article key={metric.title} className="rounded-xl border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{metric.title}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{loading ? '...' : metric.value}</p>
            <p className="mt-1 text-sm text-slate-500">{metric.note}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <section className="rounded-xl border bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Actividad reciente</h2>
            <button
              type="button"
              onClick={() => navigate('/admin/budgets')}
              className="text-xs font-medium uppercase tracking-wide text-slate-600"
            >
              Ver presupuestos
            </button>
          </div>
          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-slate-500">Cargando actividad...</p>
            ) : recentActivity.length === 0 ? (
              <p className="text-sm text-slate-500">Aún no hay actividad para mostrar.</p>
            ) : (
              recentActivity.map((activity) => (
                <article key={activity.id} className="rounded-lg border border-slate-200 p-3">
                  <p className="font-medium text-slate-900">{activity.title}</p>
                  <p className="text-sm text-slate-600">{activity.subtitle}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(activity.createdAt).toLocaleString('es-AR')}
                  </p>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="rounded-xl border bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Productos destacados</h2>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="text-xs font-medium uppercase tracking-wide text-slate-600"
            >
              Gestionar
            </button>
          </div>
          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-slate-500">Cargando productos...</p>
            ) : featuredProducts.length === 0 ? (
              <p className="text-sm text-slate-500">No hay productos registrados.</p>
            ) : (
              featuredProducts.map((product) => (
                <article key={product.id} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                  <img
                    src={product.image_url || '/hero-jardin.jpg'}
                    alt={product.name}
                    className="h-14 w-14 rounded object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-500">{categoryNameById[product.category_id] || 'Sin categoría'}</p>
                    <p className="text-sm font-semibold text-slate-900">${product.price}</p>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>

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
