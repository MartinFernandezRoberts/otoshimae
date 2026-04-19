import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Loader } from '@/components/ui/Loader'
import { StatusMessage } from '@/components/ui/StatusMessage'
import { Textarea } from '@/components/ui/Textarea'
import { listPublicProducts } from '@/features/catalog/catalog.api'
import { buildCheckoutItems, createOrder } from '@/features/orders/orders.api'
import { formatCurrency } from '@/lib/formatCurrency'
import type { CreateOrderInput, PublicProductSummary } from '@/types/database'

type CheckoutFormValues = {
  customerName: string
  customerEmail: string
  customerPhone: string
  notes: string
  quantities: Record<string, number>
}

function validate(values: CheckoutFormValues, products: PublicProductSummary[]) {
  const nextErrors: Partial<Record<keyof CheckoutFormValues, string>> = {}
  const emailPattern = /\S+@\S+\.\S+/

  if (values.customerName.trim().length < 3) {
    nextErrors.customerName = 'Ingresa un nombre válido.'
  }

  if (!emailPattern.test(values.customerEmail.trim())) {
    nextErrors.customerEmail = 'Ingresa un correo válido.'
  }

  const selectedItems = products.filter(
    (product) => (values.quantities[product.id] ?? 0) > 0,
  )

  if (selectedItems.length === 0) {
    nextErrors.quantities = 'Selecciona al menos un producto para crear la orden.'
  }

  for (const product of selectedItems) {
    const quantity = values.quantities[product.id] ?? 0

    if (quantity > product.stock) {
      nextErrors.quantities = `La cantidad de ${product.name} supera el stock disponible.`
      break
    }
  }

  return nextErrors
}

export function CheckoutOrderForm() {
  const [products, setProducts] = useState<PublicProductSummary[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof CheckoutFormValues, string>>
  >({})
  const [values, setValues] = useState<CheckoutFormValues>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    notes: '',
    quantities: {},
  })

  useEffect(() => {
    let cancelled = false

    const loadProducts = async () => {
      try {
        const nextProducts = await listPublicProducts()

        if (!cancelled) {
          setProducts(nextProducts)
          const defaults = buildCheckoutItems(nextProducts).reduce<
            Record<string, number>
          >((accumulator, item) => {
            accumulator[item.productId] = item.quantity
            return accumulator
          }, {})
          setValues((current) => ({
            ...current,
            quantities: Object.keys(current.quantities).length > 0
              ? current.quantities
              : defaults,
          }))
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error instanceof Error ? error.message : 'No se pudo cargar el catálogo.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoadingProducts(false)
        }
      }
    }

    void loadProducts()

    return () => {
      cancelled = true
    }
  }, [])

  const selectedItems = useMemo(
    () =>
      products
        .filter((product) => (values.quantities[product.id] ?? 0) > 0)
        .map((product) => ({
          productId: product.id,
          quantity: values.quantities[product.id] ?? 0,
          product,
        })),
    [products, values.quantities],
  )

  const total = selectedItems.reduce(
    (accumulator, item) => accumulator + item.product.price * item.quantity,
    0,
  )

  const handleQuantityChange = (productId: string, nextValue: number) => {
    setValues((current) => ({
      ...current,
      quantities: {
        ...current.quantities,
        [productId]: Math.max(0, nextValue),
      },
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)
    setSubmitSuccess(null)

    const nextErrors = validate(values, products)
    setFieldErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const payload: CreateOrderInput = {
      customerName: values.customerName.trim(),
      customerEmail: values.customerEmail.trim(),
      customerPhone: values.customerPhone.trim(),
      notes: values.notes.trim(),
      items: selectedItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    }

    try {
      setSubmitting(true)
      const result = await createOrder(payload)
      setSubmitSuccess(
        `Orden ${result.order_number} creada correctamente por ${formatCurrency(result.total)}.`,
      )
      setValues({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        notes: '',
        quantities: {},
      })
      setFieldErrors({})
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'No se pudo crear la orden.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingProducts) {
    return (
      <Card className="p-8">
        <Loader label="Cargando productos desde Supabase..." />
      </Card>
    )
  }

  if (loadError) {
    return (
      <EmptyState
        title="No se pudo iniciar el checkout"
        description={loadError}
      />
    )
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="No hay productos activos"
        description="Activa al menos un producto en Supabase para probar la creación de órdenes."
      />
    )
  }

  return (
    <form className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]" onSubmit={handleSubmit}>
      <Card className="space-y-5 p-6">
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
        />
        <Input
          label="Teléfono"
          value={values.customerPhone}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              customerPhone: event.target.value,
            }))
          }
          placeholder="+56 9 1234 5678"
        />
        <Textarea
          label="Notas"
          value={values.notes}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              notes: event.target.value,
            }))
          }
          placeholder="Instrucciones para el pedido o contexto adicional."
        />

        {submitError ? <StatusMessage tone="error" message={submitError} /> : null}
        {submitSuccess ? (
          <StatusMessage tone="success" message={submitSuccess} />
        ) : null}
      </Card>

      <Card className="space-y-4 p-6">
        <div className="space-y-2">
          <h2 className="text-3xl text-[var(--foreground)]">Productos</h2>
          <p className="text-sm leading-7 text-[var(--foreground-soft)]">
            Para este MVP, el checkout crea órdenes reales en Supabase a partir de
            productos activos.
          </p>
        </div>

        <div className="space-y-3">
          {products.map((product) => {
            const quantity = values.quantities[product.id] ?? 0

            return (
              <div
                key={product.id}
                className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--background-soft)] p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">{product.name}</p>
                    <p className="text-sm text-[var(--muted)]">
                      {formatCurrency(product.price)} · stock {product.stock}
                    </p>
                  </div>
                  <Input
                    label="Cantidad"
                    type="number"
                    min={0}
                    max={product.stock}
                    value={quantity.toString()}
                    onChange={(event) =>
                      handleQuantityChange(product.id, Number(event.target.value))
                    }
                    className="max-w-24"
                  />
                </div>
              </div>
            )
          })}
        </div>

        {fieldErrors.quantities ? (
          <StatusMessage tone="error" message={fieldErrors.quantities} />
        ) : null}

        <div className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface)] p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
            Total estimado
          </p>
          <p className="mt-3 text-3xl text-[var(--accent)]">
            {formatCurrency(total)}
          </p>
        </div>

        <Button type="submit" className="w-full" loading={submitting}>
          Crear orden
        </Button>
      </Card>
    </form>
  )
}
