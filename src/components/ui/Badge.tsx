import type { HTMLAttributes, PropsWithChildren } from 'react'

import { cn } from '@/lib/cn'

type BadgeProps = PropsWithChildren<{
  variant?: 'default' | 'accent' | 'success' | 'danger' | 'outline'
}> &
  HTMLAttributes<HTMLSpanElement>

const badgeVariants: Record<NonNullable<BadgeProps['variant']>, string> = {
  default:
    'border border-[var(--line)] bg-[rgba(255,255,255,0.03)] text-[var(--foreground-soft)]',
  accent:
    'border border-[rgba(209,178,138,0.24)] bg-[var(--accent-soft)] text-[var(--accent-strong)]',
  success:
    'border border-[rgba(142,180,148,0.22)] bg-[rgba(142,180,148,0.12)] text-[var(--success)]',
  danger:
    'border border-[rgba(219,143,120,0.22)] bg-[rgba(219,143,120,0.12)] text-[var(--danger)]',
  outline:
    'border border-[var(--line-strong)] bg-transparent text-[var(--foreground)]',
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
        'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em]',
        badgeVariants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
