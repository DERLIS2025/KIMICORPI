import { CatalogView } from '@/views/CatalogView';
import { useNavigate } from '@/app/router';
import { appPaths } from '@/app/routes';

export function CatalogPage() {
  const navigate = useNavigate();

  return (
    <CatalogView
      selectedCategory={null}
      onProductSelect={(slug) => navigate(`/producto/${slug}`)}
      onViewChange={() => navigate(appPaths.budget)}
    />
  );
}
