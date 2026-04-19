import { ensureSupabase } from '@/lib/supabase'
import type { HomepageBannerRow, SiteSettingRow } from '@/types/database'

type CacheEntry<T> = {
  value: T
  expiresAt: number
}

const PUBLIC_CACHE_TTL_MS = 60_000

let homepageBannersCache: CacheEntry<HomepageBannerRow[]> | null = null
let homepageBannersPromise: Promise<HomepageBannerRow[]> | null = null
let siteSettingsCache: CacheEntry<SiteSettingRow[]> | null = null
let siteSettingsPromise: Promise<SiteSettingRow[]> | null = null

function isCacheFresh<T>(entry: CacheEntry<T> | null) {
  return Boolean(entry && entry.expiresAt > Date.now())
}

async function fetchHomepageBanners() {
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

async function fetchSiteSettings() {
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

export async function listHomepageBanners(options?: { force?: boolean }) {
  if (!options?.force && isCacheFresh(homepageBannersCache)) {
    return homepageBannersCache!.value
  }

  if (!options?.force && homepageBannersPromise) {
    return homepageBannersPromise
  }

  homepageBannersPromise = fetchHomepageBanners().then((banners) => {
    homepageBannersCache = {
      value: banners,
      expiresAt: Date.now() + PUBLIC_CACHE_TTL_MS,
    }
    homepageBannersPromise = null
    return banners
  })

  return homepageBannersPromise.catch((error: unknown) => {
    homepageBannersPromise = null
    throw error
  })
}

export async function listSiteSettings(options?: { force?: boolean }) {
  if (!options?.force && isCacheFresh(siteSettingsCache)) {
    return siteSettingsCache!.value
  }

  if (!options?.force && siteSettingsPromise) {
    return siteSettingsPromise
  }

  siteSettingsPromise = fetchSiteSettings().then((settings) => {
    siteSettingsCache = {
      value: settings,
      expiresAt: Date.now() + PUBLIC_CACHE_TTL_MS,
    }
    siteSettingsPromise = null
    return settings
  })

  return siteSettingsPromise.catch((error: unknown) => {
    siteSettingsPromise = null
    throw error
  })
}
