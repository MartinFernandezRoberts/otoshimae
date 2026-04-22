import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { LinkProps } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { cn } from '@/lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive'
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
    'ui-button',
    variant === 'primary' && 'ui-button-primary',
    variant === 'secondary' && 'ui-button-secondary',
    variant === 'ghost' && 'ui-button-ghost',
    variant === 'destructive' && 'ui-button-destructive',
    size === 'sm' && 'ui-button-sm',
    size === 'md' && 'ui-button-md',
    size === 'lg' && 'ui-button-lg',
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
