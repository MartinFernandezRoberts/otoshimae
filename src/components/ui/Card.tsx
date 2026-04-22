import type { HTMLAttributes, PropsWithChildren } from 'react'

import { cn } from '@/lib/cn'

type CardProps = PropsWithChildren<{
  as?: 'div' | 'article' | 'section' | 'aside' | 'form'
  tone?: 'default' | 'muted' | 'accent' | 'admin'
}> &
  HTMLAttributes<HTMLElement>

const cardTones: Record<NonNullable<CardProps['tone']>, string> = {
  default:
    'border-[var(--line)] bg-[linear-gradient(180deg,rgba(20,18,16,0.94)_0%,rgba(9,8,8,0.98)_100%)] text-[var(--foreground)]',
  muted:
    'border-[rgba(245,240,232,0.07)] bg-[linear-gradient(180deg,rgba(18,16,15,0.8)_0%,rgba(11,10,10,0.9)_100%)] text-[var(--foreground-soft)]',
  accent:
    'border-[rgba(209,178,138,0.22)] bg-[linear-gradient(180deg,rgba(209,178,138,0.16)_0%,rgba(18,14,11,0.96)_40%,rgba(9,8,8,0.99)_100%)] text-[var(--foreground)]',
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
        'shadow-card relative overflow-hidden rounded-[var(--radius-lg)] p-6',
        cardTones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
