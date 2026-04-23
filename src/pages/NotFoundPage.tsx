import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useSeo } from '@/hooks/useSeo'
import { routes } from '@/lib/routes'

export function NotFoundPage() {
  useSeo({
    title: 'Pagina no encontrada',
    description:
      'La ruta solicitada no existe dentro del storefront publico de Otoshimae.',
  })

  return (
    <section className="mx-auto max-w-5xl">
      <Card className="overflow-hidden p-0">
        <div className="grid gap-0 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="space-y-6 p-8 md:p-10">
            <Badge variant="accent">404</Badge>
            <div className="space-y-4">
              <h1 className="text-6xl text-[var(--foreground)] md:text-7xl">
                Esta ruta no pertenece a la coleccion visible de Otoshimae.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[var(--foreground-soft)]">
                El storefront sigue activo, pero este destino no existe o ya no
                esta publicado. Puedes volver al inicio o abrir la coleccion
                para seguir explorando las piezas del atelier.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button to={routes.home}>Volver al inicio</Button>
              <Button to={routes.catalog} variant="secondary">
                Abrir la coleccion
              </Button>
            </div>
          </div>

          <div className="border-t border-[var(--line)] bg-[linear-gradient(145deg,#171310_0%,#070707_100%)] lg:border-l lg:border-t-0">
            <div className="flex h-full flex-col justify-between gap-8 p-8 md:p-10">
              <div className="space-y-4">
                <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                  Sugerencias
                </p>
                <div className="space-y-3">
                  <div className="ui-surface-inset rounded-[var(--radius-md)] p-4 text-sm leading-7 text-[var(--foreground-soft)]">
                    Revisa si el enlace fue escrito correctamente.
                  </div>
                  <div className="ui-surface-inset rounded-[var(--radius-md)] p-4 text-sm leading-7 text-[var(--foreground-soft)]">
                    Vuelve a la portada para navegar desde la seleccion principal.
                  </div>
                  <div className="ui-surface-inset rounded-[var(--radius-md)] p-4 text-sm leading-7 text-[var(--foreground-soft)]">
                    Si la pieza existia antes, puede haber sido retirada de la coleccion.
                  </div>
                </div>
              </div>

              <p className="text-sm leading-7 text-[var(--foreground-soft)]">
                La mejor forma de retomar el recorrido es volver a la portada o
                entrar otra vez a la coleccion activa.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}
