import { useEffect, useState } from 'react';
import { settingsService, type SiteSettings } from '@/domains/settings/services/settings.service';
import { toast } from 'sonner';

const emptySettings: SiteSettings = {
  siteName: 'CORPI & Cia',
  logoUrl: '',
  whatsappNumber: '',
  whatsappDefaultMessage: '',
  phone: '',
  email: '',
  city: '',
  address: '',
  facebookUrl: '',
  instagramUrl: '',
  freeShippingThreshold: 0,
  promoGeneral: '',
  reusableTexts: {},
  locale: 'es-PY',
  currency: 'PYG',
};

interface DynamicSectionConfig {
  id: string;
  title: string;
  enabled: boolean;
}

const fallbackDynamicSections: DynamicSectionConfig[] = [
  { id: 'featured-products', title: 'Productos destacados', enabled: true },
  { id: 'categories', title: 'Categorías', enabled: true },
  { id: 'benefits', title: 'Beneficios', enabled: true },
];

const parseDynamicSections = (value: unknown): DynamicSectionConfig[] => {
  if (!Array.isArray(value)) return fallbackDynamicSections;

  const parsed = value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const candidate = item as Partial<DynamicSectionConfig>;
      if (!candidate.id || !candidate.title) return null;
      return {
        id: String(candidate.id),
        title: String(candidate.title),
        enabled: Boolean(candidate.enabled),
      };
    })
    .filter(Boolean) as DynamicSectionConfig[];

  return parsed.length > 0 ? parsed : fallbackDynamicSections;
};

