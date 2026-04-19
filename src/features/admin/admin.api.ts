import { env } from '@/lib/env'
import { ensureSupabase } from '@/lib/supabase'
import type { JsonValue, OrderStatus, SiteSettingRow } from '@/types/database'
import type {
  AdminCategoryFormValues,
  AdminProductFormValues,
  StockAdjustmentValues,
  StoreSettingsFormValues,
} from '@/features/admin/admin.types'
import type {
  AdminOrderRecord,
  AdminProductImage,
  AdminProductRecord,
} from '@/features/admin/admin.types'

type CategoryInput = AdminCategoryFormValues
type ProductInput = AdminProductFormValues

type SettingsUpsertInput = Array<{
  key: string
  value: JsonValue
  description: string
}>

export async function listAdminCategories() {
  const supabase = ensureSupabase()
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description, is_active, created_at')
    .order('name')

  if (error) {
    throw new Error(error.message)
  }

  return data ?? []
}

export async function createCategory(values: CategoryInput) {
  const supabase = ensureSupabase()
  const { error } = await supabase.from('categories').insert({
    name: values.name.trim(),
    slug: values.slug.trim(),
    description: values.description.trim() || null,
    is_active: values.isActive,
  })

  if (error) {
    throw new Error(error.message)
  }
}

export async function updateCategory(categoryId: string, values: CategoryInput) {
  const supabase = ensureSupabase()
  const { error } = await supabase
    .from('categories')
    .update({
      name: values.name.trim(),
      slug: values.slug.trim(),
      description: values.description.trim() || null,
      is_active: values.isActive,
    })
    .eq('id', categoryId)

  if (error) {
    throw new Error(error.message)
  }
}

export async function deleteCategory(categoryId: string) {
  const supabase = ensureSupabase()
  const { error } = await supabase.from('categories').delete().eq('id', categoryId)

  if (error) {
    throw new Error(error.message)
  }
}

export async function listAdminProducts() {
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
        product_images (
          id,
          product_id,
          url,
          alt,
          sort_order,
          storage_path,
          created_at,
          is_deleted,
          deleted_at
        )
      `,
    )
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as unknown as AdminProductRecord[]
}

export async function createProduct(values: ProductInput) {
  const supabase = ensureSupabase()
  const { error } = await supabase.from('products').insert({
    name: values.name.trim(),
    slug: values.slug.trim(),
    description: values.description.trim() || null,
    short_description: values.shortDescription.trim() || null,
    price: Number(values.price),
    compare_price: values.comparePrice.trim() ? Number(values.comparePrice) : null,
    stock: Number(values.stock),
    sku: values.sku.trim() || null,
    category_id: values.categoryId || null,
    is_active: values.isActive,
    is_featured: values.isFeatured,
  })

  if (error) {
    throw new Error(error.message)
  }
}

export async function updateProduct(productId: string, values: ProductInput) {
  const supabase = ensureSupabase()
  const { error } = await supabase
    .from('products')
    .update({
      name: values.name.trim(),
      slug: values.slug.trim(),
      description: values.description.trim() || null,
      short_description: values.shortDescription.trim() || null,
      price: Number(values.price),
      compare_price: values.comparePrice.trim() ? Number(values.comparePrice) : null,
      stock: Number(values.stock),
      sku: values.sku.trim() || null,
      category_id: values.categoryId || null,
      is_active: values.isActive,
      is_featured: values.isFeatured,
    })
    .eq('id', productId)

  if (error) {
    throw new Error(error.message)
  }
}

export async function deleteProduct(productId: string) {
  const supabase = ensureSupabase()
  const { error } = await supabase.from('products').delete().eq('id', productId)

  if (error) {
    throw new Error(error.message)
  }
}

export async function adjustProductStock(
  productId: string,
  currentStock: number,
  values: StockAdjustmentValues,
) {
  const supabase = ensureSupabase()
  const quantity = Number(values.quantity)
  const nextStock = Math.max(0, currentStock + quantity)

  const { error: updateError } = await supabase
    .from('products')
    .update({
      stock: nextStock,
    })
    .eq('id', productId)

  if (updateError) {
    throw new Error(updateError.message)
  }

  const { error: movementError } = await supabase.from('inventory_movements').insert({
    product_id: productId,
    movement_type: 'manual_adjustment',
    quantity,
    notes: values.notes.trim() || 'Ajuste manual desde panel admin',
  })

  if (movementError) {
    throw new Error(movementError.message)
  }
}

export async function uploadProductImage(
  productId: string,
  file: File,
  alt: string,
  sortOrder: number,
) {
  const supabase = ensureSupabase()
  const extension = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const path = `${productId}/${crypto.randomUUID()}.${extension}`

  const { error: uploadError } = await supabase.storage
    .from(env.supabaseStorageBucket)
    .upload(path, file, {
      upsert: false,
    })

  if (uploadError) {
    throw new Error(uploadError.message)
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(env.supabaseStorageBucket).getPublicUrl(path)

  const { error: insertError } = await supabase.from('product_images').insert({
    product_id: productId,
    url: publicUrl,
    alt: alt.trim() || null,
    sort_order: sortOrder,
    storage_path: path,
  })

  if (insertError) {
    throw new Error(insertError.message)
  }
}

export async function markProductImageAsDeleted(image: AdminProductImage) {
  const supabase = ensureSupabase()
  const { error } = await supabase
    .from('product_images')
    .update({
      is_deleted: true,
      deleted_at: new Date().toISOString(),
    })
    .eq('id', image.id)

  if (error) {
    throw new Error(error.message)
  }
}

export async function listAdminOrders() {
  const supabase = ensureSupabase()
  const { data, error } = await supabase
    .from('orders')
    .select(
      `
        id,
        order_number,
        customer_name,
        customer_email,
        customer_phone,
        status,
        subtotal,
        total,
        notes,
        created_at,
        order_items (
          id,
          order_id,
          product_id,
          product_name_snapshot,
          unit_price,
          quantity,
          line_total
        )
      `,
    )
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as unknown as AdminOrderRecord[]
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = ensureSupabase()
  const { error } = await supabase
    .from('orders')
    .update({
      status,
    })
    .eq('id', orderId)

  if (error) {
    throw new Error(error.message)
  }
}

export async function listAdminSettings() {
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

export async function saveAdminSettings(values: StoreSettingsFormValues) {
  const supabase = ensureSupabase()
  const payload: SettingsUpsertInput = [
    {
      key: 'store_name',
      value: values.storeName.trim(),
      description: 'Nombre visible de la tienda',
    },
    {
      key: 'store_email',
      value: values.storeEmail.trim(),
      description: 'Correo público de contacto',
    },
    {
      key: 'store_currency',
      value: values.storeCurrency.trim(),
      description: 'Moneda principal de la tienda',
    },
    {
      key: 'store_whatsapp',
      value: values.whatsapp.trim(),
      description: 'Canal rápido de contacto',
    },
    {
      key: 'shipping_note',
      value: values.shippingNote.trim(),
      description: 'Texto visible sobre despacho',
    },
    {
      key: 'pickup_address',
      value: values.pickupAddress.trim(),
      description: 'Dirección de retiro si aplica',
    },
  ]

  const { error } = await supabase.from('site_settings').upsert(payload, {
    onConflict: 'key',
  })

  if (error) {
    throw new Error(error.message)
  }
}
