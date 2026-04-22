import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Loader } from '@/components/ui/Loader'
import { StatusMessage } from '@/components/ui/StatusMessage'
import { Textarea } from '@/components/ui/Textarea'
import { listPublicProductsByIds } from '@/features/catalog/catalog.api'
import { useCart } from '@/features/cart/useCart'
import { createOrder } from '@/features/orders/orders.api'
import { formatCurrency } from '@/lib/formatCurrency'
import { routes } from '@/lib/routes'

type CheckoutFormValues = {
  customerName: string
  customerEmail: string
  customerPhone: string
  notes: string
}

function validateForm(values: CheckoutFormValues) {
  const nextErrors: Partial<Record<keyof CheckoutFormValues, string>> = {}
  const emailPattern = /\S+@\S+\.\S+/
  const digitsOnlyPhone = values.customerPhone.replace(/\D/g, '')

  if (values.customerName.trim().length < 3) {
    nextErrors.customerName = 'Ingresa un nombre valido.'
  }

  if (!emailPattern.test(values.customerEmail.trim())) {
    nextErrors.customerEmail = 'Ingresa un correo valido.'
  }

  if (values.customerPhone.trim() && digitsOnlyPhone.length < 8) {
    nextErrors.customerPhone = 'Ingresa un telefono valido o dejalo vacio.'
  }

  return nextErrors
}

