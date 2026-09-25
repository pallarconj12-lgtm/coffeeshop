create table public.customers (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  phone text,
  created_at timestamptz not null default now()
);
