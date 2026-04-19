import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import type { StockAdjustmentValues } from '@/features/admin/admin.types'

type StockAdjustmentFormProps = {
  values: StockAdjustmentValues
  errors: Partial<Record<keyof StockAdjustmentValues, string>>
  onChange: <Key extends keyof StockAdjustmentValues>(
    key: Key,
    value: StockAdjustmentValues[Key],
  ) => void
}

export function StockAdjustmentForm({
  values,
  errors,
  onChange,
}: StockAdjustmentFormProps) {
  return (
    <div className="space-y-4">
      <Input
        label="Ajuste"
        type="number"
        value={values.quantity}
        onChange={(event) => onChange('quantity', event.target.value)}
        error={errors.quantity}
        hint="Usa positivos para sumar stock y negativos para descontar."
        placeholder="5 o -2"
      />
      <Textarea
        label="Notas"
        value={values.notes}
        onChange={(event) => onChange('notes', event.target.value)}
        error={errors.notes}
        placeholder="Motivo del ajuste manual."
      />
    </div>
  )
}
