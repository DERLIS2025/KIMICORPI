import { Hero } from '@/sections/Hero';
import { Categories } from '@/sections/Categories';
import { FeaturedProducts } from '@/sections/FeaturedProducts';
import { Benefits } from '@/sections/Benefits';
import { Newsletter } from '@/sections/Newsletter';
import { useNavigate } from '@/app/router';
import { appPaths } from '@/app/routes';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <main>
      <Hero onViewChange={() => navigate(appPaths.catalog)} />
      <Categories onViewChange={() => navigate(appPaths.catalog)} />
      <FeaturedProducts
        onViewChange={() => navigate(appPaths.catalog)}
        onProductSelect={(slug) => navigate(`/producto/${slug}`)}
      />
      <Benefits />
      <Newsletter />
    </main>
  );
}
