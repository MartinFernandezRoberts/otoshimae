import { Badge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'
import { CheckoutOrderForm } from '@/features/orders/CheckoutOrderForm'
import { useSeo } from '@/hooks/useSeo'

export function CheckoutPage() {
  useSeo({
    title: 'Checkout',
    description:
      'Completa tus datos, confirma tu seleccion y registra una orden real desde un cierre coherente con la identidad de Otoshimae.',
  })

  return (
    <div className="space-y-10">
      <section className="ui-section-shell">
        <div className="grid gap-8 p-6 md:p-8 xl:grid-cols-[1.02fr_0.98fr] xl:p-10">
          <div className="space-y-5">
            <Badge variant="accent">Cierre del encargo</Badge>
            <h1 className="max-w-4xl text-5xl text-[var(--foreground)] md:text-7xl">
              Ultimo paso para dejar tu seleccion registrada en el atelier.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[var(--foreground-soft)]">
              Este flujo valida stock, conserva el lenguaje visual del storefront
              y deja que la confirmacion se sienta como una extension natural de
              una marca boutique, no como un formulario generico.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              label="01"
              value="Referencia"
              description="Nombre, correo y contexto para registrar correctamente el encargo."
              valueSize="md"
              accentLabel
            />
            <StatCard
              label="02"
              value="Revision"
              description="Comprobamos stock y valor en tiempo real antes de confirmar."
              valueSize="md"
              accentLabel
            />
            <StatCard
              label="03"
              value="Registro"
              description="La orden queda creada y lista para gestion interna del atelier."
              valueSize="md"
              accentLabel
            />
          </div>
        </div>
      </section>

      <CheckoutOrderForm />
    </div>
  )
}
