insert into public.categories (name, slug, sort_order) values
  ('Espresso', 'espresso', 1),
  ('Cold Brew', 'cold-brew', 2),
  ('Pour Over', 'pour-over', 3),
  ('Whole Bean', 'whole-bean', 4),
  ('Pastries', 'pastries', 5);

insert into public.products (category_id, name, slug, description, roast, base_price, stock_quantity, is_active, is_featured)
select id, 'Classic Espresso', 'classic-espresso', 'Double shot, rich crema, notes of dark chocolate.', 'dark', 130, 999, true, true
from public.categories where slug = 'espresso';

insert into public.products (category_id, name, slug, description, roast, base_price, stock_quantity, is_active, is_featured)
select id, 'Vanilla Oat Latte', 'vanilla-oat-latte', 'Espresso, steamed oat milk, house vanilla syrup.', 'medium', 175, 999, true, true
from public.categories where slug = 'espresso';

insert into public.products (category_id, name, slug, description, roast, base_price, stock_quantity, is_active, is_featured)
select id, 'Nitro Cold Brew', 'nitro-cold-brew', 'Steeped 18 hours, nitrogen-charged for a creamy pour.', 'medium', 160, 999, true, true
from public.categories where slug = 'cold-brew';

insert into public.products (category_id, name, slug, description, roast, base_price, stock_quantity, is_active, is_featured)
select id, 'Ethiopia Yirgacheffe', 'ethiopia-yirgacheffe', 'Bright, floral, single-origin pour over.', 'light', 190, 999, true, false
from public.categories where slug = 'pour-over';

insert into public.products (category_id, name, slug, description, roast, base_price, stock_quantity, is_active, is_featured)
select id, 'House Blend Beans (250g)', 'house-blend-beans-250g', 'Our everyday blend, whole bean, roasted weekly.', 'medium', 420, 200, true, false
from public.categories where slug = 'whole-bean';

insert into public.products (category_id, name, slug, description, base_price, stock_quantity, is_active, is_featured)
select id, 'Butter Croissant', 'butter-croissant', 'Laminated daily, baked fresh each morning.', 95, 50, true, false
from public.categories where slug = 'pastries';

-- Sizes for the drink-based products
insert into public.product_sizes (product_id, label, price_delta, sort_order)
select id, unnest(array['Small', 'Medium', 'Large']), unnest(array[0, 20, 40]), unnest(array[1, 2, 3])
from public.products where slug in ('classic-espresso', 'vanilla-oat-latte', 'nitro-cold-brew', 'ethiopia-yirgacheffe');
