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
  options: SelectOption[]
  icon?: ReactNode
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, hint, icon, id, label, options, ...props },
  ref,
) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <label className="block space-y-2">
      {label ? (
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--foreground-soft)]">
          {label}
        </span>
      ) : null}
      <span className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--background-soft)] px-4 py-3 focus-within:border-[var(--accent)]">
        {icon ? <span className="text-[var(--muted)]">{icon}</span> : null}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full appearance-none bg-transparent text-sm text-[var(--foreground)] outline-none',
            className,
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </span>
      {hint ? <span className="block text-sm text-[var(--muted)]">{hint}</span> : null}
    </label>
  )
})
