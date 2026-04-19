const adminMetrics = [
  {
    label: 'Productos visibles',
    value: '12',
    detail: 'Catálogo listo para el primer lote de máscaras.',
  },
  {
    label: 'Pedidos pendientes',
    value: '04',
    detail: 'Espacio reservado para el dashboard operativo.',
  },
  {
    label: 'Categorías activas',
    value: '03',
    detail: 'Accesorios, edición limitada y colección base.',
  },
]

export function AdminMetrics() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {adminMetrics.map((metric) => (
        <article
          key={metric.label}
          className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_24px_70px_rgba(5,15,25,0.18)] backdrop-blur"
        >
          <p className="text-sm text-slate-300">{metric.label}</p>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white">
            {metric.value}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-300/80">
            {metric.detail}
          </p>
        </article>
      ))}
    </div>
  )
}