export function CheckoutOrderForm() {
  const navigate = useNavigate()
  const { items, subtotal, clearCart, reconcileWithProducts } = useCart()
  const [values, setValues] = useState<CheckoutFormValues>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    notes: '',
  })
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof CheckoutFormValues, string>>
  >({})
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  const itemIds = useMemo(() => items.map((item) => item.productId), [items])
  const itemIdsKey = useMemo(() => itemIds.slice().sort().join(','), [itemIds])
  const idsForSync = useMemo(
    () => (itemIdsKey ? itemIdsKey.split(',') : []),
    [itemIdsKey],
  )
  const totalUnits = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  )

  useEffect(() => {
    if (!itemIdsKey) {
      return
    }

    let cancelled = false

    const syncCheckoutItems = async () => {
      try {
        setLoadingProducts(true)
        setLoadError(null)

        const products = await listPublicProductsByIds(idsForSync)

        if (!cancelled) {
          reconcileWithProducts(products)
        }
      } catch (nextError) {
        if (!cancelled) {
          setLoadError(
            nextError instanceof Error
              ? nextError.message
              : 'No fue posible validar el stock para el checkout.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoadingProducts(false)
        }
      }
    }

    void syncCheckoutItems()

    return () => {
      cancelled = true
    }
  }, [idsForSync, itemIdsKey, reconcileWithProducts, reloadKey])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)

    const nextFieldErrors = validateForm(values)
    setFieldErrors(nextFieldErrors)

    if (Object.keys(nextFieldErrors).length > 0) {
      return
    }

    if (items.length === 0) {
      setSubmitError('Tu carrito esta vacio.')
      return
    }

    try {
      setSubmitting(true)

      const refreshedProducts = await listPublicProductsByIds(itemIds)
      const productsById = new Map(
        refreshedProducts.map((product) => [product.id, product]),
      )

      reconcileWithProducts(refreshedProducts)

      const unavailableItem = items.find(
        (item) => !productsById.has(item.productId),
      )

      if (unavailableItem) {
        setSubmitError(
          'Actualizamos tu carrito porque una de las piezas ya no esta disponible.',
        )
        return
      }

      const stockConflict = items.find((item) => {
        const product = productsById.get(item.productId)
        return (product?.stock ?? 0) < item.quantity
      })

      if (stockConflict) {
        setSubmitError(
          `Actualizamos tu carrito porque ${stockConflict.name} ya no tiene ese stock.`,
        )
        return
      }

      const result = await createOrder({
        customerName: values.customerName.trim(),
        customerEmail: values.customerEmail.trim(),
        customerPhone: values.customerPhone.trim(),
        notes: values.notes.trim(),
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      })

      clearCart()

      navigate(`${routes.checkoutSuccess}?orden=${encodeURIComponent(result.order_number)}`, {
        replace: true,
        state: {
          orderNumber: result.order_number,
          total: result.total,
        },
      })
    } catch (nextError) {
      setSubmitError(
        nextError instanceof Error
          ? nextError.message
          : 'No fue posible crear la orden.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="No hay piezas para confirmar"
        description="Agrega productos al carrito antes de iniciar el checkout."
        action={<Button to={routes.catalog}>Explorar catalogo</Button>}
      />
    )
  }

  if (loadingProducts) {
    return (
      <Card className="p-8">
        <Loader label="Validando stock y precios..." />
      </Card>
    )
  }

  if (loadError) {
    return (
      <EmptyState
        title="No se pudo preparar el checkout"
        description={loadError}
        action={
          <Button variant="secondary" onClick={() => setReloadKey((value) => value + 1)}>
            Reintentar
          </Button>
        }
      />
    )
  }

  return (
    <form
      className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr]"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="space-y-6">
        <Card className="space-y-6 p-6 md:p-7">
          <div className="space-y-2">
            <Badge variant="accent">Datos de contacto</Badge>
            <h2 className="text-4xl text-[var(--foreground)]">Tu informacion</h2>
            <p className="text-sm leading-8 text-[var(--foreground-soft)]">
              Usaremos estos datos para registrar la orden y continuar la
              coordinacion del encargo desde el panel administrativo.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Nombre"
              value={values.customerName}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  customerName: event.target.value,
                }))
              }
              error={fieldErrors.customerName}
              placeholder="Nombre y apellido"
              hint="Este nombre quedara asociado a la orden."
            />
            <Input
              label="Correo"
              type="email"
              value={values.customerEmail}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  customerEmail: event.target.value,
                }))
              }
              error={fieldErrors.customerEmail}
              placeholder="cliente@email.com"
              hint="Usaremos este correo como referencia principal."
            />
            <Input
              label="Telefono"
              value={values.customerPhone}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  customerPhone: event.target.value,
                }))
              }
              placeholder="+56 9 1234 5678"
              autoComplete="tel"
              error={fieldErrors.customerPhone}
              hint="Opcional, pero util para coordinar el encargo."
            />
          </div>
        </Card>

        <Card tone="muted" className="space-y-5 p-6 md:p-7">
          <div className="space-y-2">
            <Badge>Notas del encargo</Badge>
            <h2 className="text-4xl text-[var(--foreground)]">Contexto adicional</h2>
            <p className="text-sm leading-8 text-[var(--foreground-soft)]">
              Si necesitas dejar una referencia de entrega, timing o detalle del
              pedido, este es el lugar.
            </p>
          </div>

          <Textarea
            label="Notas"
            value={values.notes}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                notes: event.target.value,
              }))
            }
            placeholder="Instrucciones para la entrega o contexto adicional."
            hint="Opcional. Se guardara junto con la orden."
          />

          {submitError ? <StatusMessage tone="error" message={submitError} /> : null}
        </Card>
      </div>

      <Card as="aside" className="sticky top-32 space-y-6 p-6 md:p-7">
        <div className="space-y-2">
          <Badge variant="accent">Resumen</Badge>
          <h2 className="text-4xl text-[var(--foreground)]">Tu orden final</h2>
          <p className="text-sm leading-8 text-[var(--foreground-soft)]">
            La orden guardara un snapshot del nombre y precio de cada producto al
            momento de confirmar.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[rgba(255,255,255,0.03)] p-4 text-sm text-[var(--foreground-soft)]">
            <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
              Piezas
            </p>
            <p className="mt-3 text-2xl text-[var(--foreground)]">{items.length}</p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[rgba(255,255,255,0.03)] p-4 text-sm text-[var(--foreground-soft)]">
            <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
              Unidades
            </p>
            <p className="mt-3 text-2xl text-[var(--foreground)]">{totalUnits}</p>
          </div>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.productId}
              className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[rgba(255,255,255,0.03)] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-[var(--foreground)]">{item.name}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {item.quantity} x {formatCurrency(item.price)}
                  </p>
                </div>
                <p className="text-sm text-[var(--foreground)]">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[var(--radius-md)] border border-[rgba(209,178,138,0.22)] bg-[rgba(209,178,138,0.08)] p-5">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
            Total
          </p>
          <p className="mt-4 text-5xl text-[var(--accent-strong)]">
            {formatCurrency(subtotal)}
          </p>
        </div>

        <div className="space-y-3 text-sm leading-7 text-[var(--foreground-soft)]">
          <p>Volveremos a revisar stock justo antes de cerrar la orden.</p>
          <p>En esta etapa no se procesa pago; solo se registra el pedido.</p>
        </div>

        <Button type="submit" className="w-full" loading={submitting}>
          Confirmar orden
        </Button>
      </Card>
    </form>
  )
}
