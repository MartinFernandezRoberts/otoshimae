import { useEffect, useId, useRef } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: ModalProps) {
  const headingId = useId()
  const descriptionId = useId()
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const lastFocusedRef = useRef<HTMLElement | null>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseRef.current()
      }
    }

    const previousOverflow = document.body.style.overflow
    lastFocusedRef.current = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)
    window.setTimeout(() => closeButtonRef.current?.focus(), 0)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
      lastFocusedRef.current?.focus()
    }
  }, [open])

  if (!open) {
    return null
  }

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return createPortal(
    <div
      className="ui-modal-backdrop"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        aria-describedby={description ? descriptionId : undefined}
        className="ui-modal-panel p-6 md:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h2 id={headingId} className="text-3xl text-[var(--foreground)]">
              {title}
            </h2>
            {description ? (
              <p
                id={descriptionId}
                className="text-sm leading-7 text-[var(--foreground-soft)]"
              >
                {description}
              </p>
            ) : null}
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="ui-button ui-button-ghost ui-button-sm"
          >
            Cerrar
          </button>
        </div>
        <div className="mt-6">{children}</div>
        {footer ? <div className="mt-6">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  )
}
