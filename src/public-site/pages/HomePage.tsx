import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Hero } from '@/sections/Hero';
import { Categories } from '@/sections/Categories';
import { FeaturedProducts } from '@/sections/FeaturedProducts';
import { Benefits } from '@/sections/Benefits';
import { Newsletter } from '@/sections/Newsletter';
import { useNavigate } from '@/app/router';
import { appPaths } from '@/app/routes';
import { settingsService, type SiteSettings } from '@/domains/settings/services/settings.service';

interface DynamicSectionConfig {
  id: string;
  title: string;
  enabled: boolean;
}

export function HomePage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    void settingsService.getSiteSettings().then(setSettings).catch(() => {
      setSettings(null);
    });
  }, []);

  const dynamicSections = useMemo<DynamicSectionConfig[]>(() => {
    const candidate = settings?.reusableTexts?.dynamicSections;
    if (!Array.isArray(candidate)) {
      return [
        { id: 'categories', title: 'Categorías', enabled: true },
        { id: 'featured-products', title: 'Productos destacados', enabled: true },
        { id: 'benefits', title: 'Beneficios', enabled: true },
      ];
    }

    return candidate
      .filter((item): item is DynamicSectionConfig => {
        return Boolean(item && typeof item === 'object' && 'id' in item && 'title' in item);
      })
      .map((item) => ({
        id: String(item.id),
        title: String(item.title),
        enabled: Boolean(item.enabled),
      }));
  }, [settings?.reusableTexts?.dynamicSections]);

  const sectionById: Record<string, ReactNode> = {
    categories: <Categories onViewChange={() => navigate(appPaths.catalog)} />,
    'featured-products': (
      <FeaturedProducts
        onViewChange={() => navigate(appPaths.catalog)}
        onProductSelect={(slug) => navigate(`/producto/${slug}`)}
        sectionTitle={String(settings?.reusableTexts?.homeBannerTitle || 'Los más vendidos')}
        sectionCta={String(settings?.reusableTexts?.homeBannerCta || 'Ver todos')}
        sectionDescription="Productos destacados con los mejores precios y calidad garantizada"
      />
    ),
    benefits: <Benefits />,
  };

  return (
    <main>
      <Hero
        onViewChange={() => navigate(appPaths.catalog)}
        titleOverride={String(settings?.reusableTexts?.heroTitle || '')}
        subtitleOverride={String(settings?.reusableTexts?.heroSubtitle || '')}
      />
      {dynamicSections
        .filter((section) => section.enabled)
        .map((section) => (
          <div key={section.id}>
            {sectionById[section.id] || null}
          </div>
        ))}
      <Newsletter />
    </main>
  );
}
