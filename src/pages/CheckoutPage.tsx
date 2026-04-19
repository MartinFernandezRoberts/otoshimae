import { PagePlaceholder } from '@/components/PagePlaceholder'
import { CheckoutOrderForm } from '@/features/orders/CheckoutOrderForm'

export function CheckoutPage() {
  return (
    <PagePlaceholder
      eyebrow="Conversión"
      title="Checkout"
      description="Esta pantalla ya puede crear órdenes reales en Supabase usando productos activos y el RPC transaccional del proyecto."
    >
      <CheckoutOrderForm />
    </PagePlaceholder>
  )
}
