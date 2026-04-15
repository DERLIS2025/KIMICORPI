import type { ReactNode } from 'react';
import { Shield, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from '@/app/router';
import { adminAuthService } from '@/services/admin-auth.service';

export function AdminLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    await adminAuthService.logout();
    navigate('/admin/login');
  };

  const links = [
    { label: 'Dashboard', to: '/admin' },
    { label: 'Productos', to: '/admin/products' },
    { label: 'Categorías', to: '/admin/categories' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-slate-800">
            <Shield className="h-5 w-5" />
            <span className="font-semibold">Admin Corpi & Cia</span>
          </div>
          <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-slate-100">
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl gap-6 px-6 py-8">
        <aside className="w-56 rounded-xl border bg-white p-3">
          <nav className="space-y-1">
            {links.map((link) => (
              <button
                key={link.to}
                onClick={() => navigate(link.to)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${pathname === link.to ? 'bg-slate-900 text-white' : 'hover:bg-slate-100'}`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
