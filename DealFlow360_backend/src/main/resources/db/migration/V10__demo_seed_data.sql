-- Iteration 9: Initial Realistic Master Data Seeding for Demo & Frontend Integration

-- 1. SALES TEAMS
INSERT INTO sales_teams (id, name) VALUES
(1, 'Enterprise Sales East'),
(2, 'Global Commercial Accounts')
ON CONFLICT (id) DO NOTHING;

-- 2. DISCOUNT TIERS
INSERT INTO discount_tiers (id, name, max_discount_percent) VALUES
(1, 'BRONZE', 10.00),
(2, 'SILVER', 15.00),
(3, 'GOLD', 25.00)
ON CONFLICT (id) DO NOTHING;

-- 3. CUSTOMERS
INSERT INTO customers (id, company_name, sales_team_id, discount_tier_id, portal_email, portal_password_hash) VALUES
(1, 'Acme Technologies Inc.', 1, 3, 'procurement@acmetech.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6'),
(2, 'Vertex Manufacturing Corp.', 2, 2, 'buying@vertexmfg.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6'),
(3, 'Nova Retail Systems', 1, 1, 'info@novaretail.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6')
ON CONFLICT (id) DO NOTHING;

-- 4. CUSTOMER CONTACTS
INSERT INTO customer_contacts (id, customer_id, name, email, phone, status) VALUES
(1, 1, 'John Doe', 'john.doe@acmetech.com', '+1-555-0192', 'ACTIVE'),
(2, 2, 'Jane Smith', 'jane.smith@vertexmfg.com', '+1-555-0183', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- 5. PRODUCT CATEGORIES
INSERT INTO product_categories (id, name) VALUES
(1, 'Cloud Software & SaaS'),
(2, 'Enterprise Hardware & Servers'),
(3, 'Consulting Services')
ON CONFLICT (id) DO NOTHING;

-- 6. PRODUCTS
INSERT INTO products (id, name, category_id, base_price, tax_percent, currency, is_subscription) VALUES
(1, 'DealFlow360 ERP Cloud Suite', 1, 12000.00, 18.00, 'USD', TRUE),
(2, 'Analytics & AI Insights Add-on', 1, 3600.00, 18.00, 'USD', TRUE),
(3, 'High-Performance Edge Rack Server', 2, 8500.00, 18.00, 'USD', FALSE),
(4, 'Implementation & Onboarding Package', 3, 5000.00, 18.00, 'USD', FALSE)
ON CONFLICT (id) DO NOTHING;

-- 7. PRODUCT VARIANTS
INSERT INTO product_variants (id, product_id, attribute_name, value, extra_price) VALUES
(1, 3, 'Warranty', 'Extended 3-Year On-Site Warranty', 1200.00)
ON CONFLICT (id) DO NOTHING;

-- 8. WAREHOUSES
INSERT INTO warehouses (id, name, location, shipping_weight_factor) VALUES
(1, 'US East Primary Fulfillment Center', 'New York, NY', 1.00),
(2, 'US West Secondary Fulfillment Center', 'San Jose, CA', 1.15)
ON CONFLICT (id) DO NOTHING;

-- 9. STOCK
INSERT INTO stock (id, warehouse_id, product_id, on_hand_amount, reserved_amount) VALUES
(1, 1, 1, 9999, 0),
(2, 1, 3, 50, 5),
(3, 2, 3, 30, 2)
ON CONFLICT (id) DO NOTHING;

-- 10. PRICE LISTS & ITEMS
INSERT INTO price_lists (id, discount_tier_id, currency, valid_from, valid_to) VALUES
(1, 3, 'USD', CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP + INTERVAL '365 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO price_list_items (id, price_list_id, product_id, product_variant_id, unit_price, min_quantity) VALUES
(1, 1, 1, NULL, 12000.00, 1),
(2, 1, 2, NULL, 3600.00, 1),
(3, 1, 3, NULL, 8500.00, 1),
(4, 1, 4, NULL, 5000.00, 1)
ON CONFLICT (id) DO NOTHING;

-- 11. UPSELL RULES
INSERT INTO upsell_rules (id, base_product_id, suggested_product_id, is_promoted, min_margin_threshold) VALUES
(1, 1, 2, TRUE, 20.00)
ON CONFLICT (id) DO NOTHING;

-- 12. CATEGORY DISCOUNT CEILINGS
INSERT INTO category_discount_ceilings (id, category_id, tier_id, max_discount_percent) VALUES
(1, 1, 1, 20.00),
(2, 2, 2, 15.00),
(3, 3, 3, 10.00)
ON CONFLICT (id) DO NOTHING;

-- 13. APPROVAL CHAIN RULES & STEPS
INSERT INTO approval_chain_rules (id, name, min_discount_percent, min_total_amount) VALUES
(1, 'High Value / High Discount Rule', 15.00, 10000.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO approval_chain_steps (id, rule_id, step_number, role) VALUES
(1, 1, 1, 'SALES_MANAGER'),
(2, 1, 2, 'FINANCE')
ON CONFLICT (id) DO NOTHING;

-- Reset sequence values so new inserts don't collide
SELECT setval('sales_teams_id_seq', (SELECT MAX(id) FROM sales_teams));
SELECT setval('discount_tiers_id_seq', (SELECT MAX(id) FROM discount_tiers));
SELECT setval('customers_id_seq', (SELECT MAX(id) FROM customers));
SELECT setval('customer_contacts_id_seq', (SELECT MAX(id) FROM customer_contacts));
SELECT setval('product_categories_id_seq', (SELECT MAX(id) FROM product_categories));
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('product_variants_id_seq', (SELECT MAX(id) FROM product_variants));
SELECT setval('warehouses_id_seq', (SELECT MAX(id) FROM warehouses));
SELECT setval('stock_id_seq', (SELECT MAX(id) FROM stock));
SELECT setval('price_lists_id_seq', (SELECT MAX(id) FROM price_lists));
SELECT setval('price_list_items_id_seq', (SELECT MAX(id) FROM price_list_items));
SELECT setval('upsell_rules_id_seq', (SELECT MAX(id) FROM upsell_rules));
SELECT setval('category_discount_ceilings_id_seq', (SELECT MAX(id) FROM category_discount_ceilings));
SELECT setval('approval_chain_rules_id_seq', (SELECT MAX(id) FROM approval_chain_rules));
SELECT setval('approval_chain_steps_id_seq', (SELECT MAX(id) FROM approval_chain_steps));
