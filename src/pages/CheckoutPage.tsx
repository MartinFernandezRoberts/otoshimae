import { Badge } from '@/components/ui/Badge'
import { CheckoutOrderForm } from '@/features/orders/CheckoutOrderForm'
import { useSeo } from '@/hooks/useSeo'

export function CheckoutPage() {
  useSeo({
    title: 'Checkout',
    description:
      'Completa tus datos, confirma las piezas del carrito y crea una orden real en Supabase.',
  })

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <Badge variant="accent">Checkout</Badge>
        <h1 className="text-5xl text-[var(--foreground)] md:text-6xl">
          Cierre simple, claro y conectado a la base real.
        </h1>
        <p className="max-w-3xl text-base leading-8 text-[var(--foreground-soft)]">
          Esta pantalla usa el carrito persistente, revisa stock en tiempo real y
          crea la orden en Supabase sin integrar pagos en esta etapa.
        </p>
      </div>

      <CheckoutOrderForm />
    </section>
  )
}
