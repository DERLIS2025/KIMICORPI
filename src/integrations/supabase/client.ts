import { createClient } from '@supabase/supabase-js';
import { env, hasSupabaseEnv, supabaseEnvError } from '@/config/env';

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

//
// 🔥 CLIENTE OFICIAL DE SUPABASE (PARA STORAGE)
//
export const supabase = createClient(
  supabaseConfig.url,
  supabaseConfig.anonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

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

export async function supabaseRest<T>(
  path: string,
  options: SupabaseRequestOptions = {}
): Promise<T> {
  if (!supabaseConfig.enabled) {
    throw new Error(
      `Supabase no está configurado. ${
        supabaseEnvError ??
        'Definí VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.'
      }`
    );
  }

  const { method = 'GET', query, body, useAuth = false } = options;
  const queryString = buildQueryString(query);
  const accessToken = useAuth
    ? (await supabase.auth.getSession()).data.session?.access_token
    : null;

  const response = await fetch(
    `${supabaseConfig.url}/rest/v1/${path}${queryString}`,
    {
      method,
      headers: {
        apikey: supabaseConfig.anonKey,
        Authorization: `Bearer ${accessToken || supabaseConfig.anonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: body ? JSON.stringify(body) : undefined,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Supabase request failed (${response.status}): ${errorText}`
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
