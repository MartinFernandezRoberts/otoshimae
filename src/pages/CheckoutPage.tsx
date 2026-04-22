import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { CheckoutOrderForm } from '@/features/orders/CheckoutOrderForm'
import { useSeo } from '@/hooks/useSeo'

export function CheckoutPage() {
  useSeo({
    title: 'Checkout',
    description:
      'Completa tus datos, confirma las piezas del carrito y crea una orden real en Supabase desde un checkout premium y claro.',
  })

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--line)] bg-[rgba(8,8,8,0.74)] shadow-[var(--shadow-card)]">
        <div className="grid gap-8 p-6 md:p-8 xl:grid-cols-[1.02fr_0.98fr] xl:p-10">
          <div className="space-y-5">
            <Badge variant="accent">Checkout</Badge>
            <h1 className="max-w-4xl text-6xl text-[var(--foreground)] md:text-7xl">
              Cierre limpio, datos claros y orden conectada a la base real.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[var(--foreground-soft)]">
              Este flujo valida stock, conserva el lenguaje visual del storefront y
              deja que la confirmacion se sienta parte natural de una compra premium.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card tone="muted" className="p-5">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--accent-strong)]">
                01
              </p>
              <p className="mt-3 text-2xl text-[var(--foreground)]">Datos</p>
              <p className="mt-3 text-sm leading-7 text-[var(--foreground-soft)]">
                Nombre, correo y contexto para registrar correctamente el encargo.
              </p>
            </Card>
            <Card tone="muted" className="p-5">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--accent-strong)]">
                02
              </p>
              <p className="mt-3 text-2xl text-[var(--foreground)]">Revision</p>
              <p className="mt-3 text-sm leading-7 text-[var(--foreground-soft)]">
                Comprobamos stock y precio en tiempo real antes de confirmar.
              </p>
            </Card>
            <Card tone="muted" className="p-5">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--accent-strong)]">
                03
              </p>
              <p className="mt-3 text-2xl text-[var(--foreground)]">Registro</p>
              <p className="mt-3 text-sm leading-7 text-[var(--foreground-soft)]">
                La orden queda creada en Supabase y lista para gestion interna.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <CheckoutOrderForm />
    </div>
  )
}
