import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type { Product } from '@/domains/catalog/types/catalog.types';
import { budgetService, type BudgetItem } from '@/domains/budget/services/budget.service';

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
            : item,
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
    setItems((prev) => prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item)));
  }, [removeItem]);

  const updateNotes = useCallback((productId: string, notes: string) => {
    setItems((prev) => prev.map((item) => (item.product.id === productId ? { ...item, notes } : item)));
  }, []);

  const clearBudget = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(() => budgetService.calculateTotalItems(items), [items]);
  const estimatedTotal = useMemo(() => budgetService.calculateEstimatedTotal(items), [items]);

  const getWhatsAppMessage = useCallback(() => {
    return budgetService.buildWhatsAppMessage(items);
  }, [items]);

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
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
}
