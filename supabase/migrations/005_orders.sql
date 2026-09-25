create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  status order_status not null default 'pending',
  fulfillment fulfillment_type not null default 'pickup',
  contact_name text not null,
  contact_email text not null,
  contact_phone text,
  delivery_address text,
  notes text,
  subtotal numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  created_at timestamptz not null default now()
);

create index orders_customer_id_idx on public.orders(customer_id);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  size_label text,
  unit_price numeric(10, 2) not null,
  quantity integer not null check (quantity > 0),
  line_total numeric(10, 2) not null
);

create index order_items_order_id_idx on public.order_items(order_id);
