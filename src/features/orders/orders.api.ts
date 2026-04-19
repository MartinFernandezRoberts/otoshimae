import { ensureSupabase } from '@/lib/supabase'
import type {
  CreateOrderInput,
  CreateOrderResult,
  OrderRow,
  PublicProductSummary,
} from '@/types/database'

export async function createOrder(input: CreateOrderInput) {
  const supabase = ensureSupabase()
  const { data, error } = await supabase.rpc('create_order_with_items', {
    p_customer_name: input.customerName,
    p_customer_email: input.customerEmail,
    p_customer_phone: input.customerPhone ?? null,
    p_notes: input.notes ?? null,
    p_items: input.items.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
    })),
  })

  if (error) {
    throw new Error(error.message)
  }

  const result = (data?.[0] ?? null) as CreateOrderResult | null

  if (!result) {
    throw new Error('No se recibió la orden creada desde Supabase.')
  }

  return result
}

export async function listOrdersForAdmin() {
  const supabase = ensureSupabase()
  const { data, error } = await supabase
    .from('orders')
    .select(
      'id, order_number, customer_name, customer_email, customer_phone, status, subtotal, total, notes, created_at',
    )
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as OrderRow[]
}

export function buildCheckoutItems(products: PublicProductSummary[]) {
  return products
    .filter((product) => product.stock > 0)
    .slice(0, 3)
    .map((product) => ({
      productId: product.id,
      quantity: 1,
      label: `${product.name} · stock ${product.stock}`,
      price: product.price,
    }))
}
