-- Helper functions (SECURITY DEFINER so checking staff_users from within
-- staff_users' own policies doesn't recurse into RLS again).
create or replace function public.is_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.staff_users where id = auth.uid());
$$;

create or replace function public.has_staff_role(roles staff_role[])
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.staff_users where id = auth.uid() and role = any(roles)
  );
$$;

-- categories --------------------------------------------------------------
alter table public.categories enable row level security;

create policy "Public can view categories"
  on public.categories for select
  using (true);

create policy "Staff can manage categories"
  on public.categories for all
  using (public.is_staff())
  with check (public.is_staff());

-- products ------------------------------------------------------------------
alter table public.products enable row level security;

create policy "Public can view active products"
  on public.products for select
  using (is_active = true or public.is_staff());

create policy "Staff can manage products"
  on public.products for all
  using (public.is_staff())
  with check (public.is_staff());

-- product_sizes ---------------------------------------------------------
alter table public.product_sizes enable row level security;

create policy "Public can view product sizes"
  on public.product_sizes for select
  using (true);

create policy "Staff can manage product sizes"
  on public.product_sizes for all
  using (public.is_staff())
  with check (public.is_staff());

-- customers -----------------------------------------------------------------
alter table public.customers enable row level security;

create policy "Customers can view own profile, staff can view all"
  on public.customers for select
  using (id = auth.uid() or public.is_staff());

create policy "Customers can create their own profile"
  on public.customers for insert
  with check (id = auth.uid());

create policy "Customers and managers can update customer profile"
  on public.customers for update
  using (id = auth.uid() or public.has_staff_role(array['owner', 'manager']::staff_role[]))
  with check (id = auth.uid() or public.has_staff_role(array['owner', 'manager']::staff_role[]));

-- orders ----------------------------------------------------------------
alter table public.orders enable row level security;

create policy "Customers view own orders, staff view all"
  on public.orders for select
  using (customer_id = auth.uid() or public.is_staff());

create policy "Customers and guests can place orders"
  on public.orders for insert
  with check (customer_id is null or customer_id = auth.uid());

create policy "Staff can update orders"
  on public.orders for update
  using (public.is_staff())
  with check (public.is_staff());

-- order_items -------------------------------------------------------------
alter table public.order_items enable row level security;

create policy "View items of viewable orders"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.customer_id = auth.uid() or public.is_staff())
    )
  );

create policy "Insert items on your own order"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.customer_id is null or o.customer_id = auth.uid())
    )
  );

create policy "Staff can manage order items"
  on public.order_items for all
  using (public.is_staff())
  with check (public.is_staff());

-- staff_users -------------------------------------------------------------
alter table public.staff_users enable row level security;

create policy "Staff can view staff directory"
  on public.staff_users for select
  using (id = auth.uid() or public.is_staff());

create policy "Owners manage staff accounts"
  on public.staff_users for all
  using (public.has_staff_role(array['owner']::staff_role[]))
  with check (public.has_staff_role(array['owner']::staff_role[]));

-- settings ------------------------------------------------------------------
alter table public.settings enable row level security;

create policy "Public can view settings"
  on public.settings for select
  using (true);

create policy "Managers can update settings"
  on public.settings for update
  using (public.has_staff_role(array['owner', 'manager']::staff_role[]))
  with check (public.has_staff_role(array['owner', 'manager']::staff_role[]));
