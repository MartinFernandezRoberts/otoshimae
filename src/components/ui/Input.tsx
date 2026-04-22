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
        <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--foreground-soft)]">
          {label}
        </span>
      ) : null}
      <span
        className={cn(
          'flex items-center gap-3 rounded-[var(--radius-sm)] border bg-[rgba(255,255,255,0.03)] px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_1px_var(--accent-glow)]',
          error ? 'border-[rgba(212,134,114,0.4)]' : 'border-[var(--line)]',
        )}
      >
        {icon ? <span className="text-[var(--muted)]">{icon}</span> : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]',
            className,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
          {...props}
        />
      </span>
      {hint ? (
        <span id={hintId} className="block text-sm leading-6 text-[var(--muted)]">
          {hint}
        </span>
      ) : null}
      {error ? (
        <span id={errorId} className="block text-sm text-[var(--danger)]">
          {error}
        </span>
      ) : null}
    </label>
  )
})
