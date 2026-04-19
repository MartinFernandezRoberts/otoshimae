export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[]

export type CategoryRow = {
  id: string
  name: string
  slug: string
  description: string | null
  is_active: boolean
  created_at: string
}

export type ProductRow = {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  price: number
  compare_price: number | null
  stock: number
  sku: string | null
  category_id: string | null
  is_active: boolean
  is_featured: boolean
  created_at: string
}

export type ProductImageRow = {
  id: string
  product_id: string
  url: string
  alt: string | null
  sort_order: number
  storage_path: string | null
  created_at: string
}

export type ProductVariantRow = {
  id: string
  product_id: string
  name: string
  sku: string | null
  price: number | null
  stock: number
  attributes: JsonValue
  is_active: boolean
  created_at: string
}

export type InventoryMovementType =
  | 'initial_stock'
  | 'manual_adjustment'
  | 'order_created'
  | 'order_cancelled'
  | 'restock'

export type InventoryMovementRow = {
  id: string
  product_id: string
  product_variant_id: string | null
  movement_type: InventoryMovementType
  quantity: number
  reference: string | null
  notes: string | null
  created_at: string
}

export type OrderStatus =
  | 'pendiente'
  | 'confirmado'
  | 'preparando'
  | 'enviado'
  | 'entregado'
  | 'cancelado'

export type OrderRow = {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  status: OrderStatus
  subtotal: number
  total: number
  notes: string | null
  created_at: string
}

export type OrderItemRow = {
  id: string
  order_id: string
  product_id: string | null
  product_name_snapshot: string
  unit_price: number
  quantity: number
  line_total: number
}

export type AdminUserRow = {
  id: string
  email: string
  full_name: string | null
  role: string
  is_active: boolean
  created_at: string
}

export type SiteSettingRow = {
  key: string
  value: JsonValue
  description: string | null
  created_at: string
  updated_at: string
}

export type HomepageBannerRow = {
  id: string
  title: string
  subtitle: string | null
  image_url: string | null
  link_url: string | null
  sort_order: number
  is_active: boolean
  created_at: string
}

export type PublicProductSummary = ProductRow & {
  category?: Pick<CategoryRow, 'id' | 'name' | 'slug'> | null
  images?: ProductImageRow[]
}

export type CreateOrderItemInput = {
  productId: string
  quantity: number
}

export type CreateOrderInput = {
  customerName: string
  customerEmail: string
  customerPhone?: string
  notes?: string
  items: CreateOrderItemInput[]
}

export type CreateOrderResult = {
  order_id: string
  order_number: string
  total: number
}
