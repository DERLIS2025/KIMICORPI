const readEnv = (key: string): string | undefined => {
  const value = import.meta.env[key as keyof ImportMetaEnv];
  if (typeof value !== 'string') return undefined;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const normalizeAbsoluteUrl = (value?: string): string | undefined => {
  if (!value) return undefined;

  try {
    const parsed = new URL(value);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return undefined;
    }

    return value.replace(/\/+$/, '');
  } catch {
    return undefined;
  }
};

const rawSupabaseUrl = readEnv('VITE_SUPABASE_URL');
const supabaseUrl = normalizeAbsoluteUrl(rawSupabaseUrl);
const supabaseAnonKey = readEnv('VITE_SUPABASE_ANON_KEY');

export const env = {
  supabaseUrl,
  supabaseAnonKey,
} as const;

export const hasSupabaseEnv = Boolean(env.supabaseUrl && env.supabaseAnonKey);

export const supabaseEnvError = !rawSupabaseUrl
  ? 'Falta VITE_SUPABASE_URL en el entorno de build/deploy.'
  : !supabaseUrl
    ? 'VITE_SUPABASE_URL es inválida: debe ser una URL absoluta (https://<project>.supabase.co).'
    : !supabaseAnonKey
      ? 'Falta VITE_SUPABASE_ANON_KEY en el entorno de build/deploy.'
      : null;