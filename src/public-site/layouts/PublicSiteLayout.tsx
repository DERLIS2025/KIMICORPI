import type { ReactNode } from 'react';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { pathToView, viewToPath } from '@/app/routes';
import type { View } from '@/types';
import { useLocation, useNavigate } from '@/app/router';

export function PublicSiteLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const currentView = pathToView(pathname);

  const handleViewChange = (view: View) => {
    if (view === 'product') return;
    navigate(viewToPath[view]);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header currentView={currentView} onViewChange={handleViewChange} />
      {children}
      <Footer onViewChange={handleViewChange} />
    </div>
  );
}
