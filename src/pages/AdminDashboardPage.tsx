import { useEffect, useState } from 'react'

import { PagePlaceholder } from '@/components/PagePlaceholder'
import { Card } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import { StatusMessage } from '@/components/ui/StatusMessage'
import { listAdminCategories, listAdminProducts, listAdminOrders } from '@/features/admin/admin.api'
import { AdminMetricsPanel } from '@/features/admin/AdminMetricsPanel'
import type { CategoryRow, ProductRow } from '@/types/database'
import type { AdminOrderRecord } from '@/features/admin/admin.types'

export function AdminDashboardPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [products, setProducts] = useState<ProductRow[]>([])
  const [orders, setOrders] = useState<AdminOrderRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const task = () => {
      void (async () => {
        try {
          const [nextCategories, nextProducts, nextOrders] = await Promise.all([
            listAdminCategories(),
            listAdminProducts(),
            listAdminOrders(),
          ])

          setCategories(nextCategories)
          setProducts(nextProducts)
          setOrders(nextOrders)
        } catch (loadError) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'No se pudo cargar el dashboard admin.',
          )
        } finally {
          setLoading(false)
        }
      })()
    }

    queueMicrotask(task)
  }, [])

  return (
    <PagePlaceholder
      eyebrow="Panel"
      title="Resumen operativo"
      description="Vista rápida del estado del catálogo, stock y pedidos conectada a Supabase."
    >
      {loading ? (
        <Card tone="admin" className="p-8">
          <Loader label="Cargando métricas del panel..." />
        </Card>
      ) : error ? (
        <StatusMessage tone="error" message={error} />
      ) : (
        <AdminMetricsPanel
          categories={categories}
          products={products}
          orders={orders}
        />
      )}
    </PagePlaceholder>
  )
}
