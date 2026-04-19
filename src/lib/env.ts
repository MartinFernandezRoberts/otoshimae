export const env = {
  appName: import.meta.env.VITE_APP_NAME ?? 'Otoshimae',
  appUrl: import.meta.env.VITE_APP_URL ?? 'http://localhost:5173',
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:4000',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? '',
  supabasePublishableKey:
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
    import.meta.env.VITE_SUPABASE_ANON_KEY ??
    '',
  supabaseStorageBucket:
    import.meta.env.VITE_SUPABASE_STORAGE_BUCKET ?? 'product-images',
}

export const hasSupabaseEnv = Boolean(
  env.supabaseUrl && env.supabasePublishableKey,
)
