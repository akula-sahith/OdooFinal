-- Iteration 11: Seed Data for Use Cases 1, 2, and 3 (Laptops, Stock Splits, Subscriptions, Negotiation)

-- 1. PRODUCTS FOR USE CASES
INSERT INTO products (id, name, category_id, base_price, tax_percent, currency, is_subscription) VALUES
(10, 'Business Laptop Pro 15"', 2, 1000.00, 18.00, 'USD', FALSE),
(11, 'Ergonomic Laptop Carrying Bag', 2, 50.00, 18.00, 'USD', FALSE),
(12, 'UltraWide 4K Monitor 27"', 2, 300.00, 18.00, 'USD', FALSE),
(13, 'Annual Enterprise Support Subscription', 1, 1200.00, 18.00, 'USD', TRUE),
(14, 'Premium 24/7 Support Subscription', 1, 2400.00, 18.00, 'USD', TRUE)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    category_id = EXCLUDED.category_id,
    base_price = EXCLUDED.base_price,
    is_subscription = EXCLUDED.is_subscription;

-- 2. STOCK LEVELS (Warehouse 1 = 30 Laptops, Warehouse 2 = 20 Laptops for exact 50 split test)
INSERT INTO stock (id, warehouse_id, product_id, on_hand_amount, reserved_amount) VALUES
(10, 1, 10, 30, 0),
(11, 2, 10, 20, 0),
(12, 1, 11, 100, 0),
(13, 2, 11, 100, 0),
(14, 1, 12, 50, 0),
(15, 2, 12, 50, 0)
ON CONFLICT (warehouse_id, product_id) DO UPDATE SET 
    on_hand_amount = EXCLUDED.on_hand_amount,
    reserved_amount = EXCLUDED.reserved_amount;

-- 3. PRICE LIST ITEMS FOR PRICE LIST 1
INSERT INTO price_list_items (id, price_list_id, product_id, product_variant_id, unit_price, min_quantity) VALUES
(10, 1, 10, NULL, 1000.00, 1),
(11, 1, 11, NULL, 50.00, 1),
(12, 1, 12, NULL, 300.00, 1),
(13, 1, 13, NULL, 1200.00, 1),
(14, 1, 14, NULL, 2400.00, 1)
ON CONFLICT (id) DO UPDATE SET unit_price = EXCLUDED.unit_price;

-- 4. HARDWARE CATEGORY DISCOUNT CEILINGS (Hardware category_id = 2)
INSERT INTO category_discount_ceilings (id, category_id, tier_id, max_discount_percent) VALUES
(10, 2, 1, 10.00), -- Bronze tier Hardware ceiling 10%
(11, 2, 2, 12.00), -- Silver tier Hardware ceiling 12%
(12, 2, 3, 15.00)  -- Gold tier Hardware ceiling 15%
ON CONFLICT (category_id, tier_id) DO UPDATE SET max_discount_percent = EXCLUDED.max_discount_percent;

-- Reset sequence numbers
SELECT setval('products_id_seq', GREATEST((SELECT MAX(id) FROM products), 20));
SELECT setval('stock_id_seq', GREATEST((SELECT MAX(id) FROM stock), 20));
SELECT setval('price_list_items_id_seq', GREATEST((SELECT MAX(id) FROM price_list_items), 20));
SELECT setval('category_discount_ceilings_id_seq', GREATEST((SELECT MAX(id) FROM category_discount_ceilings), 20));
