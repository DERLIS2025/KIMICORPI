import { useEffect, useState } from 'react';
import { ArrowLeft, Trash2, Plus, Minus, MessageCircle, Send, Calculator } from 'lucide-react';
import { useBudget } from '@/providers/BudgetProvider';
import { formatPrice } from '@/domains/catalog/utils/price';
import { getStepByUnit, getUnitLabel } from '@/domains/catalog/utils/unit';
import { settingsService, type SiteSettings } from '@/domains/settings/services/settings.service';

interface BudgetViewProps {
  onViewChange: () => void;
}

export function BudgetView({ onViewChange }: BudgetViewProps) {
  const { items, removeItem, updateQuantity, updateNotes, clearBudget, estimatedTotal, getWhatsAppMessage } = useBudget();
  const [showNotes, setShowNotes] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [settings, setSettings] = useState<SiteSettings>({
    whatsappNumber: '595992588770',
    phone: '+595 992 588 770',
    email: 'info@corpicia.com',
    city: 'Asunción, Paraguay',
    facebookUrl: 'https://facebook.com/corpi.jardin',
    instagramUrl: 'https://instagram.com/corpi_y_ciaa',
    freeShippingThreshold: 500000,
    locale: 'es-PY',
    currency: 'PYG',
  });

  useEffect(() => {
    void settingsService.getSiteSettings().then(setSettings);
  }, []);

  const handleSendWhatsApp = () => {
    const message = getWhatsAppMessage();
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${message}`, '_blank');
  };

  const handleAddNote = (productId: string) => {
    updateNotes(productId, noteText);
    setShowNotes(null);
    setNoteText('');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calculator className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Tu presupuesto está vacío</h2>
          <p className="text-gray-600 mb-6">Explora nuestros productos y agrega los que necesites para tu jardín.</p>
          <button
            onClick={onViewChange}
            className="px-6 py-3 bg-[#0066b3] text-white font-medium rounded-lg hover:bg-[#005494] transition-colors"
          >
            Ver productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button onClick={onViewChange} className="flex items-center text-gray-600 hover:text-[#0066b3] transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Seguir agregando productos
            </button>
            <button onClick={clearBudget} className="text-red-500 hover:text-red-700 text-sm font-medium">
              Vaciar presupuesto
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Presupuesto</h1>
        <p className="text-gray-600 mb-8">
          {items.length} {items.length === 1 ? 'producto' : 'productos'} en tu lista
        </p>

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div key={item.product.id} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {formatPrice(item.product.price)} / {getUnitLabel(item.product.unit)}
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - getStepByUnit(item.product.unit))}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-medium min-w-[80px] text-center">
                        {item.quantity} {getUnitLabel(item.product.unit)}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + getStepByUnit(item.product.unit))}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setShowNotes(showNotes === item.product.id ? null : item.product.id);
                        setNoteText(item.notes || '');
                      }}
                      className="text-sm text-[#0066b3] hover:underline"
                    >
                      {item.notes ? 'Editar nota' : 'Agregar nota'}
                    </button>
                  </div>

                  {showNotes === item.product.id && (
                    <div className="mt-3 animate-fade-in">
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Ej: Necesito instalación, preferencia de horario, etc."
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0066b3]"
                        rows={2}
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleAddNote(item.product.id)}
                          className="px-3 py-1.5 bg-[#0066b3] text-white text-sm rounded-lg hover:bg-[#005494]"
                        >
                          Guardar
                        </button>
                        <button onClick={() => setShowNotes(null)} className="px-3 py-1.5 text-gray-600 text-sm hover:text-gray-800">
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}

                  {item.notes && showNotes !== item.product.id && (
                    <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <span className="font-medium">Nota:</span> {item.notes}
                    </p>
                  )}
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-4">
                  <span className="text-lg font-bold text-gray-900">{formatPrice(item.product.price * item.quantity)}</span>
                  <button onClick={() => removeItem(item.product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 sticky bottom-4 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total estimado</p>
              <p className="text-3xl font-bold text-gray-900">{formatPrice(estimatedTotal)}</p>
              <p className="text-xs text-gray-400 mt-1">*Precios sujetos a confirmación</p>
            </div>
            <button
              onClick={handleSendWhatsApp}
              className="w-full sm:w-auto px-8 py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold rounded-xl flex items-center justify-center gap-3 transition-colors shadow-lg shadow-green-500/25"
            >
              <MessageCircle className="w-6 h-6" />
              <div className="text-left">
                <span className="block text-sm opacity-90">Solicitar presupuesto</span>
                <span className="block text-lg">Enviar por WhatsApp</span>
              </div>
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
