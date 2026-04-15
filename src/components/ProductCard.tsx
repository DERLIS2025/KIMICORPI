import { useState } from 'react';
import { Plus, Minus, Check, Calculator } from 'lucide-react';
import { useBudget } from '@/store/BudgetContext';
import { formatPrice, getUnitLabel } from '@/data/products';
import type { ProductWithUnit } from '@/data/products';

interface ProductCardProps {
  product: ProductWithUnit;
  onClick?: () => void;
  variant?: 'default' | 'featured';
}

export function ProductCard({ product, onClick, variant = 'default' }: ProductCardProps) {
  const [quantity, setQuantity] = useState(product.minQuantity);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem, items } = useBudget();

  const isInBudget = items.some(item => item.product.id === product.id);

  const handleAddToBudget = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, quantity, product.unit);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const estimatedPrice = product.price * quantity;

  if (variant === 'featured') {
    return (
      <div
        onClick={onClick}
        className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
      >
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.badge && (
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                {product.badge}
              </span>
            </div>
          )}
          {product.originalPrice && (
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-[#0066b3] transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            <span className="text-sm text-gray-500">/ {getUnitLabel(product.unit)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setQuantity(Math.max(product.minQuantity, quantity - (product.unit === 'm2' ? 5 : 1)));
                }}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-3 py-2 font-medium min-w-[60px] text-center">
                {quantity} {getUnitLabel(product.unit)}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setQuantity(quantity + (product.unit === 'm2' ? 5 : 1));
                }}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleAddToBudget}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                isAdded
                  ? 'bg-green-500 text-white'
                  : isInBudget
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-[#0066b3] text-white hover:bg-[#005494]'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  Agregado
                </>
              ) : isInBudget ? (
                <>
                  <Check className="w-4 h-4" />
                  En presupuesto
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4" />
                  Agregar
                </>
              )}
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-500">Estimado:</span>
            <span className="font-semibold text-green-600">{formatPrice(estimatedPrice)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-[#0066b3] hover:shadow-md transition-all cursor-pointer"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.badge && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider rounded">
              {product.badge}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1 group-hover:text-[#0066b3] transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-2 line-clamp-1">
          {product.description}
        </p>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-gray-500">/ {getUnitLabel(product.unit)}</span>
        </div>

        <p className="text-xs text-gray-400 mb-3">
          Mínimo: {product.minQuantity} {getUnitLabel(product.unit)}
        </p>

        <button
          onClick={handleAddToBudget}
          className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
            isAdded
              ? 'bg-green-500 text-white'
              : isInBudget
              ? 'bg-gray-100 text-gray-700'
              : 'bg-[#0066b3] text-white hover:bg-[#005494]'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" />
              Agregado al presupuesto
            </>
          ) : isInBudget ? (
            <>
              <Check className="w-4 h-4" />
              Ya está en tu presupuesto
            </>
          ) : (
            <>
              <Calculator className="w-4 h-4" />
              Agregar al presupuesto
            </>
          )}
        </button>
      </div>
    </div>
  );
}
