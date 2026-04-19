-- ============================================================
-- SARBURGER — Supabase Schema
-- Paste this entire file into Supabase > SQL Editor > Run
-- ============================================================

-- ── TABLES ───────────────────────────────────────────────────

create table if not exists menu_items (
  id            bigint primary key generated always as identity,
  category      text not null check (category in ('burgers','sides','drinks','combos')),
  name          text not null,
  description   text not null,
  price         integer,
  saving_label  text,
  image         text not null,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists orders (
  id              bigint primary key generated always as identity,
  customer_name   text not null,
  customer_phone  text not null,
  notes           text,
  status          text not null default 'pending'
                  check (status in ('pending','confirmed','ready','done','cancelled')),
  total           integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists order_items (
  id            bigint primary key generated always as identity,
  order_id      bigint not null references orders(id) on delete cascade,
  menu_item_id  bigint not null references menu_items(id),
  quantity      integer not null default 1,
  price         integer not null
);

create table if not exists contacts (
  id          bigint primary key generated always as identity,
  name        text not null,
  contact     text not null,
  message     text not null,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ── AUTO-UPDATE updated_at ────────────────────────────────────

create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create or replace trigger menu_items_updated_at
  before update on menu_items
  for each row execute function update_updated_at();

create or replace trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- ── ROW LEVEL SECURITY ───────────────────────────────────────

alter table menu_items  enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;
alter table contacts    enable row level security;

-- Menu: public can read active items; authenticated (admin) can do everything
create policy "public_read_active_menu"   on menu_items for select to anon      using (is_active = true);
create policy "admin_read_all_menu"       on menu_items for select to authenticated using (true);
create policy "admin_insert_menu"         on menu_items for insert to authenticated with check (true);
create policy "admin_update_menu"         on menu_items for update to authenticated using (true);
create policy "admin_delete_menu"         on menu_items for delete to authenticated using (true);

-- Orders: public can insert; authenticated can read/update
create policy "public_place_order"        on orders for insert to anon          with check (true);
create policy "admin_read_orders"         on orders for select to authenticated  using (true);
create policy "admin_update_orders"       on orders for update to authenticated  using (true);

-- Order items: public can insert (with order); authenticated can read
create policy "public_insert_order_items" on order_items for insert to anon     with check (true);
create policy "admin_read_order_items"    on order_items for select to authenticated using (true);

-- Contacts: public can insert; authenticated can read/update
create policy "public_submit_contact"     on contacts for insert to anon        with check (true);
create policy "admin_read_contacts"       on contacts for select to authenticated using (true);
create policy "admin_update_contacts"     on contacts for update to authenticated using (true);

-- ── SEED MENU DATA ───────────────────────────────────────────

insert into menu_items (category, name, description, price, saving_label, image) values
  ('burgers','Classic Smash',   'Double smash patty, american cheese, pickles, special sauce', 280,  null, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&auto=format'),
  ('burgers','Spicy Volcano',   'Jalapeño, pepper jack, crispy onions, sriracha mayo',          320,  null, 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop&auto=format'),
  ('burgers','BBQ Smokehouse',  'Pulled beef, cheddar, coleslaw, BBQ glaze',                   350,  null, 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop&auto=format'),
  ('burgers','Mushroom Swiss',  'Sautéed mushrooms, swiss cheese, garlic aioli',               300,  null, 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop&auto=format'),
  ('burgers','The OG',          'Simple classic: lettuce, tomato, onion, house sauce',         240,  null, 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop&auto=format'),
  ('sides',  'Seasoned Fries',  'Crispy fries with our signature seasoning blend',              80,  null, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop&auto=format'),
  ('sides',  'Loaded Fries',    'Cheese sauce, jalapeños, bacon bits',                         140,  null, 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=400&h=300&fit=crop&auto=format'),
  ('sides',  'Onion Rings',     'Golden-fried rings with dipping sauce',                        90,  null, 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop&auto=format'),
  ('sides',  'Coleslaw',        'Fresh-cut cabbage in creamy house dressing',                   60,  null, 'https://images.unsplash.com/photo-1564834724105-918b73d2af9e?w=400&h=300&fit=crop&auto=format'),
  ('drinks', 'Fresh Juice',     'Orange / Mango / Avocado — made fresh daily',                  70,  null, 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop&auto=format'),
  ('drinks', 'Soft Drinks',     'Coke, Fanta, Sprite — ice cold',                              50,  null, 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=300&fit=crop&auto=format'),
  ('drinks', 'Milkshake',       'Vanilla / Chocolate / Strawberry — thick and creamy',        150,  null, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop&auto=format'),
  ('combos', 'Classic Combo',   'Any burger + seasoned fries + soft drink',                   null, 'Save 50 ETB', 'https://images.unsplash.com/photo-1561758033-7e924f619b47?w=400&h=300&fit=crop&auto=format'),
  ('combos', 'Feast Combo',     'Any burger + loaded fries + milkshake',                      null, 'Save 80 ETB', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop&auto=format');
