const formatter = new Intl.DateTimeFormat('es-CL', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function formatDate(value: string | null | undefined) {
  if (!value) {
    return 'Sin fecha'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Fecha inválida'
  }

  return formatter.format(date)
}
