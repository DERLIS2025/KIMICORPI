import { useState, useEffect } from 'react';
import { Menu, X, Leaf, MessageCircle, Calculator } from 'lucide-react';
import { useBudget } from '@/store/BudgetContext';
import type { View } from '@/types';

interface HeaderProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export function Header({ currentView, onViewChange }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useBudget();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Inicio', view: 'home' as View },
    { label: 'Productos', view: 'catalog' as View },
    { label: 'Contacto', view: 'home' as View, action: () => {
      onViewChange('home');
      setTimeout(() => {
        document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      setMenuOpen(false);
    }},
  ];

  const handleNav = (item: typeof navItems[0]) => {
    if (item.action) {
      item.action();
    } else {
      onViewChange(item.view);
      setMenuOpen(false);
    }
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/595992588770?text=Hola%20Corpi%20%26%20Cia,%20quiero%20solicitar%20un%20presupuesto', '_blank');
  };

  return (
    <>
      {/* Top Banner */}
      <div className="bg-[#0066b3] text-white text-center py-2 px-4 text-sm">
        <span className="font-medium">🚚 Envío gratis en compras mayores a Gs. 500.000</span>
      </div>

      {/* Header */}
      <header 
        className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? 'shadow-md' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button 
              onClick={() => onViewChange('home')}
              className="flex items-center gap-2 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 leading-tight">CORPI</span>
                <span className="text-xs text-green-600 -mt-1">& Cia</span>
              </div>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNav(item)}
                  className={`text-sm font-medium transition-colors hover:text-[#0066b3] ${
                    currentView === item.view ? 'text-[#0066b3]' : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Budget Button */}
              <button
                onClick={() => onViewChange('budget')}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Calculator className="w-4 h-4" />
                <span>Mi Presupuesto</span>
                {totalItems > 0 && (
                  <span className="ml-1 w-5 h-5 bg-white text-green-600 text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* WhatsApp Button */}
              <button
                onClick={handleWhatsApp}
                className="flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#128C7E] text-white text-sm font-medium rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>

              {/* Mobile Menu */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {menuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="flex flex-col p-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNav(item)}
                  className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                    currentView === item.view
                      ? 'bg-[#0066b3] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  onViewChange('budget');
                  setMenuOpen(false);
                }}
                className="text-left px-4 py-3 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                Mi Presupuesto
                {totalItems > 0 && (
                  <span className="ml-auto w-5 h-5 bg-white text-green-600 text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
