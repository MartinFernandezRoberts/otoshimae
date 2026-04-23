import { cn } from '@/lib/cn'

type StatusMessageProps = {
  tone?: 'info' | 'success' | 'error'
  message: string
  className?: string
}

const toneClasses: Record<NonNullable<StatusMessageProps['tone']>, string> = {
  info: 'ui-surface-inset text-[var(--foreground-soft)]',
  success:
    'border-[rgba(142,180,148,0.32)] bg-[rgba(142,180,148,0.15)] text-[#c8d7b8]',
  error:
    'border-[rgba(219,143,120,0.34)] bg-[rgba(219,143,120,0.15)] text-[#f0b49f]',
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
        'rounded-[var(--radius-sm)] border px-4 py-3.5 text-sm font-medium leading-6 shadow-[0_14px_32px_rgba(0,0,0,0.16)]',
        toneClasses[tone],
        className,
      )}
    >
      {message}
    </div>
  )
}
