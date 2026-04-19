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
    <Card className="flex flex-col items-start gap-4 p-8">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--accent-soft)] text-[var(--accent)]">
        {icon ?? <span className="text-lg">O</span>}
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl text-[var(--foreground)]">{title}</h2>
        <p className="max-w-xl text-sm leading-7 text-[var(--foreground-soft)]">
          {description}
        </p>
      </div>
      {action ? <div>{action}</div> : null}
    </Card>
  )
}
