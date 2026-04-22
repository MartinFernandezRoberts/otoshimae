import { cn } from '@/lib/cn'

type StatusMessageProps = {
  tone?: 'info' | 'success' | 'error'
  message: string
  className?: string
}

const toneClasses: Record<NonNullable<StatusMessageProps['tone']>, string> = {
  info: 'ui-surface-inset text-[var(--foreground-soft)]',
  success:
    'border-[rgba(142,180,148,0.22)] bg-[rgba(142,180,148,0.12)] text-[var(--success)]',
  error:
    'border-[rgba(219,143,120,0.22)] bg-[rgba(219,143,120,0.12)] text-[var(--destructive)]',
}

export function StatusMessage({
  tone = 'info',
  message,
  className,
}: StatusMessageProps) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      aria-live={tone === 'error' ? 'assertive' : 'polite'}
      className={cn(
        'rounded-[var(--radius-sm)] border px-4 py-3.5 text-sm leading-6',
        toneClasses[tone],
        className,
      )}
    >
      {message}
    </div>
  )
}
