import type { HTMLAttributes, PropsWithChildren } from 'react'

import { cn } from '@/lib/cn'

type BadgeProps = PropsWithChildren<{
  variant?: 'default' | 'accent' | 'success' | 'danger' | 'destructive' | 'outline'
}> &
  HTMLAttributes<HTMLSpanElement>

const badgeVariants: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'ui-badge',
  accent: 'ui-badge ui-badge-accent',
  success: 'ui-badge ui-badge-success',
  danger: 'ui-badge ui-badge-destructive',
  destructive: 'ui-badge ui-badge-destructive',
  outline: 'ui-badge ui-badge-outline',
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
        'inline-flex',
        badgeVariants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
