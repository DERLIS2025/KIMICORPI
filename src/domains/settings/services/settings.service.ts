import { appConfig } from '@/config/app-config';
import { supabaseConfig, supabaseRest } from '@/integrations/supabase/client';

interface SiteSettingsRow {
  id: string;
  site_name: string | null;
  logo_url: string | null;
  whatsapp_number: string | null;
  whatsapp_default_message: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
  address: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  free_shipping_threshold: number | null;
  promo_general: string | null;
  reusable_texts: Record<string, string> | null;
  locale: string | null;
  currency: string | null;
}

export interface SiteSettings {
  id?: string;
  siteName: string;
  logoUrl?: string;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  freeShippingThreshold: number;
  promoGeneral: string;
  reusableTexts: Record<string, string>;
  locale: string;
  currency: string;
}

let settingsCache: SiteSettings | null = null;

const fallbackSettings: SiteSettings = {
  siteName: `${appConfig.brand.name} ${appConfig.brand.suffix}`,
  logoUrl: '',
  whatsappNumber: appConfig.contact.whatsappNumber,
  whatsappDefaultMessage: 'Hola Corpi & Cia, quiero solicitar un presupuesto.',
  phone: appConfig.contact.phone,
  email: appConfig.contact.email,
  city: appConfig.contact.city,
  address: appConfig.contact.city,
  facebookUrl: appConfig.social.facebook,
  instagramUrl: appConfig.social.instagram,
  freeShippingThreshold: appConfig.promotions.freeShippingThreshold,
  promoGeneral: `🚚 Envío gratis en compras mayores a Gs. ${appConfig.promotions.freeShippingThreshold.toLocaleString('es-PY')}`,
  reusableTexts: {},
  locale: appConfig.locale,
  currency: appConfig.currency,
};

const mapRowToSettings = (row: SiteSettingsRow): SiteSettings => ({
  id: row.id,
  siteName: row.site_name || fallbackSettings.siteName,
  logoUrl: row.logo_url || fallbackSettings.logoUrl,
  whatsappNumber: row.whatsapp_number || fallbackSettings.whatsappNumber,
  whatsappDefaultMessage: row.whatsapp_default_message || fallbackSettings.whatsappDefaultMessage,
  phone: row.phone || fallbackSettings.phone,
  email: row.email || fallbackSettings.email,
  city: row.city || fallbackSettings.city,
  address: row.address || fallbackSettings.address,
  facebookUrl: row.facebook_url || fallbackSettings.facebookUrl,
  instagramUrl: row.instagram_url || fallbackSettings.instagramUrl,
  freeShippingThreshold: Number(row.free_shipping_threshold ?? fallbackSettings.freeShippingThreshold),
  promoGeneral: row.promo_general || fallbackSettings.promoGeneral,
  reusableTexts: row.reusable_texts || fallbackSettings.reusableTexts,
  locale: row.locale || fallbackSettings.locale,
  currency: row.currency || fallbackSettings.currency,
});

export const settingsService = {
  async getSiteSettings(): Promise<SiteSettings> {
    if (settingsCache) return settingsCache;

    if (!supabaseConfig.enabled) {
      settingsCache = fallbackSettings;
      return settingsCache;
    }

    try {
      const rows = await supabaseRest<SiteSettingsRow[]>('site_settings', {
        query: {
          select: 'id,site_name,logo_url,whatsapp_number,whatsapp_default_message,phone,email,city,address,facebook_url,instagram_url,free_shipping_threshold,promo_general,reusable_texts,locale,currency',
          limit: '1',
        },
      });

      const row = rows[0];
      if (!row) {
        settingsCache = fallbackSettings;
        return settingsCache;
      }

      settingsCache = mapRowToSettings(row);
      return settingsCache;
    } catch {
      settingsCache = fallbackSettings;
      return settingsCache;
    }
  },

  async saveSiteSettings(settings: SiteSettings): Promise<void> {
    if (!supabaseConfig.enabled) {
      settingsCache = settings;
      return;
    }

    const payload = {
      site_name: settings.siteName,
      logo_url: settings.logoUrl || null,
      whatsapp_number: settings.whatsappNumber,
      whatsapp_default_message: settings.whatsappDefaultMessage,
      phone: settings.phone,
      email: settings.email,
      city: settings.city,
      address: settings.address,
      facebook_url: settings.facebookUrl,
      instagram_url: settings.instagramUrl,
      free_shipping_threshold: settings.freeShippingThreshold,
      promo_general: settings.promoGeneral,
      reusable_texts: settings.reusableTexts,
      locale: settings.locale,
      currency: settings.currency,
    };

    if (settings.id) {
      await supabaseRest('site_settings', {
        method: 'PATCH',
        useAuth: true,
        query: { id: `eq.${settings.id}` },
        body: payload,
      });
    } else {
      await supabaseRest('site_settings', {
        method: 'POST',
        useAuth: true,
        body: [payload],
      });
    }

    this.clearCache();
  },

  clearCache() {
    settingsCache = null;
  },
};
