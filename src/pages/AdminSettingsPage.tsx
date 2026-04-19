import { PagePlaceholder } from '@/components/PagePlaceholder'

const settings = [
  'Configuración de marca y datos de contacto',
  'Políticas de despacho y retiro',
  'Pasarela de pago y ajustes de checkout',
]

export function AdminSettingsPage() {
  return (
    <PagePlaceholder
      eyebrow="Admin"
      title="Configuración"
      description="Zona preparada para concentrar ajustes globales del negocio sin dispersarlos por la app."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {settings.map((item) => (
          <article
            key={item}
            className="rounded-[28px] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-200"
          >
            {item}
          </article>
        ))}
      </div>
    </PagePlaceholder>
  )
}
