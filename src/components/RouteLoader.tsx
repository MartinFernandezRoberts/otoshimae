import { Card } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'

export function RouteLoader() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
      <Card className="p-8">
        <Loader label="Cargando vista..." />
      </Card>
    </section>
  )
}
