import { useEffect, useState } from 'react'

import { PagePlaceholder } from '@/components/PagePlaceholder'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import { StatusMessage } from '@/components/ui/StatusMessage'
import { listAdminSettings, saveAdminSettings } from '@/features/admin/admin.api'
import { StoreSettingsForm } from '@/features/admin/StoreSettingsForm'
import type { StoreSettingsFormValues } from '@/features/admin/admin.types'
import { createSettingsDefaults } from '@/features/admin/admin.utils'
import type { SiteSettingRow } from '@/types/database'

function toSettingsFormValues(settings: SiteSettingRow[]): StoreSettingsFormValues {
  const getString = (key: string) => {
    const match = settings.find((item) => item.key === key)

    return typeof match?.value === 'string' ? match.value : ''
  }

  return {
    storeName: getString('store_name'),
    storeEmail: getString('store_email'),
    storeCurrency: getString('store_currency') || 'CLP',
    whatsapp: getString('store_whatsapp'),
    shippingNote: getString('shipping_note'),
    pickupAddress: getString('pickup_address'),
  }
}

function validate(values: StoreSettingsFormValues) {
  const errors: Partial<Record<keyof StoreSettingsFormValues, string>> = {}
  const emailPattern = /\S+@\S+\.\S+/

  if (values.storeName.trim().length < 2) {
    errors.storeName = 'Ingresa un nombre válido.'
  }

  if (!emailPattern.test(values.storeEmail.trim())) {
    errors.storeEmail = 'Ingresa un correo válido.'
  }

  if (values.storeCurrency.trim().length < 3) {
    errors.storeCurrency = 'La moneda debe tener al menos 3 caracteres.'
  }

  return errors
}

export function AdminSettingsPage() {
  const [values, setValues] = useState<StoreSettingsFormValues>(createSettingsDefaults())
  const [errors, setErrors] = useState<
    Partial<Record<keyof StoreSettingsFormValues, string>>
  >({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const loadSettings = async () => {
    try {
      setError(null)
      const settings = await listAdminSettings()
      setValues(toSettingsFormValues(settings))
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'No se pudo cargar la configuración.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      void loadSettings()
    })
  }, [])

  const handleChange = <Key extends keyof StoreSettingsFormValues>(
    key: Key,
    value: StoreSettingsFormValues[Key],
  ) => {
    setValues((current) => ({
      ...current,
      [key]: value,
    }))
  }

  const handleSubmit = async () => {
    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      await saveAdminSettings(values)
      setSuccess('Configuración guardada correctamente.')
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'No se pudo guardar la configuración.',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <PagePlaceholder
      eyebrow="Admin"
      title="Configuración"
      description="Ajustes básicos de tienda persistidos en site_settings para el MVP."
    >
      {error ? <StatusMessage tone="error" message={error} /> : null}
      {success ? <StatusMessage tone="success" message={success} /> : null}

      {loading ? (
        <Card tone="admin" className="p-8">
          <Loader label="Cargando configuración..." />
        </Card>
      ) : (
        <Card tone="admin" className="space-y-6 p-6">
          <StoreSettingsForm
            values={values}
            errors={errors}
            onChange={handleChange}
          />
          <div className="flex justify-end">
            <Button loading={saving} onClick={() => void handleSubmit()}>
              Guardar configuración
            </Button>
          </div>
        </Card>
      )}
    </PagePlaceholder>
  )
}
