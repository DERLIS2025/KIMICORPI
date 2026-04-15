import { BudgetProvider } from '@/providers/BudgetProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { AppRouter } from '@/app/router';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <AuthProvider>
      <BudgetProvider>
        <AppRouter />
        <Toaster richColors />
      </BudgetProvider>
    </AuthProvider>
  );
}

export default App;
