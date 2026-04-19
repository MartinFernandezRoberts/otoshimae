import { ensureSupabase } from '@/lib/supabase'
import type {
  CategoryRow,
  ProductImageRow,
  ProductRow,
  PublicProductSummary,
} from '@/types/database'

type ProductSelectRow = ProductRow & {
  categories: Array<Pick<CategoryRow, 'id' | 'name' | 'slug'>> | null
  product_images: ProductImageRow[] | null
}

function mapProduct(row: ProductSelectRow): PublicProductSummary {
  return {
    ...row,
    category: row.categories?.[0] ?? null,
    images: (row.product_images ?? [])
      .filter((image) => !image.is_deleted)
      .sort((left, right) => left.sort_order - right.sort_order),
  }
}

export async function listPublicCategories() {
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

export async function listPublicProducts() {
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
        product_images (id, product_id, url, alt, sort_order, storage_path, is_deleted, deleted_at, created_at)
      `,
    )
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return ((data ?? []) as unknown as ProductSelectRow[]).map(mapProduct)
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
        product_images (id, product_id, url, alt, sort_order, storage_path, is_deleted, deleted_at, created_at)
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
        product_images (id, product_id, url, alt, sort_order, storage_path, is_deleted, deleted_at, created_at)
      `,
    )
    .in('id', ids)
    .eq('is_active', true)

  if (error) {
    throw new Error(error.message)
  }

  return ((data ?? []) as unknown as ProductSelectRow[]).map(mapProduct)
}
