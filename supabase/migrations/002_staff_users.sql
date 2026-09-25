create table public.staff_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null default '',
  role staff_role not null default 'staff',
  created_at timestamptz not null default now()
);

comment on table public.staff_users is
  'Admin-panel accounts. A row here (matching an auth.users id) is what
   grants access to /admin — customers never get a row here.';
