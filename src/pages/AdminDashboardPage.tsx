import { PagePlaceholder } from '@/components/PagePlaceholder'
import { AdminMetrics } from '@/features/admin/AdminMetrics'

export function AdminDashboardPage() {
  return (
    <PagePlaceholder
      eyebrow="Panel"
      title="Resumen operativo"
      description="Dashboard inicial para tener una vista rápida del estado del catálogo, pedidos y preparación del e-commerce."
    >
      <AdminMetrics />
    </PagePlaceholder>
  )
}
