import { ProductView } from '@/views/ProductView';
import { useNavigate, useParams } from '@/app/router';
import { appPaths } from '@/app/routes';

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  return (
    <ProductView
      productSlug={slug || ""}
      onBack={() => navigate(appPaths.catalog)}
      onProductSelect={(nextSlug) => navigate(`/producto/${nextSlug}`)}
    />
  );
}
