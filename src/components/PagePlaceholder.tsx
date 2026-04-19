import type { PropsWithChildren, ReactNode } from 'react'

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
        <span className="inline-flex rounded-full border border-[var(--line)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          {eyebrow}
        </span>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <h1 className="text-4xl text-[var(--foreground)] md:text-5xl">
              {title}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[var(--foreground-soft)] md:text-lg">
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
