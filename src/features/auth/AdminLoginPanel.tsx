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

function isSafeAdminRedirect(path: string | undefined) {
  return Boolean(path && path.startsWith('/admin'))
}

export function AdminLoginPanel() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string
    password?: string
  }>({})

  const locationState = location.state as LocationState | null

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setFieldErrors({})

    const nextFieldErrors: { email?: string; password?: string } = {}
    const normalizedEmail = email.trim().toLowerCase()

    if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
      nextFieldErrors.email = 'Ingresa un correo valido.'
    }

    if (password.trim().length < 6) {
      nextFieldErrors.password = 'La contrasena debe tener al menos 6 caracteres.'
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors)
      setError('Revisa los campos marcados antes de continuar.')
      return
    }

    try {
      setSubmitting(true)
      const result = await signIn(normalizedEmail, password)

      if (result.error) {
        setError(result.error)
        return
      }

      navigate(
        isSafeAdminRedirect(locationState?.from) ? locationState!.from! : routes.admin,
        { replace: true },
      )
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
          El area admin exige autenticacion real con Supabase y valida que el
          usuario exista en la tabla <code>admin_users</code>.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <Card className="space-y-4 p-6">
          <Input
            label="Correo"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@otoshimae.cl"
            autoComplete="email"
            error={fieldErrors.email}
          />

          <Input
            label="Contrasena"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="********"
            autoComplete="current-password"
            error={fieldErrors.password}
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
