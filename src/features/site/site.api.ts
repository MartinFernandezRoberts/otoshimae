import { ensureSupabase } from '@/lib/supabase'
import type { HomepageBannerRow, SiteSettingRow } from '@/types/database'

export async function listHomepageBanners() {
  const supabase = ensureSupabase()
  const { data, error } = await supabase
    .from('homepage_banners')
    .select('id, title, subtitle, image_url, link_url, sort_order, is_active, created_at')
    .eq('is_active', true)
    .order('sort_order')

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as HomepageBannerRow[]
}

export async function listSiteSettings() {
  const supabase = ensureSupabase()
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value, description, created_at, updated_at')
    .order('key')

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as SiteSettingRow[]
}
