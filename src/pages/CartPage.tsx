import { useEffect, useMemo, useState } from 'react'

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
      'Revisa tu carrito Otoshimae, ajusta cantidades segun stock real y continua al checkout.',
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
        description="Agrega piezas desde el catalogo para preparar tu orden."
        action={<Button to={routes.catalog}>Explorar catalogo</Button>}
      />
    )
  }

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-5xl text-[var(--foreground)] md:text-6xl">Carrito</h1>
        <p className="max-w-3xl text-base leading-8 text-[var(--foreground-soft)]">
          Revisa las piezas seleccionadas, ajusta cantidades y continua con un
          checkout simple conectado a Supabase.
        </p>
      </div>

      {loading ? <Loader label="Sincronizando stock real..." /> : null}
      {error ? <StatusMessage tone="error" message={error} /> : null}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.productId} className="flex flex-col gap-5 p-5 md:flex-row">
              <div className="h-32 w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)] bg-[linear-gradient(145deg,#15171b_0%,#08090b_100%)] md:w-32">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.imageAlt ?? item.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-2xl text-[var(--foreground)]">{item.name}</h2>
                    <p className="mt-2 text-sm text-[var(--foreground-soft)]">
                      Stock disponible: {item.stock}
                    </p>
                    <p className="mt-1 text-lg text-[var(--accent)]">
                      {formatCurrency(item.price)}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    className="justify-start px-0 md:justify-center"
                    onClick={() => removeItem(item.productId)}
                  >
                    Quitar
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    aria-label={`Disminuir cantidad de ${item.name}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] text-[var(--foreground)] transition hover:border-[var(--accent)]"
                    onClick={() =>
                      updateQuantity(item.productId, Math.max(1, item.quantity - 1))
                    }
                  >
                    -
                  </button>
                  <div className="min-w-24 rounded-full border border-[var(--line)] px-4 py-2 text-center text-sm text-[var(--foreground)]">
                    {item.quantity} unidad{item.quantity > 1 ? 'es' : ''}
                  </div>
                  <button
                    type="button"
                    aria-label={`Aumentar cantidad de ${item.name}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] text-[var(--foreground)] transition hover:border-[var(--accent)]"
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
                  <span className="text-sm text-[var(--muted)]">
                    Subtotal: {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card as="aside" className="space-y-5 p-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
              Resumen
            </p>
            <h2 className="text-3xl text-[var(--foreground)]">Tu orden</h2>
          </div>

          <div className="space-y-3 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] p-4">
            <div className="flex items-center justify-between text-sm text-[var(--foreground-soft)]">
              <span>Piezas</span>
              <span>{items.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-[var(--foreground-soft)]">
              <span>Unidades</span>
              <span>{totalUnits}</span>
            </div>
            <div className="flex items-center justify-between text-lg text-[var(--foreground)]">
              <span>Total</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          </div>

          <p className="text-sm leading-7 text-[var(--foreground-soft)]">
            Validaremos nuevamente el stock al crear la orden para mantener el
            carrito alineado con la base de datos.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button to={routes.checkout} className="flex-1">
              Ir al checkout
            </Button>
            <Button to={routes.catalog} variant="secondary" className="flex-1">
              Seguir explorando
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
