create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  roast roast_level,
  base_price numeric(10, 2) not null default 0 check (base_price >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  is_active boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

create index products_category_id_idx on public.products(category_id);

-- Per-product size options (e.g. Small / Medium / Large) with a price
-- delta added to base_price. A product with no rows here is single-size.
create table public.product_sizes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  label text not null,
  price_delta numeric(10, 2) not null default 0,
  sort_order integer not null default 0
);

create index product_sizes_product_id_idx on public.product_sizes(product_id);
