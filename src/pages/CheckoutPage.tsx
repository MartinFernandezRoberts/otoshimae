import { PagePlaceholder } from '@/components/PagePlaceholder'

const checkoutSteps = [
  'Datos de contacto y entrega',
  'Confirmación de productos y stock',
  'Pago y cierre de compra',
]

export function CheckoutPage() {
  return (
    <PagePlaceholder
      eyebrow="Conversión"
      title="Checkout"
      description="Pantalla base para el flujo de compra. Más adelante aquí podemos integrar validaciones, despacho y pasarela de pago."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {checkoutSteps.map((step, index) => (
          <article
            key={step}
            className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-[0_20px_60px_rgba(65,39,22,0.08)]"
          >
            <p className="text-sm uppercase tracking-[0.24em] text-[var(--accent-deep)]">
              Paso {index + 1}
            </p>
            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
              {step}
            </h2>
          </article>
        ))}
      </div>
    </PagePlaceholder>
  )
}
