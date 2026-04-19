import { cn } from '@/lib/cn'

type StatusMessageProps = {
  tone?: 'info' | 'success' | 'error'
  message: string
  className?: string
}

const toneClasses: Record<NonNullable<StatusMessageProps['tone']>, string> = {
  info: 'border-[var(--line)] bg-[var(--surface)] text-[var(--foreground-soft)]',
  success:
    'border-[rgba(127,178,151,0.22)] bg-[rgba(127,178,151,0.12)] text-[var(--success)]',
  error:
    'border-[rgba(212,134,114,0.22)] bg-[rgba(212,134,114,0.12)] text-[var(--danger)]',
}

export function StatusMessage({
  tone = 'info',
  message,
  className,
}: StatusMessageProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-sm)] border px-4 py-3 text-sm',
        toneClasses[tone],
        className,
      )}
    >
      {message}
    </div>
  )
}
