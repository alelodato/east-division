-- East Division — Supabase Schema

-- Products
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10,2) not null,
  category text not null check (category in ('sneakers','apparel','accessories')),
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- Product Images
create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0
);

-- Product Variants (size + stock)
create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  size text not null,
  stock integer not null default 0 check (stock >= 0),
  sku text unique,
  constraint unique_product_size unique (product_id, size)
);

-- Orders
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  total_amount numeric(10,2) not null,
  stripe_session_id text unique,
  status text not null default 'pending' check (status in ('pending','paid','shipped','delivered')),
  created_at timestamptz not null default now()
);

-- Order Items
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  size text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null
);

-- Indexes
create index if not exists idx_products_slug on products(slug);
create index if not exists idx_products_category on products(category);
create index if not exists idx_products_featured on products(featured);
create index if not exists idx_product_images_product_id on product_images(product_id);
create index if not exists idx_product_variants_product_id on product_variants(product_id);
create index if not exists idx_orders_stripe_session on orders(stripe_session_id);
create index if not exists idx_order_items_order_id on order_items(order_id);

-- RLS Policies
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_variants enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Public read access for products, images, variants
create policy "Public read products" on products for select using (true);
create policy "Public read product_images" on product_images for select using (true);
create policy "Public read product_variants" on product_variants for select using (true);

-- Admin full access (authenticated users with service role bypass RLS)
create policy "Admin manage products" on products for all using (auth.role() = 'authenticated');
create policy "Admin manage product_images" on product_images for all using (auth.role() = 'authenticated');
create policy "Admin manage product_variants" on product_variants for all using (auth.role() = 'authenticated');
create policy "Admin manage orders" on orders for all using (auth.role() = 'authenticated');
create policy "Admin manage order_items" on order_items for all using (auth.role() = 'authenticated');

-- Seed: Sample products for East Division
insert into products (name, slug, description, price, category, featured) values
  ('Air Force One Low White', 'air-force-one-low-white', 'The classic low-cut AF1 in clean triple white. A street staple since 1982. Premium leather upper with Air cushioning.', 109.95, 'sneakers', true),
  ('New Balance 574 Heritage Grey', 'new-balance-574-heritage-grey', 'Iconic silhouette, refined. The 574 in suede and mesh with ENCAP midsole technology. Made in the UK.', 94.95, 'sneakers', true),
  ('Adidas Samba OG Black', 'adidas-samba-og-black', 'The Samba returns. Football roots, street spirit. Gum sole, leather upper, clean profile.', 89.95, 'sneakers', true),
  ('Jordan 1 Retro High OG', 'jordan-1-retro-high-og', 'The shoe that changed everything. High-top cut, Wings logo, Nike Air cushioning. Original colourway.', 179.95, 'sneakers', true),
  ('Vans Old Skool Black White', 'vans-old-skool-black-white', 'The original skate shoe. Canvas and suede upper with the iconic Jazz stripe. Waffle outsole.', 79.95, 'sneakers', false),
  ('East Division Box Logo Tee', 'east-division-box-logo-tee', 'Heavyweight 280gsm cotton. East Division box logo centre chest. Made in Portugal. Black on black.', 49.95, 'apparel', true),
  ('East Division Track Jacket', 'east-division-track-jacket', 'Relaxed fit track jacket in recycled poly. Contrast taping, full zip, side pockets. East London made.', 129.95, 'apparel', false),
  ('East Division Cap Black', 'east-division-cap-black', 'Structured 6-panel cap. Embroidered logo. Adjustable strap. One size.', 34.95, 'accessories', false);

-- Seed: Variants for products (sizes EU 38-46 for sneakers)
do $$
declare
  pid uuid;
