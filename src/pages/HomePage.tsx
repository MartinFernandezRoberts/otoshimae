import { useState } from 'react'

import { ProductCard } from '@/components/ProductCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import { Modal } from '@/components/ui/Modal'
import { featuredProducts, mockCategories } from '@/features/catalog/mockProducts'
import { usePageTitle } from '@/hooks/usePageTitle'
import { routes } from '@/lib/routes'

export function HomePage() {
  const [storyOpen, setStoryOpen] = useState(false)

  usePageTitle('Inicio')

  return (
    <>
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card tone="accent" className="overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-8 p-8 md:p-10">
              <Badge variant="accent">Otoshimae / Colección inaugural</Badge>
              <div className="space-y-5">
                <h1 className="max-w-3xl text-5xl leading-none text-[var(--foreground)] md:text-7xl">
                  Máscaras con pulso artesanal y lectura editorial.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-[var(--foreground-soft)] md:text-lg">
                  Una primera capa visual sobria y premium para presentar piezas con
                  foco en materialidad, gesto contemporáneo y presencia de producto.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button to={routes.catalog} size="lg">
                  Explorar catálogo
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setStoryOpen(true)}
                >
                  Ver manifiesto
                </Button>
              </div>
            </div>

            <div className="relative min-h-[320px] overflow-hidden border-t border-[var(--line)] lg:border-t-0 lg:border-l">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_22%,rgba(207,183,154,0.26),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0.22)),linear-gradient(145deg,#14161a_0%,#090a0d_100%)]" />
              <div className="absolute left-8 right-8 top-8 rounded-[var(--radius-lg)] border border-white/10 bg-[rgba(7,8,10,0.4)] p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                  Pieza destacada
                </p>
                <h2 className="mt-3 text-4xl text-[var(--foreground)]">
                  {featuredProducts[0]?.name}
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-7 text-[var(--foreground-soft)]">
                  {featuredProducts[0]?.description}
                </p>
              </div>
              <div className="absolute bottom-8 left-8 right-8 grid gap-4 sm:grid-cols-2">
                <Card tone="muted" className="border-white/10 bg-[rgba(0,0,0,0.24)] p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                    Material
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
                    {featuredProducts[0]?.material}
                  </p>
                </Card>
                <Card tone="muted" className="border-white/10 bg-[rgba(0,0,0,0.24)] p-4">
                  <Loader label="Nuevas piezas en curaduría" />
                </Card>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-16 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <Badge>Destacados</Badge>
            <h2 className="text-4xl text-[var(--foreground)]">
              Productos con foco en presencia
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-[var(--foreground-soft)]">
              Selección inicial para destacar el producto por sobre el ruido
              visual, con una lectura clara de edición, material y disponibilidad.
            </p>
          </div>
          <Button to={routes.catalog} variant="secondary">
            Ver todo el catálogo
          </Button>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {featuredProducts.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mt-16 space-y-6">
        <div className="space-y-2">
          <Badge variant="accent">Categorías</Badge>
          <h2 className="text-4xl text-[var(--foreground)]">
            Familias visuales para ordenar la colección
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {mockCategories.map((category) => (
            <Card
              key={category.id}
              as="article"
              className="overflow-hidden p-0"
            >
              <div
                className="h-32 border-b border-[var(--line)]"
                style={{
                  background: `radial-gradient(circle at 20% 20%, ${category.accent} 0%, rgba(255,255,255,0) 28%), linear-gradient(135deg, #16181d 0%, #0a0b0e 100%)`,
                }}
              />
              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-3xl text-[var(--foreground)]">{category.name}</h3>
                  <Badge>{category.productCount} piezas</Badge>
                </div>
                <p className="text-sm leading-7 text-[var(--foreground-soft)]">
                  {category.description}
                </p>
                <p className="text-sm leading-7 text-[var(--muted)]">{category.note}</p>
                <Button to={routes.catalog} variant="ghost" className="px-0">
                  Ir a catálogo
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Modal
        open={storyOpen}
        onClose={() => setStoryOpen(false)}
        title="Manifiesto de marca"
        description="Una primera narrativa editorial para sostener el tono de Otoshimae en esta etapa."
        footer={
          <Button variant="secondary" onClick={() => setStoryOpen(false)}>
            Cerrar lectura
          </Button>
        }
      >
        <div className="space-y-4 text-sm leading-8 text-[var(--foreground-soft)]">
          <p>
            Otoshimae propone una estética de contraste bajo, silencio visual y
            foco absoluto en la pieza. El producto manda; la interfaz acompaña.
          </p>
          <p>
            La dirección combina códigos editoriales, materialidad oscura y
            acentos cálidos para transmitir oficio, carácter y contemporaneidad
            sin recurrir a excesos.
          </p>
          <p>
            Esta capa visual deja una base lista para seguir creciendo hacia
            fotografía real, fichas de producto completas y un panel operativo
            más robusto.
          </p>
        </div>
      </Modal>
    </>
  )
}
