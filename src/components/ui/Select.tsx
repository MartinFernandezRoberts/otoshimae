import { forwardRef, useId } from 'react'
import type { ReactNode, SelectHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

type SelectOption = {
  value: string
  label: string
}

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> & {
  label?: string
  hint?: string
  error?: string
  options: SelectOption[]
  icon?: ReactNode
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, error, hint, icon, id, label, options, ...props },
  ref,
) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const hintId = hint ? `${selectId}-hint` : undefined
  const errorId = error ? `${selectId}-error` : undefined

  return (
    <label className="block space-y-2">
      {label ? (
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--foreground-soft)]">
          {label}
        </span>
      ) : null}
      <span
        className={cn(
          'flex items-center gap-3 rounded-[var(--radius-sm)] border bg-[var(--background-soft)] px-4 py-3 focus-within:border-[var(--accent)]',
          error ? 'border-[rgba(212,134,114,0.4)]' : 'border-[var(--line)]',
        )}
      >
        {icon ? <span className="text-[var(--muted)]">{icon}</span> : null}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full appearance-none bg-transparent text-sm text-[var(--foreground)] outline-none',
            className,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </span>
      {hint ? (
        <span id={hintId} className="block text-sm text-[var(--muted)]">
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