export function AdminSiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(emptySettings);

  useEffect(() => {
    void settingsService
      .getSiteSettings()
      .then(setSettings)
      .catch((e) => {
        toast.error(e instanceof Error ? e.message : 'Error cargando settings');
      });
  }, []);

  const updateReusableText = (key: string, value: unknown) => {
    setSettings((prev) => ({
      ...prev,
      reusableTexts: {
        ...prev.reusableTexts,
        [key]: value,
      },
    }));
  };

  const dynamicSections = parseDynamicSections(settings.reusableTexts.dynamicSections);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await settingsService.saveSiteSettings(settings);
      settingsService.clearCache();
      toast.success('Cambios guardados');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error guardando settings');
    }
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Site Settings</h1>
        <p className="text-slate-600">Configuración global editable para frontend público.</p>
      </header>

      <form onSubmit={onSave} className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-2">
        <input value={settings.siteName} onChange={(e) => setSettings((p) => ({ ...p, siteName: e.target.value }))} placeholder="Nombre del sitio" className="rounded border px-3 py-2" />
        <input value={settings.logoUrl || ''} onChange={(e) => setSettings((p) => ({ ...p, logoUrl: e.target.value }))} placeholder="Logo URL" className="rounded border px-3 py-2" />
        <input value={settings.whatsappNumber} onChange={(e) => setSettings((p) => ({ ...p, whatsappNumber: e.target.value }))} placeholder="WhatsApp" className="rounded border px-3 py-2" />
        <input value={settings.whatsappDefaultMessage} onChange={(e) => setSettings((p) => ({ ...p, whatsappDefaultMessage: e.target.value }))} placeholder="Mensaje WhatsApp por defecto" className="rounded border px-3 py-2" />
        <input value={settings.email} onChange={(e) => setSettings((p) => ({ ...p, email: e.target.value }))} placeholder="Email" className="rounded border px-3 py-2" />
        <input value={settings.phone} onChange={(e) => setSettings((p) => ({ ...p, phone: e.target.value }))} placeholder="Teléfono" className="rounded border px-3 py-2" />
        <input value={settings.address} onChange={(e) => setSettings((p) => ({ ...p, address: e.target.value }))} placeholder="Dirección" className="rounded border px-3 py-2" />
        <input value={settings.city} onChange={(e) => setSettings((p) => ({ ...p, city: e.target.value }))} placeholder="Ciudad" className="rounded border px-3 py-2" />
        <input value={settings.facebookUrl} onChange={(e) => setSettings((p) => ({ ...p, facebookUrl: e.target.value }))} placeholder="Facebook URL" className="rounded border px-3 py-2" />
        <input value={settings.instagramUrl} onChange={(e) => setSettings((p) => ({ ...p, instagramUrl: e.target.value }))} placeholder="Instagram URL" className="rounded border px-3 py-2" />
        <input type="number" value={settings.freeShippingThreshold} onChange={(e) => setSettings((p) => ({ ...p, freeShippingThreshold: Number(e.target.value) }))} placeholder="Promo threshold" className="rounded border px-3 py-2" />
        <input value={settings.promoGeneral} onChange={(e) => setSettings((p) => ({ ...p, promoGeneral: e.target.value }))} placeholder="Promo general" className="rounded border px-3 py-2" />
        <section className="space-y-3 rounded-lg border p-3 md:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Hero editable</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={String(settings.reusableTexts.heroTitle || '')}
              onChange={(e) => updateReusableText('heroTitle', e.target.value)}
              placeholder="Título principal del hero"
              className="rounded border px-3 py-2"
            />
            <input
              value={String(settings.reusableTexts.heroSubtitle || '')}
              onChange={(e) => updateReusableText('heroSubtitle', e.target.value)}
              placeholder="Subtítulo del hero"
              className="rounded border px-3 py-2"
            />
          </div>
        </section>

        <section className="space-y-3 rounded-lg border p-3 md:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Banners</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={String(settings.reusableTexts.homeBannerTitle || '')}
              onChange={(e) => updateReusableText('homeBannerTitle', e.target.value)}
              placeholder="Título del banner principal"
              className="rounded border px-3 py-2"
            />
            <input
              value={String(settings.reusableTexts.homeBannerCta || '')}
              onChange={(e) => updateReusableText('homeBannerCta', e.target.value)}
              placeholder="Texto CTA del banner"
              className="rounded border px-3 py-2"
            />
            <input
              value={String(settings.reusableTexts.homeBannerSecondaryTitle || '')}
              onChange={(e) => updateReusableText('homeBannerSecondaryTitle', e.target.value)}
              placeholder="Título del banner secundario"
              className="rounded border px-3 py-2 md:col-span-2"
            />
          </div>
        </section>

        <section className="space-y-3 rounded-lg border p-3 md:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Secciones dinámicas de home</h2>
          <div className="space-y-2">
            {dynamicSections.map((section, index) => (
              <div key={section.id} className="grid gap-2 rounded border p-2 md:grid-cols-[1fr_1fr_auto]">
                <input
                  value={section.id}
                  onChange={(e) => {
                    const next = [...dynamicSections];
                    next[index] = { ...next[index], id: e.target.value };
                    updateReusableText('dynamicSections', next);
                  }}
                  className="rounded border px-3 py-2"
                  placeholder="id-seccion"
                />
                <input
                  value={section.title}
                  onChange={(e) => {
                    const next = [...dynamicSections];
                    next[index] = { ...next[index], title: e.target.value };
                    updateReusableText('dynamicSections', next);
                  }}
                  className="rounded border px-3 py-2"
                  placeholder="Título visible"
                />
                <label className="flex items-center gap-2 rounded border px-3 py-2 text-sm">
                  <input
                    type="checkbox"
                    checked={section.enabled}
                    onChange={(e) => {
                      const next = [...dynamicSections];
                      next[index] = { ...next[index], enabled: e.target.checked };
                      updateReusableText('dynamicSections', next);
                    }}
                  />
                  Activa
                </label>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                updateReusableText('dynamicSections', [
                  ...dynamicSections,
                  { id: `seccion-${dynamicSections.length + 1}`, title: 'Nueva sección', enabled: true },
                ])
              }
              className="rounded border px-3 py-2 text-sm text-slate-700"
            >
              Agregar sección
            </button>
          </div>
        </section>

        <textarea value={JSON.stringify(settings.reusableTexts, null, 2)} onChange={(e) => {
          try { setSettings((p) => ({ ...p, reusableTexts: JSON.parse(e.target.value || '{}') })); } catch { /* ignore */ }
        }} className="rounded border px-3 py-2 md:col-span-2" rows={6} placeholder='Editor avanzado de textos reutilizables (JSON)' />

        <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-white md:col-span-2">Guardar settings</button>
      </form>
    </section>
  );
}
