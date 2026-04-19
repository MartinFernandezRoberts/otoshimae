import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import type { StoreSettingsFormValues } from '@/features/admin/admin.types'

type StoreSettingsFormProps = {
  values: StoreSettingsFormValues
  errors: Partial<Record<keyof StoreSettingsFormValues, string>>
  onChange: <Key extends keyof StoreSettingsFormValues>(
    key: Key,
    value: StoreSettingsFormValues[Key],
  ) => void
}

export function StoreSettingsForm({
  values,
  errors,
  onChange,
}: StoreSettingsFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Nombre de tienda"
          value={values.storeName}
          onChange={(event) => onChange('storeName', event.target.value)}
          error={errors.storeName}
        />
        <Input
          label="Correo"
          type="email"
          value={values.storeEmail}
          onChange={(event) => onChange('storeEmail', event.target.value)}
          error={errors.storeEmail}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Moneda"
          value={values.storeCurrency}
          onChange={(event) => onChange('storeCurrency', event.target.value)}
          error={errors.storeCurrency}
        />
        <Input
          label="WhatsApp"
          value={values.whatsapp}
          onChange={(event) => onChange('whatsapp', event.target.value)}
          error={errors.whatsapp}
        />
      </div>
      <Textarea
        label="Nota de despacho"
        value={values.shippingNote}
        onChange={(event) => onChange('shippingNote', event.target.value)}
        error={errors.shippingNote}
      />
      <Textarea
        label="Dirección de retiro"
        value={values.pickupAddress}
        onChange={(event) => onChange('pickupAddress', event.target.value)}
        error={errors.pickupAddress}
      />
    </div>
  )
}
