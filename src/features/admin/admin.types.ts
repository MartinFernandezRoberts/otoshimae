import type {
  CategoryRow,
  OrderItemRow,
  OrderRow,
  ProductImageRow,
  ProductRow,
  SiteSettingRow,
} from '@/types/database'

export type AdminCategoryFormValues = {
  name: string
  slug: string
  description: string
  isActive: boolean
}

export type AdminProductFormValues = {
  name: string
  slug: string
  description: string
  shortDescription: string
  price: string
  comparePrice: string
  stock: string
  sku: string
  categoryId: string
  isActive: boolean
  isFeatured: boolean
}

export type StockAdjustmentValues = {
  quantity: string
  notes: string
}

export type StoreSettingsFormValues = {
  storeName: string
  storeEmail: string
  storeCurrency: string
  whatsapp: string
  shippingNote: string
  pickupAddress: string
}

export type AdminProductImage = ProductImageRow & {
  is_deleted: boolean
  deleted_at: string | null
}

export type AdminProductRecord = ProductRow & {
  categories: Pick<CategoryRow, 'id' | 'name' | 'slug'>[] | null
  product_images: AdminProductImage[] | null
}

export type AdminOrderRecord = OrderRow & {
  order_items: OrderItemRow[] | null
}

export type AdminSettingMap = Record<string, SiteSettingRow>
