import { BudgetView } from '@/views/BudgetView';
import { useNavigate } from '@/app/router';
import { appPaths } from '@/app/routes';

export function BudgetPage() {
  const navigate = useNavigate();

  return <BudgetView onViewChange={() => navigate(appPaths.catalog)} />;
}
