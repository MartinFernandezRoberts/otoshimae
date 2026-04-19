const cartItems = [
  { name: 'Kitsune Ember', quantity: 1, price: '$64.990' },
  { name: 'Koi Eclipse', quantity: 2, price: '$49.990' },
]

export function CartSummaryPlaceholder() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4 rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-[0_20px_60px_rgba(65,39,22,0.08)]">
        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
          Resumen del carrito
        </h2>
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-2xl border border-[var(--line)] bg-white px-4 py-4"
            >
              <div>
                <p className="font-medium text-[var(--foreground)]">{item.name}</p>
                <p className="text-sm text-[var(--muted)]">
                  Cantidad: {item.quantity}
                </p>
              </div>
              <span className="text-sm font-semibold text-[var(--accent-deep)]">
                {item.price}
              </span>
            </div>
          ))}
        </div>
      </div>

      <aside className="rounded-[28px] border border-[var(--line)] bg-[var(--accent-deep)] p-6 text-white shadow-[0_20px_60px_rgba(46,19,9,0.24)]">
        <p className="text-sm uppercase tracking-[0.24em] text-orange-100/80">
          MVP checkout
        </p>
        <p className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
          Total estimado
        </p>
        <p className="mt-3 text-4xl font-semibold">$164.970</p>
        <p className="mt-4 text-sm leading-6 text-orange-100/80">
          Aquí más adelante podemos integrar stock, promociones, despacho y medio
          de pago.
        </p>
      </aside>
    </div>
  )
}
