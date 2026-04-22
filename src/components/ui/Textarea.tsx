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
    const hintId = hint ? `${textareaId}-hint` : undefined
    const errorId = error ? `${textareaId}-error` : undefined

    return (
      <label className="block space-y-2">
        {label ? (
          <span className="ui-field-label">{label}</span>
        ) : null}
        <span
          data-invalid={error ? 'true' : 'false'}
          className={cn(
            'ui-field-shell items-start',
            className,
          )}
        >
          {icon ? <span className="pt-1 text-[var(--muted)]">{icon}</span> : null}
          <textarea
            ref={ref}
            id={textareaId}
            className="ui-field-control min-h-28 resize-y"
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
  },
)
