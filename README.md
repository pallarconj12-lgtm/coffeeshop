# Third Wave Coffee Co. — Storefront + Admin System

Full-stack coffee shop storefront + admin management system. Next.js 15 (App
Router) + TypeScript + Tailwind + shadcn/ui-style components + Supabase
(Postgres, Auth, RLS).

## Stack
- Next.js 15, App Router, TypeScript, Tailwind CSS v4
- shadcn/ui-pattern components (hand-built — no external registry dependency,
  functionally identical, safe to also run `npx shadcn add <component>` later)
- Supabase: Postgres + Auth + Row Level Security
- Server Actions for all writes (no separate API layer needed for CRUD)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project URL + keys
```

### Database

1. Create a Supabase project.
2. Run the migrations in order (`supabase/migrations/001...` through
   `008...`) against it — either via the Supabase SQL editor, or with the CLI:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

3. (Optional) Run `supabase/seed.sql` for sample categories/products so the
   storefront isn't empty during development.

### Creating the first admin (owner) account

`staff_users` rows are what grant `/admin` access, and — by design — only an
existing `owner` can create another staff account (see
`007_rls_policies.sql`). That means the very first one has to be created
manually, once:

1. Sign up a normal account through Supabase Auth (either via your app's
   `/register` — note that inserts into `customers`, not `staff_users` — or
   directly in the Supabase dashboard under Authentication → Users → Add
   User).
2. In the Supabase SQL editor (which runs as `postgres` and bypasses RLS),
   run:

   ```sql
   insert into public.staff_users (id, email, full_name, role)
   values ('<the user''s auth.users id>', '<their email>', '<their name>', 'owner');
   ```

3. That account can now sign in at `/admin/login`, and can create further
   staff accounts by inserting into `staff_users` from the admin panel (or
   directly via SQL — there's no staff-management UI yet).

### Running locally

```bash
npm run dev
```

## What's here vs. what's not (yet)

This covers the core loop: browsing, cart, checkout, order creation, and an
admin panel for products/categories/orders/customers/settings. It does
**not** yet include (unlike a larger system this was modeled after):
coupons, supplier/purchase tracking, expense tracking, reviews, or an audit
log. Those are straightforward to add as their own migration + admin page if
you need them.
