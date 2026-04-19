import { PagePlaceholder } from '@/components/PagePlaceholder'
import { Card } from '@/components/ui/Card'

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
          <Card
            key={item}
            as="article"
            tone="admin"
            className="p-5 text-sm leading-7 text-slate-200"
          >
            {item}
          </Card>
        ))}
      </div>
    </PagePlaceholder>
  )
}
