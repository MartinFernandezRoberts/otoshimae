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
        <select
          ref={ref}
          id={selectId}
          className="ui-field-control appearance-none"
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
        <span aria-hidden="true" className="text-[var(--muted)]">
          v
        </span>
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
