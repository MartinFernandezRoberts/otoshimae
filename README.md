# Otoshimae

Base inicial del e-commerce autoadministrable de Otoshimae, creada con `Vite + React + TypeScript`, pensada para crecer por features y quedar lista para un primer deploy en Vercel.

## Stack

- `Vite`
- `React 19`
- `TypeScript`
- `React Router`
- `Tailwind CSS`
- `ESLint`

## Estructura base

```text
src/
  app/
  components/
  features/
    admin/
    auth/
    cart/
    catalog/
    orders/
  hooks/
  layouts/
  lib/
  pages/
  types/
```

## Desarrollo local

1. Instala dependencias:

```bash
npm install
```

2. Crea tu archivo de entorno:

```bash
Copy-Item .env.example .env
```

En macOS o Linux puedes usar:

```bash
cp .env.example .env
```

3. Levanta el entorno:

```bash
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Variables de entorno

Las variables públicas del frontend usan prefijo `VITE_`.

Revisa [.env.example](./.env.example) para la base inicial.

## Deploy en Vercel

### Opción 1: conectar el repositorio

1. Importa el repo en Vercel.
2. Vercel detectará automáticamente `Vite`.
3. Usa los valores por defecto:
   - Build command: `npm run build`
   - Output directory: `dist`

### Opción 2: deploy por CLI

```bash
npm install -g vercel
vercel
```

Para producción:

```bash
vercel --prod
```

## Notas de arquitectura

- La app usa layouts separados para la experiencia pública y la experiencia admin.
- Las rutas están centralizadas en `src/app/router.tsx`.
- Se configuró alias `@/*` para imports más limpios.
- Se agregó `vercel.json` para soportar recarga directa en rutas del SPA con React Router.
