create table public.settings (
  key text primary key,
  value text not null default ''
);

insert into public.settings (key, value) values
  ('store_name', 'Third Wave Coffee Co.'),
  ('currency', 'PHP'),
  ('contact_email', 'hello@example.com');
