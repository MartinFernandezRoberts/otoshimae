import type { ReactNode } from 'react'

import { Card } from '@/components/ui/Card'

type EmptyStateProps = {
  title: string
  description: string
  action?: ReactNode
  icon?: ReactNode
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  return (
    <Card
      className="flex flex-col items-start gap-5 p-8 md:p-10"
      role="status"
      aria-live="polite"
    >
      <div
        className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(209,178,138,0.24)] bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[0_18px_40px_rgba(209,178,138,0.12)]"
        aria-hidden="true"
      >
        {icon ?? <span className="text-lg">O</span>}
      </div>
      <div className="space-y-2">
        <h2 className="text-4xl text-[var(--foreground)]">{title}</h2>
        <p className="max-w-2xl text-sm leading-8 text-[var(--foreground-soft)]">
          {description}
        </p>
      </div>
      {action ? <div>{action}</div> : null}
    </Card>
  )
}
