-- ============================================================
-- SARBURGER — Migration: Replace menu with real items
-- WARNING: Clears all existing orders + menu items
-- Run in Supabase > SQL Editor
-- ============================================================

delete from order_items;
delete from orders;
delete from menu_items;

insert into menu_items (category, name, description, price, image, is_active) values
  -- BURGERS
  ('burgers',    'The Naked Smash',             'Freshly smashed beef patty, NO CHEESE, SAR sauce on a toasted potato bun',                                                                      600,  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&fit=crop&q=80', true),
  ('burgers',    'Smash Burger',                'Freshly smashed beef patty, Cheddar Cheese, SAR sauce on a toasted potato bun',                                                                 690,  'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&fit=crop&q=80', true),
  ('burgers',    'Onion Smash Burger',          'Smashed beef patty with thinly sliced onions pressed in as it cooks, Cheddar cheese, SAR sauce on a toasted potato bun',                       690,  'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&fit=crop&q=80', true),
  ('burgers',    'BBQ Smash Burger',            'Freshly smashed beef patty, Cheddar cheese, SAR BBQ sauce on a toasted potato bun',                                                             790,  'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=600&fit=crop&q=80', true),
  ('burgers',    'Butter Smash Burger',         'Smashed beef patty seared in butter for extra crispiness and flavor, Cheddar cheese, SAR sauce on a toasted potato bun',                       790,  'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&fit=crop&q=80', true),
  ('burgers',    'Thick Beef Burger',           'A thick beef patty, Cheddar Cheese, SAR sauce on a toasted potato bun',                                                                         790,  'https://images.unsplash.com/photo-1561758033-7e924f619b47?w=600&fit=crop&q=80', true),
  -- SANDWICHES
  ('sandwiches', 'Philly Cheese Steak',         'Tender thin-sliced Prime cut beef, grilled with onions and smothered in melted cheese on a toasted hoagie roll. Served with crispy fries',     850,  'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=600&fit=crop&q=80', true),
  ('sandwiches', 'Chicken Philly Cheese Steak', 'Grilled seasoned chicken breast, grilled with onions, melted cheese on a toasted hoagie roll. Served with crispy fries',                       890,  'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&fit=crop&q=80', true),
  ('sandwiches', 'Tuna Salad Sandwich',         'Fresh flaky tuna with crisp celery and mustard on a baguette with salad and tomato. Add mayo and cheese on request',                           650,  'https://images.unsplash.com/photo-1540914124281-342587941389?w=600&fit=crop&q=80', true),
  -- COCKTAILS (Alcohol Free)
  ('cocktails',  'Lemonade Breeze',             'Fresh lemonade with a cool breeze of mint and citrus',                                                                                          250,  'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&fit=crop&q=80', true),
  ('cocktails',  'Cinnamon Cooler',             'A warm spice meets cool refreshment in this signature blend',                                                                                    300,  'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&fit=crop&q=80', true),
  ('cocktails',  'Ginger Delight',              'Zingy fresh ginger with citrus and a hint of honey',                                                                                            290,  'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&fit=crop&q=80', true),
  ('cocktails',  'Rosemary''s Secret',          'Herb-infused refreshment with rosemary and citrus zest',                                                                                        290,  'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=600&fit=crop&q=80', true),
  ('cocktails',  'Strawberry Sunset',           'Ripe strawberries blended with citrus for a gorgeous sunset sip',                                                                               300,  'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600&fit=crop&q=80', true),
  ('cocktails',  'Thyme to Shine',              'Garden-fresh thyme with lemon and sparkling water',                                                                                             290,  'https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=600&fit=crop&q=80', true),
  ('cocktails',  'SAR Special',                 'The house signature — our chef''s secret recipe mocktail',                                                                                      350,  'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&fit=crop&q=80', true),
  -- COFFEE
  ('coffee',     'Ice Tea',                     'Perfectly brewed tea served over ice',                                                                                                          150,  'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&fit=crop&q=80', true),
  ('coffee',     'Ice Latte',                   'Rich espresso over milk and ice — smooth and bold',                                                                                             200,  'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&fit=crop&q=80', true),
  ('coffee',     'Ice Moca',                    'Espresso blended with chocolate and cold milk over ice',                                                                                        250,  'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&fit=crop&q=80', true),
  ('coffee',     'Ice Caramel',                 'Sweet caramel latte chilled over ice with a caramel drizzle',                                                                                   250,  'https://images.unsplash.com/photo-1542990253-a781e3585bf7?w=600&fit=crop&q=80', true),
  ('coffee',     'Ice Tea Americano',           'Double shot Americano poured over ice for a clean strong kick',                                                                                 180,  'https://images.unsplash.com/photo-1485808191679-5f86510bd652?w=600&fit=crop&q=80', true),
  -- DRINKS
  ('drinks',     'Water',                       'Chilled still water',                                                                                                                           95,   'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&fit=crop&q=80', true),
  ('drinks',     'Sprite',                      'Ice cold Sprite',                                                                                                                               95,   'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=600&fit=crop&q=80', true),
  ('drinks',     'Coca Cola',                   'Ice cold Coca-Cola',                                                                                                                            95,   'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600&fit=crop&q=80', true),
  ('drinks',     'Novida',                      'Refreshing Novida soft drink',                                                                                                                  95,   'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&fit=crop&q=80', true),
  ('drinks',     'Ambo Water',                  'Ethiopian natural mineral water',                                                                                                               95,   'https://images.unsplash.com/photo-1559839914-17aae19cec71?w=600&fit=crop&q=80', true);
