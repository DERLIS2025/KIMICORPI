import { env, hasSupabaseEnv, supabaseEnvError } from '@/config/env';

const ACCESS_TOKEN_KEY = 'sb_access_token';
const REFRESH_TOKEN_KEY = 'sb_refresh_token';

export interface SupabaseClientConfig {
  url: string;
  anonKey: string;
  enabled: boolean;
}

export const supabaseConfig: SupabaseClientConfig = {
  url: env.supabaseUrl ?? '',
  anonKey: env.supabaseAnonKey ?? '',
  enabled: hasSupabaseEnv,
};

interface SupabaseRequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  query?: Record<string, string>;
  body?: unknown;
  useAuth?: boolean;
}

const buildQueryString = (query?: Record<string, string>) => {
  if (!query) return '';
  const params = new URLSearchParams(query);
  return params.toString() ? `?${params.toString()}` : '';
};

export const supabaseSession = {
  getAccessToken() {
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken() {
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setSession(accessToken: string, refreshToken: string) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clearSession() {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

export async function supabaseRest<T>(path: string, options: SupabaseRequestOptions = {}): Promise<T> {
  if (!supabaseConfig.enabled) {
    throw new Error(`Supabase no está configurado. ${supabaseEnvError ?? 'Definí VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.'}`);
  }

  const { method = 'GET', query, body, useAuth = false } = options;
  const queryString = buildQueryString(query);
  const accessToken = useAuth ? supabaseSession.getAccessToken() : null;

  const response = await fetch(`${supabaseConfig.url}/rest/v1/${path}${queryString}`, {
    method,
    headers: {
      apikey: supabaseConfig.anonKey,
      Authorization: `Bearer ${accessToken || supabaseConfig.anonKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${errorText}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
