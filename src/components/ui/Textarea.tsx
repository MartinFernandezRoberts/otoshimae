import { forwardRef, useId } from 'react'
import type { ReactNode, TextareaHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  hint?: string
  error?: string
  icon?: ReactNode
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, error, hint, icon, id, label, ...props }, ref) {
    const generatedId = useId()
    const textareaId = id ?? generatedId

    return (
      <label className="block space-y-2">
        {label ? (
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--foreground-soft)]">
            {label}
          </span>
        ) : null}
        <span
          className={cn(
            'flex gap-3 rounded-[var(--radius-sm)] border bg-[var(--background-soft)] px-4 py-3 transition focus-within:border-[var(--accent)]',
            error ? 'border-[rgba(212,134,114,0.4)]' : 'border-[var(--line)]',
          )}
        >
          {icon ? <span className="pt-1 text-[var(--muted)]">{icon}</span> : null}
          <textarea
            ref={ref}
            id={textareaId}
            className={cn(
              'min-h-28 w-full resize-y bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]',
              className,
            )}
            aria-invalid={Boolean(error)}
            {...props}
          />
        </span>
        {hint ? <span className="block text-sm text-[var(--muted)]">{hint}</span> : null}
        {error ? <span className="block text-sm text-[var(--danger)]">{error}</span> : null}
      </label>
    )
  },
)
