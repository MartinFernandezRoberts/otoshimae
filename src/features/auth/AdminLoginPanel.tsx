import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

export function AdminLoginPanel() {
  return (
    <div className="grid gap-8 rounded-[var(--radius-xl)] border border-[var(--line)] bg-[var(--surface-strong)] p-8 shadow-[var(--shadow-card)] lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        <span className="inline-flex rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
          Acceso seguro
        </span>
        <h1 className="text-4xl text-[var(--foreground)]">
          Panel administrativo de Otoshimae
        </h1>
        <p className="max-w-xl text-base leading-7 text-[var(--foreground-soft)]">
          Este login es un placeholder del MVP. La estructura ya está lista para
          conectar autenticación real más adelante sin rearmar rutas ni layouts.
        </p>
      </div>

      <Card as="form" className="space-y-4 p-6">
        <Input
          label="Correo"
          type="email"
          placeholder="admin@otoshimae.cl"
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="********"
        />

        <Button
          type="button"
          className="w-full"
        >
          Ingresar al panel
        </Button>
      </Card>
    </div>
  )
}
