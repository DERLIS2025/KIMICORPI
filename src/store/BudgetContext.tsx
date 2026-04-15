import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Product } from '@/types';

export interface BudgetItem {
  product: Product;
  quantity: number;
  unit: 'm2' | 'unidad' | 'kg';
  notes?: string;
}

interface BudgetContextType {
  items: BudgetItem[];
  addItem: (product: Product, quantity: number, unit: BudgetItem['unit'], notes?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateNotes: (productId: string, notes: string) => void;
  clearBudget: () => void;
  totalItems: number;
  estimatedTotal: number;
  getWhatsAppMessage: () => string;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BudgetItem[]>([]);

  const addItem = useCallback((product: Product, quantity: number, unit: BudgetItem['unit'], notes?: string) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, notes: notes || item.notes }
            : item
        );
      }
      return [...prev, { product, quantity, unit, notes }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const updateNotes = useCallback((productId: string, notes: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, notes } : item
      )
    );
  }, []);

  const clearBudget = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const estimatedTotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const getWhatsAppMessage = useCallback(() => {
    if (items.length === 0) return '';
    
    let message = `¡Hola Corpi & Cia! 👋\n\n`;
    message += `Me interesa solicitar un presupuesto para los siguientes productos:\n\n`;
    
    items.forEach((item, index) => {
      const subtotal = item.product.price * item.quantity;
      message += `${index + 1}. *${item.product.name}*\n`;
      message += `   Cantidad: ${item.quantity} ${item.unit}\n`;
      message += `   Precio estimado: Gs. ${subtotal.toLocaleString('es-PY')}\n`;
      if (item.notes) {
        message += `   Notas: ${item.notes}\n`;
      }
      message += `\n`;
    });
    
    message += `*Total estimado: Gs. ${estimatedTotal.toLocaleString('es-PY')}*\n\n`;
    message += `Por favor, confirmen disponibilidad y me envían el presupuesto final. ¡Gracias! 🌱`;
    
    return encodeURIComponent(message);
  }, [items, estimatedTotal]);

  return (
    <BudgetContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateNotes,
        clearBudget,
        totalItems,
        estimatedTotal,
        getWhatsAppMessage,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
}
