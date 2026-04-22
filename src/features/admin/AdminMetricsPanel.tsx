import { Card } from '@/components/ui/Card'
import type { AdminOrderRecord } from '@/features/admin/admin.types'
import type { CategoryRow, ProductRow } from '@/types/database'

type AdminMetricsPanelProps = {
  categories: CategoryRow[]
  products: ProductRow[]
  orders: AdminOrderRecord[]
}

export function AdminMetricsPanel({
  categories,
  products,
  orders,
}: AdminMetricsPanelProps) {
  const pendingOrders = orders.filter((order) => order.status === 'pendiente').length
  const lowStock = products.filter((product) => product.stock <= 3).length

  const metrics = [
    {
      label: 'Categorias',
      value: categories.length,
      detail: 'Estructuras activas para ordenar catalogo.',
    },
    {
      label: 'Productos',
      value: products.length,
      detail: 'Registros creados en base de datos.',
    },
    {
      label: 'Stock bajo',
      value: lowStock,
      detail: 'Productos con stock igual o menor a 3.',
    },
    {
      label: 'Pedidos pendientes',
      value: pendingOrders,
      detail: 'Ordenes esperando confirmacion.',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label} tone="admin" className="p-5">
          <p className="text-sm text-[var(--foreground-soft)]">{metric.label}</p>
          <p className="mt-3 text-4xl text-[var(--foreground)]">{metric.value}</p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{metric.detail}</p>
        </Card>
      ))}
    </div>
  )
}
