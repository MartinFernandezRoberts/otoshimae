import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  hint?: string
  error?: string
  icon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, hint, icon, id, label, ...props },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const hintId = hint ? `${inputId}-hint` : undefined
  const errorId = error ? `${inputId}-error` : undefined

  return (
    <label className="block space-y-2">
      {label ? (
        <span className="ui-field-label">{label}</span>
      ) : null}
      <span
        data-invalid={error ? 'true' : 'false'}
        className={cn(
          'ui-field-shell',
          className,
        )}
      >
        {icon ? <span className="text-[var(--muted)]">{icon}</span> : null}
        <input
          ref={ref}
          id={inputId}
          className="ui-field-control"
          aria-invalid={Boolean(error)}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
          {...props}
        />
      </span>
      {hint ? (
        <span id={hintId} className="ui-field-hint">
          {hint}
        </span>
      ) : null}
      {error ? (
        <span id={errorId} className="ui-field-error">
          {error}
        </span>
      ) : null}
    </label>
  )
})
