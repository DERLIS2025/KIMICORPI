import { appConfig } from '@/config/app-config';
import { supabaseConfig, supabaseRest } from '@/integrations/supabase/client';

interface SiteSettingsRow {
  whatsapp_number: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  free_shipping_threshold: number | null;
  locale: string | null;
  currency: string | null;
}

export interface SiteSettings {
  whatsappNumber: string;
  phone: string;
  email: string;
  city: string;
  facebookUrl: string;
  instagramUrl: string;
  freeShippingThreshold: number;
  locale: string;
  currency: string;
}

let settingsCache: SiteSettings | null = null;

const fallbackSettings: SiteSettings = {
  whatsappNumber: appConfig.contact.whatsappNumber,
  phone: appConfig.contact.phone,
  email: appConfig.contact.email,
  city: appConfig.contact.city,
  facebookUrl: appConfig.social.facebook,
  instagramUrl: appConfig.social.instagram,
  freeShippingThreshold: appConfig.promotions.freeShippingThreshold,
  locale: appConfig.locale,
  currency: appConfig.currency,
};

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
          select: 'whatsapp_number,phone,email,city,facebook_url,instagram_url,free_shipping_threshold,locale,currency',
          limit: '1',
        },
      });

      const row = rows[0];
      if (!row) {
        settingsCache = fallbackSettings;
        return settingsCache;
      }

      settingsCache = {
        whatsappNumber: row.whatsapp_number || fallbackSettings.whatsappNumber,
        phone: row.phone || fallbackSettings.phone,
        email: row.email || fallbackSettings.email,
        city: row.city || fallbackSettings.city,
        facebookUrl: row.facebook_url || fallbackSettings.facebookUrl,
        instagramUrl: row.instagram_url || fallbackSettings.instagramUrl,
        freeShippingThreshold: Number(row.free_shipping_threshold ?? fallbackSettings.freeShippingThreshold),
        locale: row.locale || fallbackSettings.locale,
        currency: row.currency || fallbackSettings.currency,
      };

      return settingsCache;
    } catch {
      settingsCache = fallbackSettings;
      return settingsCache;
    }
  },

  clearCache() {
    settingsCache = null;
  },
};
