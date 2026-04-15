import { BudgetProvider } from '@/providers/BudgetProvider';
import { AppRouter } from '@/app/router';

function App() {
  return (
    <BudgetProvider>
      <AppRouter />
    </BudgetProvider>
  );
}

export default App;
