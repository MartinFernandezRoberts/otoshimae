# Otoshimae Design System

Sistema visual base para el storefront y el panel admin.

## Direccion

- Oscuro, editorial y premium.
- Negro como base estructural.
- Marfil envejecido para contraste y lectura.
- Cobre oscuro y rojo profundo como acentos de marca.
- Evita colores frios o tecnologicos fuera del sistema.

## Tokens Base

Los tokens viven en `src/index.css` dentro de `:root` y `@theme inline`.

### Colores semanticos

- `--background`, `--background-strong`, `--background-soft`: fondos principales.
- `--panel`, `--surface`, `--surface-strong`, `--surface-alt`, `--surface-inset`: capas y superficies.
- `--foreground`, `--foreground-soft`, `--muted`: texto principal, secundario y auxiliar.
- `--border`, `--border-strong`: bordes base y reforzados.
- `--accent`, `--accent-strong`, `--accent-deep`, `--accent-soft`, `--accent-surface`: acentos cobre viejo.
- `--destructive`, `--destructive-soft`: acciones o mensajes de error.
- `--success`, `--success-soft`: feedback positivo.
- `--focus-ring`, `--overlay`, `--admin`: estados y contextos especiales.

### Tipografia

- `font-sans`: `Manrope` para interfaz y texto funcional.
- `font-display`: `Cormorant Garamond` para titulares editoriales.
- `font-mono`: `IBM Plex Mono` para ids, datos y referencias.

### Escala tipografica

- `text-kicker`: etiquetas editoriales y eyebrows.
- `text-body`: cuerpo principal legible.
- `text-display-sm`, `text-display-md`, `text-display-lg`: titulares de alto impacto.

### Spacing

- Escala base: `--space-1`, `2`, `3`, `4`, `5`, `6`, `8`, `10`, `12`, `14`, `18`, `22`.
- En Tailwind quedaron disponibles extras como `p-18`, `gap-18`, `py-22`.

### Radios y sombras

- Radios: `--radius-xs`, `sm`, `md`, `lg`, `xl`, `pill`.
- Tailwind: `rounded-card`, `rounded-panel`.
- Sombras: `shadow-soft`, `shadow-panel`, `shadow-floating`.

## Utilidades Tailwind

El theme de Tailwind v4 se expuso con nombres semanticos:

- Colores: `bg-background`, `bg-panel`, `bg-surface`, `text-foreground`, `text-foreground-soft`, `border-border`, `text-accent`, `text-success`, `text-destructive`.
- Tipografia: `font-display`, `font-sans`, `font-mono`.
- Texto: `text-kicker`, `text-body`, `text-display-sm`, `text-display-md`, `text-display-lg`.
- Radio y sombra: `rounded-card`, `rounded-panel`, `shadow-soft`, `shadow-panel`, `shadow-floating`.

## Clases reutilizables

Tambien quedaron clases CSS reutilizables para patrones repetidos:

- `.ui-button`, `.ui-button-primary`, `.ui-button-secondary`, `.ui-button-ghost`, `.ui-button-destructive`
- `.ui-card`, `.ui-card-muted`, `.ui-card-accent`, `.ui-card-admin`
- `.ui-badge`, `.ui-badge-accent`, `.ui-badge-success`, `.ui-badge-destructive`, `.ui-badge-outline`
- `.ui-field-label`, `.ui-field-shell`, `.ui-field-control`, `.ui-field-hint`, `.ui-field-error`
- `.ui-modal-backdrop`, `.ui-modal-panel`
- `.ui-tabs-list`, `.ui-tab-trigger`, `.ui-tab-panel`
- `.ui-breadcrumbs`, `.ui-breadcrumb-link`, `.ui-breadcrumb-current`
- `.ui-surface-inset`, `.ui-eyebrow`, `.ui-copy-muted`

## Componentes base

Componentes redisenados o agregados:

- `src/components/ui/Button.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/Badge.tsx`
- `src/components/ui/Input.tsx`
- `src/components/ui/Select.tsx`
- `src/components/ui/Textarea.tsx`
- `src/components/ui/Modal.tsx`
- `src/components/ui/Breadcrumbs.tsx`
- `src/components/ui/Tabs.tsx`

## Recomendaciones de uso

- Usa tokens semanticos antes que colores directos.
- Prefiere componentes base antes que escribir surfaces nuevas con `rgba(...)`.
- Usa `font-display` solo para jerarquias y titulares.
- Usa `ui-surface-inset` para bloques secundarios dentro de cards o panels.
- Para nuevas vistas, compone desde `Card`, `Button`, `Badge`, `Input`, `Select`, `Textarea`, `Modal`, `Tabs` y `Breadcrumbs` antes de inventar nuevas variantes.
