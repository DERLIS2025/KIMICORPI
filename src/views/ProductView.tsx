import { useState } from 'react';
import { ArrowLeft, Check, Star, Minus, Plus, MessageCircle, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getProductById, formatPrice, products, getUnitLabel } from '@/data/products';
import { useBudget } from '@/store/BudgetContext';
import { ProductCard } from '@/components/ProductCard';

interface ProductViewProps {
  productId: string;
  onBack: () => void;
  onProductSelect: (productId: string) => void;
}

export function ProductView({ productId, onBack, onProductSelect }: ProductViewProps) {
  const product = getProductById(productId);
  const [quantity, setQuantity] = useState(product?.minQuantity || 1);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem, items } = useBudget();

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h2>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const isInBudget = items.some(item => item.product.id === product.id);

  const handleAddToBudget = () => {
    addItem(product, quantity, product.unit);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const estimatedPrice = product.price * quantity;

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hola Corpi & Cia, me interesa el producto: ${product.name}\nCantidad: ${quantity} ${getUnitLabel(product.unit)}\nPrecio estimado: ${formatPrice(estimatedPrice)}`
    );
    window.open(`https://wa.me/595992588770?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-[#0066b3] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al catálogo
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-10">
            {/* Image */}
            <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1">
                  {product.badge}
                </Badge>
              )}
              {product.originalPrice && (
                <Badge className="absolute top-4 right-4 bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </Badge>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < product.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">({product.reviews} reseñas)</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Description */}
              <p className="text-gray-600 text-lg mb-6">
                {product.description}
              </p>

              {/* Features */}
              {product.features && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Características:</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-600">
                        <Check className="w-4 h-4 text-green-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                <span className="text-lg text-gray-500">/ {getUnitLabel(product.unit)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Min Quantity */}
              <p className="text-sm text-gray-500 mb-4">
                Cantidad mínima: {product.minQuantity} {getUnitLabel(product.unit)}
              </p>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-gray-700">Cantidad:</span>
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(product.minQuantity, quantity - (product.unit === 'm2' ? 5 : 1)))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-6 py-3 font-semibold min-w-[100px] text-center">
                    {quantity} {getUnitLabel(product.unit)}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + (product.unit === 'm2' ? 5 : 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Estimated Price */}
              <div className="bg-green-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Precio estimado:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatPrice(estimatedPrice)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleAddToBudget}
                  className={`flex-1 py-6 text-lg font-semibold rounded-xl transition-all ${
                    isAdded
                      ? 'bg-green-500 hover:bg-green-600'
                      : isInBudget
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-[#0066b3] hover:bg-[#005494]'
                  }`}
                  disabled={!product.inStock}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Agregado al presupuesto
                    </>
                  ) : isInBudget ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Ya está en tu presupuesto
                    </>
                  ) : (
                    <>
                      <Calculator className="w-5 h-5 mr-2" />
                      Agregar al presupuesto
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={handleWhatsApp}
                  variant="outline"
                  className="flex-1 py-6 text-lg font-semibold rounded-xl border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Consultar por WhatsApp
                </Button>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mt-6">
                {product.inStock ? (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-green-600 font-medium">En stock</span>
                  </>
                ) : (
                  <span className="text-red-500 font-medium">Agotado</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Productos relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onClick={() => onProductSelect(p.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
