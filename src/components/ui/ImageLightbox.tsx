import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import type { ProductImageRow } from '@/types/database'

type ImageLightboxProps = {
  images: ProductImageRow[]
  startIndex: number
  onClose: () => void
  fallbackAlt: string
}

export function ImageLightbox({
  images,
  startIndex,
  onClose,
  fallbackAlt,
}: ImageLightboxProps) {
  const [index, setIndex] = useState(startIndex)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const lastFocusedRef = useRef<HTMLElement | null>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseRef.current()
      } else if (event.key === 'ArrowRight') {
        setIndex((current) => (current + 1) % images.length)
      } else if (event.key === 'ArrowLeft') {
        setIndex((current) => (current - 1 + images.length) % images.length)
      }
    }

    const previousOverflow = document.body.style.overflow
    lastFocusedRef.current = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeydown)
    window.setTimeout(() => closeButtonRef.current?.focus(), 0)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeydown)
      lastFocusedRef.current?.focus()
    }
  }, [images.length])

  if (images.length === 0) {
    return null
  }

  const activeImage = images[index] ?? images[0]

  return createPortal(
    <div
      className="ui-lightbox-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={activeImage.alt ?? fallbackAlt}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="Cerrar vista ampliada"
        className="ui-lightbox-close"
      >
        Cerrar
      </button>

      {images.length > 1 ? (
        <button
          type="button"
          aria-label="Imagen anterior"
          className="ui-lightbox-nav ui-lightbox-nav-prev"
          onClick={() => setIndex((current) => (current - 1 + images.length) % images.length)}
        >
          ‹
        </button>
      ) : null}

      <img
        src={activeImage.url}
        alt={activeImage.alt ?? fallbackAlt}
        className="ui-lightbox-image"
      />

      {images.length > 1 ? (
        <button
          type="button"
          aria-label="Imagen siguiente"
          className="ui-lightbox-nav ui-lightbox-nav-next"
          onClick={() => setIndex((current) => (current + 1) % images.length)}
        >
          ›
        </button>
      ) : null}

      {images.length > 1 ? (
        <div className="ui-lightbox-thumbs" onClick={(event) => event.stopPropagation()}>
          {images.map((image, imageIndex) => (
            <button
              key={image.id}
              type="button"
              aria-label={`Ver imagen ${imageIndex + 1}`}
              aria-pressed={imageIndex === index}
              className="ui-lightbox-thumb"
              data-active={imageIndex === index}
              onClick={() => setIndex(imageIndex)}
            >
              <img src={image.url} alt={image.alt ?? fallbackAlt} loading="lazy" />
            </button>
          ))}
        </div>
      ) : null}
    </div>,
    document.body,
  )
}
