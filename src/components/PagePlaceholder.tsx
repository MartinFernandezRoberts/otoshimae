import type { PropsWithChildren, ReactNode } from 'react'

import { Badge } from '@/components/ui/Badge'
import { usePageTitle } from '@/hooks/usePageTitle'

type PagePlaceholderProps = PropsWithChildren<{
  eyebrow: string
  title: string
  description: string
  actions?: ReactNode
}>

export function PagePlaceholder({
  eyebrow,
  title,
  description,
  actions,
  children,
}: PagePlaceholderProps) {
  usePageTitle(title)

  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <Badge variant="accent">{eyebrow}</Badge>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <h1 className="text-display-sm text-[var(--foreground)] md:text-display-md">
              {title}
            </h1>
            <p className="max-w-2xl text-body text-[var(--foreground-soft)]">
              {description}
            </p>
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      </div>
      {children}
    </section>
  )
}
