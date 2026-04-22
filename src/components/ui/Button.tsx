import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { LinkProps } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { cn } from '@/lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

type SharedButtonProps = {
  children: ReactNode
  className?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  loading?: boolean
  variant?: ButtonVariant
  size?: ButtonSize
}

type ButtonAsButtonProps = SharedButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: never
  }

type ButtonAsLinkProps = SharedButtonProps &
  Omit<LinkProps, 'className'> & {
    to: string
  }

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps

function getButtonStyles({
  variant = 'primary',
  size = 'md',
  className,
}: Pick<SharedButtonProps, 'variant' | 'size' | 'className'>) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-full border font-semibold tracking-[0.02em] transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-55',
    variant === 'primary' &&
      'border-[rgba(240,220,194,0.24)] bg-[linear-gradient(135deg,var(--foreground)_0%,var(--accent-strong)_100%)] text-[var(--background)] shadow-[0_18px_40px_rgba(240,220,194,0.14)] hover:brightness-[1.03]',
    variant === 'secondary' &&
      'border-[var(--line-strong)] bg-[rgba(255,255,255,0.02)] text-[var(--foreground)] hover:border-[rgba(209,178,138,0.42)] hover:bg-[rgba(209,178,138,0.08)] hover:text-[var(--accent-strong)]',
    variant === 'ghost' &&
      'border-transparent bg-transparent text-[var(--foreground-soft)] hover:border-[var(--line)] hover:bg-[rgba(255,255,255,0.03)] hover:text-[var(--foreground)]',
    size === 'sm' && 'px-4 py-2.5 text-[13px]',
    size === 'md' && 'px-5 py-3.5 text-[14px]',
    size === 'lg' && 'px-6 py-4 text-[15px]',
    className,
  )
}

export function Button(props: ButtonProps) {
  const {
    children,
    className,
    leftIcon,
    rightIcon,
    loading = false,
    size = 'md',
    variant = 'primary',
  } = props

  const content = (
    <>
      {leftIcon ? <span className="text-current/80">{leftIcon}</span> : null}
      <span>{loading ? 'Cargando...' : children}</span>
      {rightIcon ? <span className="text-current/80">{rightIcon}</span> : null}
    </>
  )

  if ('to' in props && props.to) {
    const linkProps = props as ButtonAsLinkProps

    return (
      <Link
        to={linkProps.to}
        replace={linkProps.replace}
        state={linkProps.state}
        preventScrollReset={linkProps.preventScrollReset}
        relative={linkProps.relative}
        reloadDocument={linkProps.reloadDocument}
        className={getButtonStyles({ variant, size, className })}
      >
        {content}
      </Link>
    )
  }

  const buttonProps = props as ButtonAsButtonProps

  return (
    <button
      type={buttonProps.type ?? 'button'}
      className={getButtonStyles({ variant, size, className })}
      disabled={loading || buttonProps.disabled}
      aria-busy={loading || undefined}
      onClick={buttonProps.onClick}
      onBlur={buttonProps.onBlur}
      onFocus={buttonProps.onFocus}
      onMouseEnter={buttonProps.onMouseEnter}
      onMouseLeave={buttonProps.onMouseLeave}
      name={buttonProps.name}
      value={buttonProps.value}
      form={buttonProps.form}
      aria-label={buttonProps['aria-label']}
      title={buttonProps.title}
    >
      {content}
    </button>
  )
}
