import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { appPaths } from '@/app/routes';
import { PublicSiteLayout } from '@/public-site/layouts/PublicSiteLayout';
import { HomePage } from '@/public-site/pages/HomePage';
import { CatalogPage } from '@/public-site/pages/CatalogPage';
import { ProductPage } from '@/public-site/pages/ProductPage';
import { BudgetPage } from '@/public-site/pages/BudgetPage';
import { AdminLoginPage } from '@/admin/pages/AdminLoginPage';
import { AdminDashboardPage } from '@/admin/pages/AdminDashboardPage';
import { AdminLayout } from '@/admin/layouts/AdminLayout';
import { RequireAdminAuth } from '@/admin/guards/RequireAdminAuth';
import { AdminProductsPage } from '@/admin/pages/catalog/AdminProductsPage';
import { AdminCategoriesPage } from '@/admin/pages/catalog/AdminCategoriesPage';
import { AdminHeroSlidesPage } from '@/admin/pages/content/AdminHeroSlidesPage';
import { AdminBenefitsPage } from '@/admin/pages/content/AdminBenefitsPage';
import { AdminSiteSettingsPage } from '@/admin/pages/content/AdminSiteSettingsPage';
import { AdminBudgetsPage } from '@/admin/pages/leads/AdminBudgetsPage';
import { AdminLeadsPage } from '@/admin/pages/leads/AdminLeadsPage';

interface RouterContextType {
  pathname: string;
  params: Record<string, string | undefined>;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

function parsePath(pathname: string) {
  if (pathname.startsWith('/producto/')) {
    const slug = pathname.replace('/producto/', '');
    return { params: { slug: decodeURIComponent(slug) } };
  }

  return { params: {} };
}

function RouterProvider({ children }: { children: ReactNode }) {
  const [pathname, setPathname] = useState(() => window.location.pathname || '/');

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname || '/');
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((to: string) => {
    if (to === pathname) return;
    window.history.pushState({}, '', to);
    setPathname(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  const { params } = useMemo(() => parsePath(pathname), [pathname]);

  return (
    <RouterContext.Provider value={{ pathname, params, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useNavigate() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useNavigate must be used within AppRouter');
  return ctx.navigate;
}

export function useLocation() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useLocation must be used within AppRouter');
  return { pathname: ctx.pathname };
}

export function useParams<T extends Record<string, string>>() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useParams must be used within AppRouter');
  return ctx.params as T;
}

function AdminRoutes() {
  const { pathname } = useLocation();

  return (
    <RequireAdminAuth>
      <AdminLayout>
        {pathname === appPaths.adminHome && <AdminDashboardPage />}
        {pathname === appPaths.adminProducts && <AdminProductsPage />}
        {pathname === appPaths.adminCategories && <AdminCategoriesPage />}
        {pathname === appPaths.adminHeroSlides && <AdminHeroSlidesPage />}
        {pathname === appPaths.adminBenefits && <AdminBenefitsPage />}
        {pathname === appPaths.adminSiteSettings && <AdminSiteSettingsPage />}
        {pathname === appPaths.adminBudgets && <AdminBudgetsPage />}
        {pathname === appPaths.adminLeads && <AdminLeadsPage />}
      </AdminLayout>
    </RequireAdminAuth>
  );
}

function RouterView() {
  const { pathname } = useLocation();

  if (pathname === appPaths.adminLogin) {
    return <AdminLoginPage />;
  }

  if (pathname.startsWith('/admin')) {
    return <AdminRoutes />;
  }

  return (
    <PublicSiteLayout>
      {pathname === appPaths.home && <HomePage />}
      {pathname === appPaths.catalog && <CatalogPage />}
      {pathname.startsWith('/producto/') && <ProductPage />}
      {pathname === appPaths.budget && <BudgetPage />}
      {!new Set<string>([appPaths.home, appPaths.catalog, appPaths.budget]).has(pathname) && !pathname.startsWith('/producto/') && (
        <HomePage />
      )}
    </PublicSiteLayout>
  );
}

export function AppRouter() {
  return (
    <RouterProvider>
      <RouterView />
    </RouterProvider>
  );
}
