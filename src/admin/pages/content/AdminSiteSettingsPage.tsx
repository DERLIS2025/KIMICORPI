import { useEffect, useState } from 'react';
import { settingsService, type SiteSettings } from '@/domains/settings/services/settings.service';

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

export function AdminSiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(emptySettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void settingsService.getSiteSettings().then(setSettings);
  }, []);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await settingsService.saveSiteSettings(settings);
    settingsService.clearCache();
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
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
        <textarea value={JSON.stringify(settings.reusableTexts)} onChange={(e) => {
          try { setSettings((p) => ({ ...p, reusableTexts: JSON.parse(e.target.value || '{}') })); } catch { /* ignore */ }
        }} className="rounded border px-3 py-2 md:col-span-2" rows={4} placeholder='Textos globales reutilizables (JSON)' />

        <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-white md:col-span-2">Guardar settings</button>
      </form>

      {saved && <div className="rounded border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">Configuración guardada.</div>}
    </section>
  );
}
