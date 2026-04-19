import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { StatusMessage } from '@/components/ui/StatusMessage'
import type { AdminProductImage } from '@/features/admin/admin.types'

type ProductImageManagerProps = {
  images: AdminProductImage[]
  uploading: boolean
  deletingId: string | null
  onUpload: (file: File, alt: string, sortOrder: number) => Promise<void>
  onDelete: (image: AdminProductImage) => Promise<void>
}

export function ProductImageManager({
  images,
  uploading,
  deletingId,
  onUpload,
  onDelete,
}: ProductImageManagerProps) {
  const [file, setFile] = useState<File | null>(null)
  const [alt, setAlt] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const nextSortOrder = useMemo(() => {
    if (images.length === 0) {
      return 0
    }

    return Math.max(...images.map((image) => image.sort_order)) + 1
  }, [images])

  const visibleImages = images.filter((image) => !image.is_deleted)

  const handleUpload = async () => {
    if (!file) {
      setError('Selecciona un archivo para subir.')
      return
    }

    try {
      setError(null)
      setMessage(null)
      await onUpload(file, alt, nextSortOrder)
      setFile(null)
      setAlt('')
      setMessage('Imagen cargada correctamente.')
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : 'No se pudo subir la imagen.',
      )
    }
  }

  return (
    <div className="space-y-4 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--background-soft)] p-5">
      <div className="space-y-2">
        <h3 className="text-2xl text-[var(--foreground)]">Imágenes</h3>
        <p className="text-sm leading-7 text-[var(--foreground-soft)]">
          La eliminación es lógica: la imagen deja de mostrarse, pero se conserva el registro.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_220px]">
        <Input
          label="Texto alternativo"
          value={alt}
          onChange={(event) => setAlt(event.target.value)}
          placeholder="Máscara frontal sobre fondo oscuro"
        />
        <label className="block space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--foreground-soft)]">
            Archivo
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="block w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)]"
          />
        </label>
      </div>

      {error ? <StatusMessage tone="error" message={error} /> : null}
      {message ? <StatusMessage tone="success" message={message} /> : null}

      <Button onClick={() => void handleUpload()} loading={uploading}>
        Subir imagen
      </Button>

      <div className="grid gap-3">
        {visibleImages.length > 0 ? (
          visibleImages.map((image) => (
            <div
              key={image.id}
              className="flex flex-col gap-4 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--background)] p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[var(--foreground)]">
                  {image.alt || 'Sin texto alternativo'}
                </p>
                <p className="truncate text-xs text-[var(--muted)]">{image.url}</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                loading={deletingId === image.id}
                onClick={() => void onDelete(image)}
              >
                Eliminación lógica
              </Button>
            </div>
          ))
        ) : (
          <p className="text-sm text-[var(--muted)]">Aún no hay imágenes cargadas.</p>
        )}
      </div>
    </div>
  )
}
