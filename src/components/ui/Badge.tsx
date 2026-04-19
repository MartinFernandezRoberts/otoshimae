import type { HTMLAttributes, PropsWithChildren } from 'react'

import { cn } from '@/lib/cn'

type BadgeProps = PropsWithChildren<{
  variant?: 'default' | 'accent' | 'success' | 'danger' | 'outline'
}> &
  HTMLAttributes<HTMLSpanElement>

const badgeVariants: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'border border-[var(--line)] bg-[var(--surface)] text-[var(--foreground-soft)]',
  accent: 'border border-[rgba(207,183,154,0.22)] bg-[var(--accent-soft)] text-[var(--accent)]',
  success: 'border border-[rgba(127,178,151,0.22)] bg-[rgba(127,178,151,0.12)] text-[var(--success)]',
  danger: 'border border-[rgba(212,134,114,0.22)] bg-[rgba(212,134,114,0.12)] text-[var(--danger)]',
  outline: 'border border-[var(--line-strong)] bg-transparent text-[var(--foreground)]',
}

export function Badge({
  variant = 'default',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em]',
        badgeVariants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
