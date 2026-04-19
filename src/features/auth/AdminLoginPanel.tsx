export function AdminLoginPanel() {
  return (
    <div className="grid gap-8 rounded-[32px] border border-[var(--line)] bg-[var(--surface-strong)] p-8 shadow-[0_24px_80px_rgba(65,39,22,0.12)] lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <span className="inline-flex rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-deep)]">
          Acceso seguro
        </span>
        <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
          Panel administrativo de Otoshimae
        </h1>
        <p className="max-w-xl text-base leading-7 text-[var(--muted)]">
          Este login es un placeholder del MVP. La estructura ya está lista para
          conectar autenticación real más adelante sin rearmar rutas ni layouts.
        </p>
      </div>

      <form className="space-y-4 rounded-[28px] border border-[var(--line)] bg-white p-6">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-[var(--foreground)]">
            Correo
          </span>
          <input
            type="email"
            placeholder="admin@otoshimae.cl"
            className="w-full rounded-2xl border border-[var(--line)] bg-[var(--background-strong)] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-[var(--foreground)]">
            Contraseña
          </span>
          <input
            type="password"
            placeholder="********"
            className="w-full rounded-2xl border border-[var(--line)] bg-[var(--background-strong)] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
          />
        </label>

        <button
          type="button"
          className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-deep)]"
        >
          Ingresar al panel
        </button>
      </form>
    </div>
  )
}
