import { useEffect, useMemo, useState } from 'react'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Loader } from '@/components/ui/Loader'
import { StatusMessage } from '@/components/ui/StatusMessage'
import { listPublicProductsByIds } from '@/features/catalog/catalog.api'
import { useCart } from '@/features/cart/useCart'
import { useSeo } from '@/hooks/useSeo'
import { formatCurrency } from '@/lib/formatCurrency'
import { routes } from '@/lib/routes'

const cartSteps = [
  {
    label: '01',
    title: 'Curaduria',
    description: 'Revisa cada pieza y afina cantidades segun stock real.',
  },
  {
    label: '02',
    title: 'Datos',
    description: 'Completa el checkout con informacion clara y sin friccion.',
  },
  {
    label: '03',
    title: 'Confirmacion',
    description: 'La orden se registra con snapshot de precios y productos.',
  },
] as const

export function CartPage() {
  const { items, subtotal, reconcileWithProducts, removeItem, updateQuantity } =
    useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const totalUnits = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  )

  useSeo({
    title: 'Carrito',
    description:
      'Revisa tu carrito Otoshimae, ajusta cantidades segun stock real y continua con un checkout premium y claro.',
  })

  const itemIds = useMemo(() => items.map((item) => item.productId), [items])
  const itemIdsKey = useMemo(() => itemIds.slice().sort().join(','), [itemIds])
  const idsForSync = useMemo(
    () => (itemIdsKey ? itemIdsKey.split(',') : []),
    [itemIdsKey],
  )

  useEffect(() => {
    if (!itemIdsKey) {
      return
    }

    let cancelled = false

    const syncCart = async () => {
      try {
        setLoading(true)
        setError(null)

        const products = await listPublicProductsByIds(idsForSync)

        if (!cancelled) {
          reconcileWithProducts(products)
        }
      } catch (nextError) {
        if (!cancelled) {
          setError(
            nextError instanceof Error
              ? nextError.message
              : 'No fue posible sincronizar el carrito.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void syncCart()

    return () => {
      cancelled = true
    }
  }, [idsForSync, itemIdsKey, reconcileWithProducts])

  if (items.length === 0) {
    return (
      <EmptyState
        title="Tu carrito esta vacio"
        description="Agrega piezas desde el catalogo para preparar una seleccion con presencia y luego avanzar al checkout."
        action={<Button to={routes.catalog}>Explorar catalogo</Button>}
      />
    )
  }

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--line)] bg-[rgba(8,8,8,0.74)] shadow-[var(--shadow-card)]">
        <div className="grid gap-8 p-6 md:p-8 xl:grid-cols-[1.02fr_0.98fr] xl:p-10">
          <div className="space-y-5">
            <Badge variant="accent">Encargo en curso</Badge>
            <h1 className="max-w-4xl text-6xl text-[var(--foreground)] md:text-7xl">
              Revisa tu seleccion antes de pasar a confirmacion.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[var(--foreground-soft)]">
              Este paso mantiene stock sincronizado, deja claro el total y
              prepara una transicion natural hacia el checkout sin perder la
              identidad premium del storefront.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {cartSteps.map((step) => (
              <Card key={step.label} tone="muted" className="p-5">
                <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--accent-strong)]">
                  {step.label}
                </p>
                <p className="mt-3 text-2xl text-[var(--foreground)]">{step.title}</p>
                <p className="mt-3 text-sm leading-7 text-[var(--foreground-soft)]">
                  {step.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {loading ? <Loader label="Sincronizando stock real..." /> : null}
      {error ? <StatusMessage tone="error" message={error} /> : null}

      <section className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          {items.map((item) => (
            <Card key={item.productId} className="overflow-hidden p-0">
              <div className="grid gap-0 md:grid-cols-[220px_1fr]">
                <div className="min-h-[220px] border-b border-[var(--line)] bg-[linear-gradient(145deg,#161210_0%,#060606_100%)] md:border-b-0 md:border-r">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.imageAlt ?? item.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-5xl font-semibold tracking-[0.24em] text-[rgba(245,240,232,0.14)]">
                        O
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-5 p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={item.stock > 0 ? 'success' : 'danger'}>
                          {item.stock > 0 ? `${item.stock} disponibles` : 'Sin stock'}
                        </Badge>
                        <Badge>Seleccion Otoshimae</Badge>
                      </div>
                      <div>
                        <h2 className="text-4xl text-[var(--foreground)]">{item.name}</h2>
                        <p className="mt-2 text-sm leading-7 text-[var(--foreground-soft)]">
                          Pieza en carrito con stock validado y preparada para
                          ingresar al checkout.
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      className="justify-start px-0 lg:justify-center"
                      onClick={() => removeItem(item.productId)}
                    >
                      Quitar
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      aria-label={`Disminuir cantidad de ${item.name}`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] text-[var(--foreground)] transition hover:border-[rgba(209,178,138,0.4)]"
                      onClick={() =>
                        updateQuantity(item.productId, Math.max(1, item.quantity - 1))
                      }
                    >
                      -
                    </button>
                    <div className="min-w-28 rounded-full border border-[var(--line)] px-4 py-2 text-center text-sm text-[var(--foreground)]">
                      {item.quantity} unidad{item.quantity > 1 ? 'es' : ''}
                    </div>
                    <button
                      type="button"
                      aria-label={`Aumentar cantidad de ${item.name}`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] text-[var(--foreground)] transition hover:border-[rgba(209,178,138,0.4)]"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          Math.min(item.stock, item.quantity + 1),
                        )
                      }
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>

                  <div className="ui-surface-inset flex flex-wrap items-end justify-between gap-4 rounded-[var(--radius-md)] p-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                        Precio unitario
                      </p>
                      <p className="mt-3 text-2xl text-[var(--accent-strong)]">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                        Subtotal
                      </p>
                      <p className="mt-3 text-2xl text-[var(--foreground)]">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-5">
          <Card as="aside" className="sticky top-32 space-y-6 p-6 md:p-7">
            <div className="space-y-2">
              <Badge>Resumen</Badge>
              <h2 className="text-4xl text-[var(--foreground)]">Tu orden</h2>
              <p className="text-sm leading-8 text-[var(--foreground-soft)]">
                Antes de confirmar revisaremos el stock una vez mas para mantener
                la orden alineada con la base real.
              </p>
            </div>

            <div className="grid gap-3">
              <div className="ui-surface-inset flex items-center justify-between rounded-[var(--radius-md)] p-4 text-sm text-[var(--foreground-soft)]">
                <span>Piezas distintas</span>
                <span>{items.length}</span>
              </div>
              <div className="ui-surface-inset flex items-center justify-between rounded-[var(--radius-md)] p-4 text-sm text-[var(--foreground-soft)]">
                <span>Unidades</span>
                <span>{totalUnits}</span>
              </div>
            </div>

            <div className="rounded-[var(--radius-md)] border border-[rgba(209,178,138,0.22)] bg-[rgba(209,178,138,0.08)] p-5">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                Total del encargo
              </p>
              <p className="mt-4 text-5xl text-[var(--accent-strong)]">
                {formatCurrency(subtotal)}
              </p>
            </div>

            <div className="space-y-3 text-sm leading-7 text-[var(--foreground-soft)]">
              <p>Checkout claro y directo, sin pasarela de pago en esta etapa.</p>
              <p>La orden se crea con snapshot de nombre y precio por producto.</p>
            </div>

            <div className="grid gap-3">
              <Button to={routes.checkout}>Ir al checkout</Button>
              <Button to={routes.catalog} variant="secondary">
                Seguir explorando
              </Button>
            </div>
          </Card>

          <Card tone="muted" className="p-6">
            <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
              Nota de taller
            </p>
            <p className="mt-4 text-sm leading-8 text-[var(--foreground-soft)]">
              La seleccion del carrito se comporta como una reserva de intencion,
              no como una venta cerrada. Por eso el stock se vuelve a validar justo
              antes de confirmar la orden.
            </p>
          </Card>
        </div>
      </section>
    </div>
  )
}
