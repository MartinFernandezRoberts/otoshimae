# Otoshimae

E-commerce autoadministrable para Otoshimae, construido con `Vite + React + TypeScript`, conectado a Supabase y listo para un primer deploy en Vercel.

## Instalacion

```bash
npm install
```

## Desarrollo local

1. Crea tu archivo local de entorno:

```bash
cp .env.example .env.local
```

En PowerShell:

```powershell
Copy-Item .env.example .env.local
```

2. Completa las variables:

```env
VITE_APP_NAME=Otoshimae
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=TU_PUBLISHABLE_KEY
VITE_SUPABASE_STORAGE_BUCKET=product-images
```

3. Inicia la app:

```bash
npm run dev
```

## Build

Comando de build verificado localmente:

```bash
npm run build
```

Vercel puede usar estos valores:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## Deploy en Vercel

### Opcion 1: conectando el repositorio

1. Importa el repositorio en Vercel.
2. Verifica que detecte `Vite`.
3. Carga las variables de entorno indicadas abajo.
4. Deja el build command como `npm run build`.
5. Publica.

### Opcion 2: usando Vercel CLI

```bash
npm install -g vercel
vercel link
vercel env pull .env.local
vercel
```

Para publicar a produccion:

```bash
vercel --prod
```

## Variables de entorno en Vercel

Carga estas variables en `Project Settings > Environment Variables`:

### Requeridas

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

### Recomendadas

- `VITE_SUPABASE_STORAGE_BUCKET`
  Usa `product-images` si mantienes el bucket por defecto.

### Opcional

- `VITE_APP_NAME`
  Solo si quieres sobrescribir el nombre visible `Otoshimae`.

## Antes de publicar

Revisa esto antes del primer deploy:

1. Que `npm run build` funcione localmente.
2. Que las variables de entorno de Vercel esten cargadas para `Production` y, si quieres previews funcionales, tambien para `Preview`.
3. Que en Supabase `Authentication > URL Configuration` incluya:
   - `http://localhost:5173`
   - tu dominio de Vercel
   - tu dominio personalizado, si lo agregas despues
4. Que exista el bucket `product-images` y que su configuracion coincida con el uso actual de `getPublicUrl`.
5. Que exista al menos un usuario valido en `auth.users` y su registro activo en `public.admin_users` si vas a usar `/admin`.
6. Que tengas productos y categorias activas si quieres validar el storefront publico despues del deploy.

## Notas

- El proyecto usa `vercel.json` para resolver recargas directas de React Router en una SPA.
- No hace falta CI adicional para este primer deploy.
- La configuracion manual de Supabase esta resumida en [docs/supabase-setup.md](./docs/supabase-setup.md).
