import type { ReactNode } from 'react'

import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'

type StatCardProps = {
  label: ReactNode
  value: ReactNode
  description?: ReactNode
  valueSize?: 'sm' | 'md' | 'lg'
  accentLabel?: boolean
  className?: string
}

const valueSizeClasses: Record<NonNullable<StatCardProps['valueSize']>, string> = {
  sm: 'text-lg leading-7',
  md: 'text-2xl',
  lg: 'text-4xl',
}

export function StatCard({
  label,
  value,
  description,
  valueSize = 'lg',
  accentLabel = false,
  className,
}: StatCardProps) {
  return (
    <Card tone="muted" className={cn('ui-kpi-card p-5', className)}>
      <p
        className={cn(
          'text-[11px] uppercase tracking-[0.32em]',
          accentLabel ? 'text-[var(--accent-strong)]' : 'text-[var(--muted)]',
        )}
      >
        {label}
      </p>
      <p className={cn('mt-3 text-[var(--foreground)]', valueSizeClasses[valueSize])}>
        {value}
      </p>
      {description ? (
        <p className="mt-3 text-sm leading-7 text-[var(--foreground-soft)]">{description}</p>
      ) : null}
    </Card>
  )
}
