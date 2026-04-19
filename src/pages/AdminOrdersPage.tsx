import { PagePlaceholder } from '@/components/PagePlaceholder'
import { OrdersOverviewPlaceholder } from '@/features/orders/OrdersOverviewPlaceholder'

export function AdminOrdersPage() {
  return (
    <PagePlaceholder
      eyebrow="Admin"
      title="Pedidos"
      description="Base visual para revisar estados, pagos y despacho sin mezclar esta lógica con las pantallas públicas."
    >
      <OrdersOverviewPlaceholder />
    </PagePlaceholder>
  )
}
