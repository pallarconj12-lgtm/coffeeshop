-- Explicit Data API grants. Since Oct 30 2025, Supabase no longer
-- auto-grants Data API access to new tables on a fresh schema apply
-- (a local `supabase db reset`, a new preview branch, or a new project).
-- RLS (007_rls_policies.sql) remains the real access control layer —
-- these grants just let PostgREST reach the tables at all.

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on table
  public.staff_users,
  public.categories,
  public.products,
  public.product_sizes,
  public.customers,
  public.orders,
  public.order_items,
  public.settings
to anon, authenticated;
