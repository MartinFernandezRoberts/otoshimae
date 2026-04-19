alter table public.product_images
  add column if not exists is_deleted boolean not null default false,
  add column if not exists deleted_at timestamptz;

create index if not exists idx_product_images_not_deleted
  on public.product_images(product_id, is_deleted);
