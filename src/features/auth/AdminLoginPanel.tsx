import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { StatusMessage } from '@/components/ui/StatusMessage'
import { useAuth } from '@/features/auth/useAuth'
import { routes } from '@/lib/routes'

type LocationState = {
  from?: string
}

export function AdminLoginPanel() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const locationState = location.state as LocationState | null

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!email.trim() || !password.trim()) {
      setError('Completa correo y contraseña.')
      return
    }

    try {
      setSubmitting(true)
      const result = await signIn(email.trim(), password)

      if (result.error) {
        setError(result.error)
        return
      }

      navigate(locationState?.from ?? routes.admin, { replace: true })
    } finally {
      setSubmitting(false)
    }
  }

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
          El área admin ahora exige autenticación real con Supabase y valida que el
          usuario exista en la tabla <code>admin_users</code>.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="space-y-4 p-6">
          <Input
            label="Correo"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@otoshimae.cl"
          />

          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="********"
          />

          {error ? <StatusMessage tone="error" message={error} /> : null}

          <Button type="submit" className="w-full" loading={submitting}>
            Ingresar al panel
          </Button>
        </Card>
      </form>
    </div>
  )
}
