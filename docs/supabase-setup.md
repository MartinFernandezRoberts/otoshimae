# Supabase Setup

Esta base deja el proyecto preparado para usar Supabase como backend del MVP.

## 1. Crear el proyecto en Supabase

1. Crea un proyecto nuevo en Supabase.
2. Copia:
   - `Project URL`
   - `Publishable key`

## 2. Ejecutar la migración SQL

Usa el archivo:

```text
supabase/migrations/20260418_000001_init_mvp.sql
```

Puedes correrlo desde:

- SQL Editor de Supabase
- Supabase CLI si más adelante conectas el repo con `supabase link`

La migración crea:

- tablas del MVP
- tipos enum para estados de pedido e inventario
- políticas RLS
- bucket `product-images`
- función RPC `create_order_with_items`

## 3. Configurar autenticación

En `Authentication > Providers`:

1. habilita `Email`
2. usa login por `email + password`

En `Authentication > URL Configuration`:

- `Site URL` local: `http://localhost:5173`
- agrega también tu dominio de Vercel cuando lo tengas

## 4. Crear el primer administrador

Primero crea el usuario desde Supabase Auth o desde el login si habilitas sign up por fuera del panel.

Luego promuévelo en SQL:

```sql
insert into public.admin_users (id, email, full_name, role)
select id, email, 'Administrador Otoshimae', 'admin'
from auth.users
where email = 'admin@otoshimae.cl'
on conflict (id) do update
set email = excluded.email,
    full_name = excluded.full_name,
    role = excluded.role,
    is_active = true;
```

El acceso a `/admin` depende de dos cosas:

- tener sesión válida en Supabase Auth
- existir en `public.admin_users` con `is_active = true`

## 5. Configurar variables de entorno

### Local

Usa `.env.local` con:

```env
VITE_APP_NAME=Otoshimae
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
VITE_SUPABASE_STORAGE_BUCKET=product-images
```

### Vercel

En `Project Settings > Environment Variables` agrega estas claves:

- Requeridas:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
- Recomendadas:
  - `VITE_SUPABASE_STORAGE_BUCKET`
- Opcional:
  - `VITE_APP_NAME`

## 6. Bucket de imágenes

La migración intenta crear el bucket `product-images`.

Verifica en `Storage` que:

- exista el bucket
- esté público si quieres usar `getPublicUrl`

## 7. Qué quedó listo en frontend

- cliente reusable de Supabase en `src/lib/supabase.ts`
- auth admin con guard de rutas
- login admin real con email y contraseña
- APIs de frontend para categorías, productos, banners, settings y órdenes
- checkout conectado a la RPC `create_order_with_items`

## 8. Supuestos de esta base

- no hay pagos todavía
- la creación de órdenes descuenta stock automáticamente
- `site_settings` está pensada para valores públicos de la tienda, no secretos
- `product_variants` e `inventory_movements` quedan preparados aunque el storefront todavía no los explota visualmente
