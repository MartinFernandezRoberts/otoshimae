import { Card } from '@/components/ui/Card'

const cartItems = [
  { name: 'Kitsune Ember', quantity: 1, price: '$64.990' },
  { name: 'Koi Eclipse', quantity: 2, price: '$49.990' },
]

export function CartSummaryPlaceholder() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card className="space-y-4 p-6">
        <h2 className="text-2xl text-[var(--foreground)]">Resumen del carrito</h2>
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--background-soft)] px-4 py-4"
            >
              <div>
                <p className="font-medium text-[var(--foreground)]">{item.name}</p>
                <p className="text-sm text-[var(--muted)]">
                  Cantidad: {item.quantity}
                </p>
              </div>
              <span className="text-sm font-semibold text-[var(--accent)]">
                {item.price}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card
        as="aside"
        tone="accent"
        className="p-6 text-[var(--foreground)]"
      >
        <p className="text-sm uppercase tracking-[0.24em] text-[var(--accent)]">
          MVP checkout
        </p>
        <p className="mt-4 text-3xl">Total estimado</p>
        <p className="mt-3 text-4xl text-[var(--accent)]">$164.970</p>
        <p className="mt-4 text-sm leading-7 text-[var(--foreground-soft)]">
          Aquí más adelante podemos integrar stock, promociones, despacho y medio
          de pago.
        </p>
      </Card>
    </div>
  )
}
