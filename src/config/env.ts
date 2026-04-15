const readEnv = (key: string, fallback = ''): string => {
  const value = import.meta.env[key as keyof ImportMetaEnv];
  return typeof value === 'string' ? value : fallback;
};

export const env = {
  supabaseUrl: readEnv('VITE_SUPABASE_URL'),
  supabaseAnonKey: readEnv('VITE_SUPABASE_ANON_KEY'),
} as const;

export const hasSupabaseEnv = Boolean(env.supabaseUrl && env.supabaseAnonKey);
