import type { HTMLAttributes, PropsWithChildren } from 'react'

import { cn } from '@/lib/cn'

type CardProps = PropsWithChildren<{
  as?: 'div' | 'article' | 'section' | 'aside' | 'form'
  tone?: 'default' | 'muted' | 'accent' | 'admin'
}> &
  HTMLAttributes<HTMLElement>

const cardTones: Record<NonNullable<CardProps['tone']>, string> = {
  default:
    'border border-[var(--line)] bg-[var(--surface-strong)] text-[var(--foreground)]',
  muted:
    'border border-[var(--line)] bg-[var(--surface)] text-[var(--foreground-soft)]',
  accent:
    'border border-[rgba(207,183,154,0.18)] bg-[linear-gradient(180deg,rgba(207,183,154,0.14),rgba(255,255,255,0.02))] text-[var(--foreground)]',
  admin:
    'border border-white/10 bg-white/5 text-white',
}

export function Card({
  as = 'div',
  tone = 'default',
  className,
  children,
  ...props
}: CardProps) {
  const Component = as

  return (
    <Component
      className={cn(
        'shadow-card rounded-[var(--radius-lg)] p-6',
        cardTones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
