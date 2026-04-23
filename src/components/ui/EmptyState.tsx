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
      className="flex flex-col items-start gap-6 p-7 md:p-10"
      role="status"
      aria-live="polite"
    >
      <div
        className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(209,178,138,0.3)] bg-[linear-gradient(135deg,rgba(213,176,139,0.2),rgba(255,255,255,0.035))] text-[var(--accent-strong)] shadow-[0_20px_46px_rgba(209,178,138,0.16)]"
        aria-hidden="true"
      >
        {icon ?? <span className="text-xl font-semibold tracking-[0.18em]">O</span>}
      </div>
      <div className="space-y-3">
        <h2 className="text-4xl text-[var(--foreground)] md:text-5xl">{title}</h2>
        <p className="max-w-2xl text-base leading-8 text-[var(--foreground-soft)]">
          {description}
        </p>
      </div>
      {action ? <div>{action}</div> : null}
    </Card>
  )
}
