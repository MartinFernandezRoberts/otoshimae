import { ensureSupabase } from '@/lib/supabase'
import type {
  CategoryRow,
  ProductImageRow,
  ProductRow,
  PublicProductSummary,
} from '@/types/database'

type ProductImageSelectRow = Omit<ProductImageRow, 'is_deleted' | 'deleted_at'> &
  Partial<Pick<ProductImageRow, 'is_deleted' | 'deleted_at'>>

type ProductSelectRow = ProductRow & {
  categories: Array<Pick<CategoryRow, 'id' | 'name' | 'slug'>> | null
  product_images: ProductImageSelectRow[] | null
}

type CacheEntry<T> = {
  value: T
  expiresAt: number
}

const PUBLIC_CACHE_TTL_MS = 60_000

let publicCategoriesCache: CacheEntry<CategoryRow[]> | null = null
let publicCategoriesPromise: Promise<CategoryRow[]> | null = null
let publicProductsCache: CacheEntry<PublicProductSummary[]> | null = null
let publicProductsPromise: Promise<PublicProductSummary[]> | null = null

function isCacheFresh<T>(entry: CacheEntry<T> | null) {
  return Boolean(entry && entry.expiresAt > Date.now())
}

function normalizeProductImage(image: ProductImageSelectRow): ProductImageRow {
  return {
    ...image,
    is_deleted: image.is_deleted ?? false,
    deleted_at: image.deleted_at ?? null,
  }
}

function mapProduct(row: ProductSelectRow): PublicProductSummary {
  return {
    ...row,
    category: row.categories?.[0] ?? null,
    images: (row.product_images ?? [])
      .map(normalizeProductImage)
      .filter((image) => !image.is_deleted)
      .sort((left, right) => left.sort_order - right.sort_order),
  }
}

async function fetchPublicCategories() {
  const supabase = ensureSupabase()
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description, is_active, created_at')
    .eq('is_active', true)
    .order('name')

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as CategoryRow[]
}

async function fetchPublicProducts() {
  const supabase = ensureSupabase()
  const { data, error } = await supabase
    .from('products')
    .select(
      `
        id,
        name,
        slug,
        description,
        short_description,
        price,
        compare_price,
        stock,
        sku,
        category_id,
        is_active,
        is_featured,
        created_at,
        categories (id, name, slug),
        product_images (id, product_id, url, alt, sort_order, storage_path, created_at)
      `,
    )
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return ((data ?? []) as unknown as ProductSelectRow[]).map(mapProduct)
}

export async function listPublicCategories(options?: { force?: boolean }) {
  if (!options?.force && isCacheFresh(publicCategoriesCache)) {
    return publicCategoriesCache!.value
  }

  if (!options?.force && publicCategoriesPromise) {
    return publicCategoriesPromise
  }

  publicCategoriesPromise = fetchPublicCategories().then((categories) => {
    publicCategoriesCache = {
      value: categories,
      expiresAt: Date.now() + PUBLIC_CACHE_TTL_MS,
    }
    publicCategoriesPromise = null
    return categories
  })

  return publicCategoriesPromise.catch((error: unknown) => {
    publicCategoriesPromise = null
    throw error
  })
}

export async function listPublicProducts(options?: { force?: boolean }) {
  if (!options?.force && isCacheFresh(publicProductsCache)) {
    return publicProductsCache!.value
  }

  if (!options?.force && publicProductsPromise) {
    return publicProductsPromise
  }

  publicProductsPromise = fetchPublicProducts().then((products) => {
    publicProductsCache = {
      value: products,
      expiresAt: Date.now() + PUBLIC_CACHE_TTL_MS,
    }
    publicProductsPromise = null
    return products
  })

  return publicProductsPromise.catch((error: unknown) => {
    publicProductsPromise = null
    throw error
  })
}

export async function getPublicProductBySlug(slug: string) {
  const supabase = ensureSupabase()
  const { data, error } = await supabase
    .from('products')
    .select(
      `
        id,
        name,
        slug,
        description,
        short_description,
        price,
        compare_price,
        stock,
        sku,
        category_id,
        is_active,
        is_featured,
        created_at,
        categories (id, name, slug),
        product_images (id, product_id, url, alt, sort_order, storage_path, created_at)
      `,
    )
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data ? mapProduct(data as unknown as ProductSelectRow) : null
}

export async function listPublicProductsByIds(ids: string[]) {
  if (ids.length === 0) {
    return []
  }

  const supabase = ensureSupabase()
  const { data, error } = await supabase
    .from('products')
    .select(
      `
        id,
        name,
        slug,
        description,
        short_description,
        price,
        compare_price,
        stock,
        sku,
        category_id,
        is_active,
        is_featured,
        created_at,
        categories (id, name, slug),
        product_images (id, product_id, url, alt, sort_order, storage_path, created_at)
      `,
    )
    .in('id', ids)
    .eq('is_active', true)

  if (error) {
    throw new Error(error.message)
  }

  return ((data ?? []) as unknown as ProductSelectRow[]).map(mapProduct)
}
