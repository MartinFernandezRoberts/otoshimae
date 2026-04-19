import { useLocation } from 'react-router-dom'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useSeo } from '@/hooks/useSeo'
import { formatCurrency } from '@/lib/formatCurrency'
import { routes } from '@/lib/routes'

type CheckoutSuccessState = {
  orderNumber?: string
  total?: number
}

export function CheckoutSuccessPage() {
  const location = useLocation()
  const state = (location.state as CheckoutSuccessState | null) ?? null
  const searchParams = new URLSearchParams(location.search)
  const orderNumber = state?.orderNumber ?? searchParams.get('orden') ?? null

  useSeo({
    title: 'Compra confirmada',
    description:
      'Pantalla de confirmacion de compra Otoshimae con resumen basico de la orden creada.',
  })

  return (
    <section className="mx-auto max-w-3xl">
      <Card className="space-y-6 p-8 md:p-10">
        <Badge variant="success">Orden creada</Badge>
        <div className="space-y-3">
          <h1 className="text-5xl text-[var(--foreground)] md:text-6xl">
            Compra confirmada
          </h1>
          <p className="text-base leading-8 text-[var(--foreground-soft)]">
            Tu orden quedo registrada correctamente en Supabase. Desde aqui puedes
            volver al catalogo o seguir explorando otras piezas.
          </p>
        </div>

        <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
            Numero de orden
          </p>
          <p className="mt-3 text-2xl text-[var(--foreground)]">
            {orderNumber ?? 'Disponible en el panel admin'}
          </p>
          {typeof state?.total === 'number' ? (
            <p className="mt-3 text-sm text-[var(--foreground-soft)]">
              Total registrado: {formatCurrency(state.total)}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button to={routes.catalog}>Volver al catalogo</Button>
          <Button to={routes.home} variant="secondary">
            Ir al inicio
          </Button>
        </div>
      </Card>
    </section>
  )
}
