# Supabase Setup

Esta base deja el proyecto preparado para usar Supabase como backend del MVP.

## 1. Crear el proyecto en Supabase

1. Crea un proyecto nuevo en Supabase.
2. Copia:
   - `Project URL`
   - `Publishable key`

## 2. Ejecutar las migraciones SQL

Ejecuta todos los archivos dentro de `supabase/migrations/` en orden:

```text
supabase/migrations/20260418_000001_init_mvp.sql
supabase/migrations/20260418_000002_product_images_soft_delete.sql
supabase/migrations/20260421_000003_fix_admin_rls_recursion.sql
```

Puedes correrlos desde:

- SQL Editor de Supabase
- Supabase CLI si mas adelante conectas el repo con `supabase link`

Las migraciones crean y corrigen:

- tablas del MVP
- tipos enum para estados de pedido e inventario
- politicas RLS
- bucket `product-images`
- funcion RPC `create_order_with_items`
- columnas de eliminacion logica para `product_images`
- funcion segura para comprobar permisos admin sin recursion de RLS

## 3. Configurar autenticacion

En `Authentication > Providers`:

1. habilita `Email`
2. usa login por `email + password`

En `Authentication > URL Configuration`:

- `Site URL` local: `http://localhost:5173`
- agrega tambien tu dominio de Vercel cuando lo tengas

## 4. Crear el primer administrador

Primero crea el usuario desde Supabase Auth o desde el login si habilitas sign up por fuera del panel.

Luego promuevelo en SQL:

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

- tener sesion valida en Supabase Auth
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

## 6. Bucket de imagenes

La migracion intenta crear el bucket `product-images`.

Verifica en `Storage` que:

- exista el bucket
- este publico si quieres usar `getPublicUrl`

## 7. Que quedo listo en frontend

- cliente reusable de Supabase en `src/lib/supabase.ts`
- auth admin con guard de rutas
- login admin real con email y contrasena
- APIs de frontend para categorias, productos, banners, settings y ordenes
- checkout conectado a la RPC `create_order_with_items`

## 8. Supuestos de esta base

- no hay pagos todavia
- la creacion de ordenes descuenta stock automaticamente
- `site_settings` esta pensada para valores publicos de la tienda, no secretos
- `product_variants` e `inventory_movements` quedan preparados aunque el storefront todavia no los explota visualmente
