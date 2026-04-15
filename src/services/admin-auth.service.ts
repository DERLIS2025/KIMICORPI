import { supabaseConfig, supabaseSession } from '@/integrations/supabase/client';
import { supabaseEnvError } from '@/config/env';

const ADMIN_USER_KEY = 'admin_user';

export interface AdminUser {
  id: string;
  email: string;
}

interface SupabaseAuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
  };
}

const getStoredUser = (): AdminUser | null => {
  const raw = window.localStorage.getItem(ADMIN_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
};

export const adminAuthService = {
  isAuthenticated(): boolean {
    return Boolean(supabaseSession.getAccessToken());
  },

  getUser(): AdminUser | null {
    return getStoredUser();
  },

  async login(email: string, password: string): Promise<void> {
    if (!supabaseConfig.enabled) {
      throw new Error(
        `Supabase no está configurado para login. ${supabaseEnvError ?? 'Revisá VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.'}`,
      );
    }

    const authUrl = `${supabaseConfig.url}/auth/v1/token?grant_type=password`;

    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        apikey: supabaseConfig.anonKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`No se pudo iniciar sesión contra ${authUrl}: ${detail}`);
    }

    const data = (await response.json()) as SupabaseAuthResponse;

    supabaseSession.setSession(data.access_token, data.refresh_token);
    window.localStorage.setItem(
      ADMIN_USER_KEY,
      JSON.stringify({ id: data.user.id, email: data.user.email }),
    );
  },

  async logout(): Promise<void> {
    const accessToken = supabaseSession.getAccessToken();

    if (supabaseConfig.enabled && accessToken) {
      await fetch(`${supabaseConfig.url}/auth/v1/logout`, {
        method: 'POST',
        headers: {
          apikey: supabaseConfig.anonKey,
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }).catch(() => undefined);
    }

    supabaseSession.clearSession();
    window.localStorage.removeItem(ADMIN_USER_KEY);
  },
};