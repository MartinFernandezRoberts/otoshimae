import { useEffect, useState } from 'react'

import { PagePlaceholder } from '@/components/PagePlaceholder'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Loader } from '@/components/ui/Loader'
import { Select } from '@/components/ui/Select'
import { StatusMessage } from '@/components/ui/StatusMessage'
import { listAdminOrders, updateOrderStatus } from '@/features/admin/admin.api'
import { orderStatusOptions } from '@/features/admin/admin.constants'
import { formatCurrency } from '@/lib/formatCurrency'
import { formatDate } from '@/lib/formatDate'
import type { OrderStatus } from '@/types/database'
import type { AdminOrderRecord } from '@/features/admin/admin.types'

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrderRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [draftStatuses, setDraftStatuses] = useState<Record<string, OrderStatus>>({})
  const [savingId, setSavingId] = useState<string | null>(null)

  const loadOrders = async () => {
    try {
      setError(null)
      const nextOrders = await listAdminOrders()
      setOrders(nextOrders)
      setDraftStatuses(
        nextOrders.reduce<Record<string, OrderStatus>>((accumulator, order) => {
          accumulator[order.id] = order.status
          return accumulator
        }, {}),
      )
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'No se pudieron cargar los pedidos.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      void loadOrders()
    })
  }, [])

  const handleSaveStatus = async (orderId: string) => {
    const status = draftStatuses[orderId]

    if (!status) {
      return
    }

    try {
      setSavingId(orderId)
      setError(null)
      setSuccess(null)
      await updateOrderStatus(orderId, status)
      setSuccess('Estado de pedido actualizado correctamente.')
      await loadOrders()
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'No se pudo actualizar el estado del pedido.',
      )
    } finally {
      setSavingId(null)
    }
  }

  return (
    <PagePlaceholder
      eyebrow="Admin"
      title="Pedidos"
      description="Listado de órdenes con cambio manual de estado para el flujo operativo del MVP."
    >
      {error ? <StatusMessage tone="error" message={error} /> : null}
      {success ? <StatusMessage tone="success" message={success} /> : null}

      {loading ? (
        <Card tone="admin" className="p-8">
          <Loader label="Cargando pedidos..." />
        </Card>
      ) : orders.length === 0 ? (
        <EmptyState
          title="No hay pedidos todavía"
          description="Cuando se creen órdenes desde checkout aparecerán aquí para su gestión."
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} tone="admin" className="space-y-5 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <h2 className="text-3xl text-white">{order.order_number}</h2>
                  <p className="text-sm text-slate-300">
                    {order.customer_name} · {order.customer_email}
                  </p>
                  <p className="text-sm text-slate-400">
                    Creado: {formatDate(order.created_at)}
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-[220px_auto] md:items-end">
                  <Select
                    label="Estado"
                    value={draftStatuses[order.id] ?? order.status}
                    onChange={(event) =>
                      setDraftStatuses((current) => ({
                        ...current,
                        [order.id]: event.target.value as OrderStatus,
                      }))
                    }
                    options={orderStatusOptions}
                  />
                  <Button
                    size="sm"
                    loading={savingId === order.id}
                    onClick={() => void handleSaveStatus(order.id)}
                  >
                    Guardar estado
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 text-sm text-slate-200 md:grid-cols-3">
                <p>Total: {formatCurrency(Number(order.total))}</p>
                <p>Subtotal: {formatCurrency(Number(order.subtotal))}</p>
                <p>Ítems: {order.order_items?.length ?? 0}</p>
              </div>

              {order.notes ? (
                <p className="text-sm leading-7 text-slate-300/80">{order.notes}</p>
              ) : null}

              <div className="space-y-3">
                {(order.order_items ?? []).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[var(--radius-sm)] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
                  >
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <span>{item.product_name_snapshot}</span>
                      <span>
                        {item.quantity} x {formatCurrency(Number(item.unit_price))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </PagePlaceholder>
  )
}
