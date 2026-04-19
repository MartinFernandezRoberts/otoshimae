import { PagePlaceholder } from '@/components/PagePlaceholder'
import { CartSummaryPlaceholder } from '@/features/cart/CartSummaryPlaceholder'

export function CartPage() {
  return (
    <PagePlaceholder
      eyebrow="Compra"
      title="Carrito"
      description="Ruta placeholder para revisar los productos seleccionados, cantidades y el total preliminar del pedido."
    >
      <CartSummaryPlaceholder />
    </PagePlaceholder>
  )
}