begin
  -- Air Force One
  select id into pid from products where slug = 'air-force-one-low-white';
  insert into product_variants (product_id, size, stock, sku) values
    (pid, 'EU 38', 3, 'AF1-WHT-38'), (pid, 'EU 39', 5, 'AF1-WHT-39'),
    (pid, 'EU 40', 8, 'AF1-WHT-40'), (pid, 'EU 41', 6, 'AF1-WHT-41'),
    (pid, 'EU 42', 4, 'AF1-WHT-42'), (pid, 'EU 43', 2, 'AF1-WHT-43'),
    (pid, 'EU 44', 1, 'AF1-WHT-44'), (pid, 'EU 45', 0, 'AF1-WHT-45');
  insert into product_images (product_id, image_url, alt_text, sort_order) values
    (pid, 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800', 'Air Force One Low White', 0),
    (pid, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', 'Air Force One Low White side', 1);

  -- New Balance 574
  select id into pid from products where slug = 'new-balance-574-heritage-grey';
  insert into product_variants (product_id, size, stock, sku) values
    (pid, 'EU 38', 2, 'NB574-GRY-38'), (pid, 'EU 39', 4, 'NB574-GRY-39'),
    (pid, 'EU 40', 6, 'NB574-GRY-40'), (pid, 'EU 41', 7, 'NB574-GRY-41'),
    (pid, 'EU 42', 5, 'NB574-GRY-42'), (pid, 'EU 43', 3, 'NB574-GRY-43'),
    (pid, 'EU 44', 2, 'NB574-GRY-44'), (pid, 'EU 45', 1, 'NB574-GRY-45');
  insert into product_images (product_id, image_url, alt_text, sort_order) values
    (pid, 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800', 'New Balance 574 Grey', 0),
    (pid, 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=800', 'New Balance 574 Grey detail', 1);

  -- Adidas Samba
  select id into pid from products where slug = 'adidas-samba-og-black';
  insert into product_variants (product_id, size, stock, sku) values
    (pid, 'EU 38', 1, 'SAMBA-BLK-38'), (pid, 'EU 39', 3, 'SAMBA-BLK-39'),
    (pid, 'EU 40', 5, 'SAMBA-BLK-40'), (pid, 'EU 41', 4, 'SAMBA-BLK-41'),
    (pid, 'EU 42', 2, 'SAMBA-BLK-42'), (pid, 'EU 43', 0, 'SAMBA-BLK-43'),
    (pid, 'EU 44', 1, 'SAMBA-BLK-44'), (pid, 'EU 45', 0, 'SAMBA-BLK-45');
  insert into product_images (product_id, image_url, alt_text, sort_order) values
    (pid, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800', 'Adidas Samba OG Black', 0),
    (pid, 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=800', 'Adidas Samba OG Black side', 1);

  -- Jordan 1
  select id into pid from products where slug = 'jordan-1-retro-high-og';
  insert into product_variants (product_id, size, stock, sku) values
    (pid, 'EU 38', 0, 'AJ1-OG-38'), (pid, 'EU 39', 1, 'AJ1-OG-39'),
    (pid, 'EU 40', 2, 'AJ1-OG-40'), (pid, 'EU 41', 3, 'AJ1-OG-41'),
    (pid, 'EU 42', 1, 'AJ1-OG-42'), (pid, 'EU 43', 0, 'AJ1-OG-43'),
    (pid, 'EU 44', 0, 'AJ1-OG-44'), (pid, 'EU 45', 1, 'AJ1-OG-45');
  insert into product_images (product_id, image_url, alt_text, sort_order) values
    (pid, 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=800', 'Jordan 1 Retro High OG', 0),
    (pid, 'https://images.unsplash.com/photo-1612015670817-0127d21628d4?w=800', 'Jordan 1 Retro High OG detail', 1);

  -- Vans Old Skool
  select id into pid from products where slug = 'vans-old-skool-black-white';
  insert into product_variants (product_id, size, stock, sku) values
    (pid, 'EU 38', 4, 'VANS-OS-38'), (pid, 'EU 39', 6, 'VANS-OS-39'),
    (pid, 'EU 40', 8, 'VANS-OS-40'), (pid, 'EU 41', 7, 'VANS-OS-41'),
    (pid, 'EU 42', 5, 'VANS-OS-42'), (pid, 'EU 43', 3, 'VANS-OS-43'),
    (pid, 'EU 44', 2, 'VANS-OS-44'), (pid, 'EU 45', 1, 'VANS-OS-45');
  insert into product_images (product_id, image_url, alt_text, sort_order) values
    (pid, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800', 'Vans Old Skool Black White', 0);

  -- East Division Tee
  select id into pid from products where slug = 'east-division-box-logo-tee';
  insert into product_variants (product_id, size, stock, sku) values
    (pid, 'XS', 5, 'ED-TEE-XS'), (pid, 'S', 10, 'ED-TEE-S'),
    (pid, 'M', 15, 'ED-TEE-M'), (pid, 'L', 12, 'ED-TEE-L'),
    (pid, 'XL', 8, 'ED-TEE-XL'), (pid, 'XXL', 4, 'ED-TEE-XXL');
  insert into product_images (product_id, image_url, alt_text, sort_order) values
    (pid, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', 'East Division Box Logo Tee', 0),
    (pid, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800', 'East Division Box Logo Tee back', 1);

  -- East Division Track Jacket
  select id into pid from products where slug = 'east-division-track-jacket';
  insert into product_variants (product_id, size, stock, sku) values
    (pid, 'XS', 2, 'ED-TJ-XS'), (pid, 'S', 5, 'ED-TJ-S'),
    (pid, 'M', 8, 'ED-TJ-M'), (pid, 'L', 6, 'ED-TJ-L'),
    (pid, 'XL', 3, 'ED-TJ-XL'), (pid, 'XXL', 1, 'ED-TJ-XXL');
  insert into product_images (product_id, image_url, alt_text, sort_order) values
    (pid, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800', 'East Division Track Jacket', 0);

  -- East Division Cap
  select id into pid from products where slug = 'east-division-cap-black';
  insert into product_variants (product_id, size, stock, sku) values
    (pid, 'One Size', 20, 'ED-CAP-OS');
  insert into product_images (product_id, image_url, alt_text, sort_order) values
    (pid, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800', 'East Division Cap Black', 0);
end $$;

-- Storage bucket for product images
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Storage policy
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Authenticated upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "Authenticated delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');
