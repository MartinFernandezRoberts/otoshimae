create schema if not exists private;

grant usage on schema private to authenticated;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where id = (select auth.uid())
      and is_active = true
  );
$$;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated;

drop policy if exists "admins manage admin users" on public.admin_users;
create policy "admins manage admin users"
on public.admin_users
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "admins manage categories" on public.categories;
create policy "admins manage categories"
on public.categories
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "admins manage products" on public.products;
create policy "admins manage products"
on public.products
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "admins manage product images" on public.product_images;
create policy "admins manage product images"
on public.product_images
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "admins manage product variants" on public.product_variants;
create policy "admins manage product variants"
on public.product_variants
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "admins manage inventory movements" on public.inventory_movements;
create policy "admins manage inventory movements"
on public.inventory_movements
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "admins read and manage orders" on public.orders;
create policy "admins read and manage orders"
on public.orders
for select
to authenticated
using ((select private.is_admin()));

drop policy if exists "admins update orders" on public.orders;
create policy "admins update orders"
on public.orders
for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "admins delete orders" on public.orders;
create policy "admins delete orders"
on public.orders
for delete
to authenticated
using ((select private.is_admin()));

drop policy if exists "admins read order items" on public.order_items;
create policy "admins read order items"
on public.order_items
for select
to authenticated
using ((select private.is_admin()));

drop policy if exists "admins manage site settings" on public.site_settings;
create policy "admins manage site settings"
on public.site_settings
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "admins manage homepage banners" on public.homepage_banners;
create policy "admins manage homepage banners"
on public.homepage_banners
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "admins can upload product image objects" on storage.objects;
create policy "admins can upload product image objects"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'product-images' and (select private.is_admin()));

drop policy if exists "admins can update product image objects" on storage.objects;
create policy "admins can update product image objects"
on storage.objects
for update
to authenticated
using (bucket_id = 'product-images' and (select private.is_admin()))
with check (bucket_id = 'product-images' and (select private.is_admin()));

drop policy if exists "admins can delete product image objects" on storage.objects;
create policy "admins can delete product image objects"
on storage.objects
for delete
to authenticated
using (bucket_id = 'product-images' and (select private.is_admin()));

drop function if exists public.is_admin();
