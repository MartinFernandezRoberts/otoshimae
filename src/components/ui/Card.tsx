import type { HTMLAttributes, PropsWithChildren } from 'react'

import { cn } from '@/lib/cn'

type CardProps = PropsWithChildren<{
  as?: 'div' | 'article' | 'section' | 'aside' | 'form'
  tone?: 'default' | 'muted' | 'accent' | 'admin'
}> &
  HTMLAttributes<HTMLElement>

const cardTones: Record<NonNullable<CardProps['tone']>, string> = {
  default: 'ui-card',
  muted: 'ui-card ui-card-muted',
  accent: 'ui-card ui-card-accent',
  admin: 'ui-card ui-card-admin',
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
        'p-6',
        cardTones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
