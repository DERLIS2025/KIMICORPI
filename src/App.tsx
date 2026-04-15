import { useState } from 'react';
import { BudgetProvider } from '@/store/BudgetContext';
import { Header } from '@/sections/Header';
import { Hero } from '@/sections/Hero';
import { Categories } from '@/sections/Categories';
import { FeaturedProducts } from '@/sections/FeaturedProducts';
import { Benefits } from '@/sections/Benefits';
import { Newsletter } from '@/sections/Newsletter';
import { Footer } from '@/sections/Footer';
import { CatalogView } from '@/views/CatalogView';
import { ProductView } from '@/views/ProductView';
import { BudgetView } from '@/views/BudgetView';
import type { View } from '@/types';

function HomePage({ 
  onViewChange, 
  onProductSelect 
}: { 
  onViewChange: (view: View) => void;
  onProductSelect: (productId: string) => void;
}) {
  return (
    <main>
      <Hero onViewChange={onViewChange} />
      <Categories onViewChange={onViewChange} />
      <FeaturedProducts onViewChange={onViewChange} onProductSelect={onProductSelect} />
      <Benefits />
      <Newsletter />
    </main>
  );
}

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleViewChange = (view: View) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromProduct = () => {
    setSelectedProductId(null);
    setCurrentView('catalog');
  };

  return (
    <BudgetProvider>
      <div className="min-h-screen bg-white">
        <Header 
          currentView={currentView} 
          onViewChange={handleViewChange}
        />
        
        {currentView === 'home' && (
          <HomePage 
            onViewChange={handleViewChange} 
            onProductSelect={handleProductSelect}
          />
        )}
        
        {currentView === 'catalog' && (
          <CatalogView
            selectedCategory={null}
            onProductSelect={handleProductSelect}
            onViewChange={handleViewChange}
          />
        )}
        
        {currentView === 'product' && selectedProductId && (
          <ProductView
            productId={selectedProductId}
            onBack={handleBackFromProduct}
            onProductSelect={handleProductSelect}
          />
        )}
        
        {currentView === 'budget' && (
          <BudgetView onViewChange={handleViewChange} />
        )}
        
        <Footer onViewChange={handleViewChange} />
      </div>
    </BudgetProvider>
  );
}

export default App;
