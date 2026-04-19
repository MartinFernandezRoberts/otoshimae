const orderRows = [
  ['OT-001', 'Pago confirmado', 'Preparación'],
  ['OT-002', 'Pendiente', 'Esperando transferencia'],
  ['OT-003', 'Despachado', 'En ruta'],
]

export function OrdersOverviewPlaceholder() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] shadow-[0_24px_70px_rgba(65,39,22,0.09)]">
      <div className="grid grid-cols-3 border-b border-[var(--line)] bg-[var(--background-strong)] px-6 py-4 text-sm font-semibold text-[var(--muted)]">
        <span>Pedido</span>
        <span>Estado</span>
        <span>Detalle</span>
      </div>
      <div className="divide-y divide-[var(--line)]">
        {orderRows.map(([code, status, detail]) => (
          <div
            key={code}
            className="grid grid-cols-3 px-6 py-4 text-sm text-[var(--foreground)]"
          >
            <span className="font-medium">{code}</span>
            <span>{status}</span>
            <span className="text-[var(--muted)]">{detail}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
