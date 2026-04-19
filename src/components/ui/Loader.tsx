import { cn } from '@/lib/cn'

type LoaderProps = {
  size?: 'sm' | 'md' | 'lg'
  label?: string
  className?: string
}

export function Loader({
  size = 'md',
  label,
  className,
}: LoaderProps) {
  return (
    <span className={cn('inline-flex items-center gap-3 text-[var(--foreground-soft)]', className)}>
      <span
        className={cn(
          'inline-block animate-spin rounded-full border border-[var(--line)] border-t-[var(--accent)]',
          size === 'sm' && 'h-4 w-4',
          size === 'md' && 'h-5 w-5',
          size === 'lg' && 'h-7 w-7',
        )}
        aria-hidden="true"
      />
      {label ? <span className="text-sm">{label}</span> : null}
    </span>
  )
}
