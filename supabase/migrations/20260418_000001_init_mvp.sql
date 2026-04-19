create extension if not exists pgcrypto;

create type public.order_status as enum (
  'pendiente',
  'confirmado',
  'preparando',
  'enviado',
  'entregado',
  'cancelado'
);

create type public.inventory_movement_type as enum (
  'initial_stock',
  'manual_adjustment',
  'order_created',
  'order_cancelled',
  'restock'
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.generate_order_number()
returns text
language sql
as $$
  select 'OTO-' || to_char(timezone('utc', now()), 'YYYYMMDD-HH24MISS') || '-' ||
    upper(substring(replace(gen_random_uuid()::text, '-', '') from 1 for 6));
$$;

create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role text not null default 'admin',
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where id = auth.uid()
      and is_active = true
  );
$$;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  short_description text,
  price numeric(12, 2) not null default 0,
  compare_price numeric(12, 2),
  stock integer not null default 0 check (stock >= 0),
  sku text unique,
  category_id uuid references public.categories(id) on delete set null,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt text,
  sort_order integer not null default 0,
  storage_path text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  sku text unique,
  price numeric(12, 2),
  stock integer not null default 0 check (stock >= 0),
  attributes jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  product_variant_id uuid references public.product_variants(id) on delete set null,
  movement_type public.inventory_movement_type not null,
  quantity integer not null,
  reference text,
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default public.generate_order_number(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  status public.order_status not null default 'pendiente',
  subtotal numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name_snapshot text not null,
  unit_price numeric(12, 2) not null,
  quantity integer not null check (quantity > 0),
  line_total numeric(12, 2) not null
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  description text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.homepage_banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text,
  link_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_products_is_active on public.products(is_active);
create index if not exists idx_product_images_product_id on public.product_images(product_id);
create index if not exists idx_product_variants_product_id on public.product_variants(product_id);
create index if not exists idx_inventory_movements_product_id on public.inventory_movements(product_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_homepage_banners_sort_order on public.homepage_banners(sort_order);

drop trigger if exists set_admin_users_updated_at on public.admin_users;
create trigger set_admin_users_updated_at
before update on public.admin_users
for each row execute function public.set_updated_at();

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists set_product_variants_updated_at on public.product_variants;
create trigger set_product_variants_updated_at
before update on public.product_variants
for each row execute function public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_homepage_banners_updated_at on public.homepage_banners;
create trigger set_homepage_banners_updated_at
before update on public.homepage_banners
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.site_settings enable row level security;
alter table public.homepage_banners enable row level security;

create policy "admin users can read their admin row"
on public.admin_users
for select
to authenticated
using (id = auth.uid());

create policy "admins manage admin users"
on public.admin_users
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public can read active categories"
on public.categories
for select
to anon, authenticated
using (is_active = true);

create policy "admins manage categories"
on public.categories
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public can read active products"
on public.products
for select
to anon, authenticated
using (is_active = true);

create policy "admins manage products"
on public.products
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public can read product images"
on public.product_images
for select
to anon, authenticated
using (true);

create policy "admins manage product images"
on public.product_images
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public can read active variants"
on public.product_variants
for select
to anon, authenticated
using (is_active = true);

create policy "admins manage product variants"
on public.product_variants
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage inventory movements"
on public.inventory_movements
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins read and manage orders"
on public.orders
for select
to authenticated
using (public.is_admin());

create policy "admins update orders"
on public.orders
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins delete orders"
on public.orders
for delete
to authenticated
using (public.is_admin());

create policy "admins read order items"
on public.order_items
for select
to authenticated
using (public.is_admin());

create policy "admins manage site settings"
on public.site_settings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public can read site settings"
on public.site_settings
for select
to anon, authenticated
using (true);

create policy "public can read active homepage banners"
on public.homepage_banners
for select
to anon, authenticated
using (is_active = true);

create policy "admins manage homepage banners"
on public.homepage_banners
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "public can read product image objects"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'product-images');

create policy "admins can upload product image objects"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'product-images' and public.is_admin());

create policy "admins can update product image objects"
on storage.objects
for update
to authenticated
using (bucket_id = 'product-images' and public.is_admin())
with check (bucket_id = 'product-images' and public.is_admin());

create policy "admins can delete product image objects"
on storage.objects
for delete
to authenticated
using (bucket_id = 'product-images' and public.is_admin());

create or replace function public.create_order_with_items(
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text default null,
  p_notes text default null,
  p_items jsonb default '[]'::jsonb
)
returns table(order_id uuid, order_number text, total numeric)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_order_number text;
  v_total numeric(12, 2) := 0;
  v_item jsonb;
  v_product public.products%rowtype;
  v_quantity integer;
  v_line_total numeric(12, 2);
begin
  if coalesce(jsonb_array_length(p_items), 0) = 0 then
    raise exception 'Debes enviar al menos un producto.';
  end if;

  insert into public.orders (
    customer_name,
    customer_email,
    customer_phone,
    notes
  )
  values (
    p_customer_name,
    p_customer_email,
    p_customer_phone,
    p_notes
  )
  returning id, order_number
  into v_order_id, v_order_number;

  for v_item in
    select value from jsonb_array_elements(p_items)
  loop
    v_quantity := coalesce((v_item ->> 'quantity')::integer, 0);

    if v_quantity <= 0 then
      raise exception 'Cantidad inválida para el producto enviado.';
    end if;

    select *
    into v_product
    from public.products
    where id = (v_item ->> 'product_id')::uuid
      and is_active = true
    limit 1;

    if not found then
      raise exception 'Producto inválido o inactivo.';
    end if;

    if v_product.stock < v_quantity then
      raise exception 'Stock insuficiente para %.', v_product.name;
    end if;

    v_line_total := v_product.price * v_quantity;
    v_total := v_total + v_line_total;

    insert into public.order_items (
      order_id,
      product_id,
      product_name_snapshot,
      unit_price,
      quantity,
      line_total
    )
    values (
      v_order_id,
      v_product.id,
      v_product.name,
      v_product.price,
      v_quantity,
      v_line_total
    );

    update public.products
    set stock = stock - v_quantity
    where id = v_product.id;

    insert into public.inventory_movements (
      product_id,
      movement_type,
      quantity,
      reference,
      notes
    )
    values (
      v_product.id,
      'order_created',
      -v_quantity,
      v_order_number,
      'Descuento automático por creación de orden'
    );
  end loop;

  update public.orders
  set subtotal = v_total,
      total = v_total
  where id = v_order_id;

  return query
  select v_order_id, v_order_number, v_total;
end;
$$;

insert into public.site_settings (key, value, description)
values
  ('store_name', to_jsonb('Otoshimae'::text), 'Nombre visible de la tienda'),
  ('store_email', to_jsonb('hola@otoshimae.cl'::text), 'Correo público de contacto'),
  ('store_currency', to_jsonb('CLP'::text), 'Moneda principal de la tienda')
on conflict (key) do nothing;
