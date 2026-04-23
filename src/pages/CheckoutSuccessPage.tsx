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

const nextSteps = [
  'Tu orden queda registrada y disponible para gestion interna.',
  'El numero de orden funciona como referencia de seguimiento dentro del atelier.',
  'Puedes volver a la coleccion para seguir descubriendo otras piezas de autor.',
] as const

export function CheckoutSuccessPage() {
  const location = useLocation()
  const state = (location.state as CheckoutSuccessState | null) ?? null
  const searchParams = new URLSearchParams(location.search)
  const orderNumber = state?.orderNumber ?? searchParams.get('orden') ?? null

  useSeo({
    title: 'Compra confirmada',
    description:
      'Pantalla de confirmacion Otoshimae con numero de orden, total registrado y siguientes pasos del encargo.',
  })

  return (
    <section className="mx-auto max-w-5xl">
      <Card className="overflow-hidden p-0">
        <div className="grid gap-0 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="space-y-6 p-8 md:p-10">
            <Badge variant="success">Orden creada</Badge>
            <div className="space-y-4">
              <h1 className="text-6xl text-[var(--foreground)] md:text-7xl">
                Tu seleccion ya quedo registrada en el atelier.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[var(--foreground-soft)]">
                Recibimos tu solicitud correctamente. Desde aqui puedes volver a
                la coleccion, descubrir nuevas piezas o conservar la referencia
                de la orden para seguimiento interno.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="ui-surface-inset rounded-[var(--radius-md)] p-5">
                <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                  Numero de orden
                </p>
                <p className="mt-4 text-2xl text-[var(--foreground)]">
                  {orderNumber ?? 'Visible en gestion interna'}
                </p>
              </div>

              <div className="ui-surface-inset rounded-[var(--radius-md)] p-5">
                <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                  Total registrado
                </p>
                <p className="mt-4 text-2xl text-[var(--accent-strong)]">
                  {typeof state?.total === 'number'
                    ? formatCurrency(state.total)
                    : 'Visible en gestion interna'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button to={routes.catalog}>Volver a la coleccion</Button>
              <Button to={routes.home} variant="secondary">
                Ir al inicio
              </Button>
            </div>
          </div>

          <div className="relative min-h-[320px] border-t border-[var(--line)] bg-[linear-gradient(145deg,#161210_0%,#070707_100%)] lg:border-l lg:border-t-0">
            <div
              className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(209,178,138,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(121,36,27,0.16),transparent_28%)]"
              aria-hidden="true"
            />

            <div className="relative flex h-full flex-col justify-between gap-8 p-8 md:p-10">
              <div className="space-y-4">
                <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                  Siguientes pasos
                </p>
                <div className="space-y-3">
                  {nextSteps.map((step) => (
                    <div
                      key={step}
                      className="ui-surface-inset rounded-[var(--radius-md)] p-4 text-sm leading-7 text-[var(--foreground-soft)]"
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[var(--radius-md)] border border-[rgba(209,178,138,0.22)] bg-[rgba(209,178,138,0.08)] p-5">
                <p className="text-sm leading-7 text-[var(--foreground-soft)]">
                  Gracias por elegir una pieza de autor. La tienda queda lista
                  para que sigas explorando mascaras decorativas, collares
                  ornamentales y objetos de adorno con la misma firma visual.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}
