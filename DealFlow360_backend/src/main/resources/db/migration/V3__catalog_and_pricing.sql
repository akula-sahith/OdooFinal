-- Iteration 2: Catalog & Pricing Schema Migration

-- 1. PRODUCT_CATEGORIES Table
CREATE TABLE product_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- 2. PRODUCTS Table
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id BIGINT REFERENCES product_categories(id) ON DELETE SET NULL,
    base_price NUMERIC(15, 2) NOT NULL,
    tax_percent NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    is_subscription BOOLEAN NOT NULL DEFAULT FALSE
);

-- 3. PRODUCT_VARIANTS Table
CREATE TABLE product_variants (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    attribute_name VARCHAR(100) NOT NULL,
    value VARCHAR(100) NOT NULL,
    extra_price NUMERIC(15, 2) NOT NULL DEFAULT 0.00
);

-- 4. PRICE_LISTS Table
-- Note: discount_tier_id column is created, but foreign key constraint referencing DISCOUNT_TIERS 
-- will be added in a later migration when the DISCOUNT_TIERS table is created.
CREATE TABLE price_lists (
    id BIGSERIAL PRIMARY KEY,
    discount_tier_id BIGINT,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    valid_from TIMESTAMPTZ,
    valid_to TIMESTAMPTZ
);

-- 5. PRICE_LIST_ITEMS Table
CREATE TABLE price_list_items (
    id BIGSERIAL PRIMARY KEY,
    price_list_id BIGINT NOT NULL REFERENCES price_lists(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    product_variant_id BIGINT REFERENCES product_variants(id) ON DELETE SET NULL,
    unit_price NUMERIC(15, 2) NOT NULL,
    min_quantity INT NOT NULL DEFAULT 1
);

-- 6. UPSELL_RULES Table
CREATE TABLE upsell_rules (
    id BIGSERIAL PRIMARY KEY,
    base_product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    suggested_product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    is_promoted BOOLEAN NOT NULL DEFAULT FALSE,
    min_margin_threshold NUMERIC(5, 2)
);

-- Indexes for Foreign Keys and frequent query paths
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_price_lists_discount_tier_id ON price_lists(discount_tier_id);
CREATE INDEX idx_price_list_items_price_list_id ON price_list_items(price_list_id);
CREATE INDEX idx_price_list_items_product_id ON price_list_items(product_id);
CREATE INDEX idx_price_list_items_product_variant_id ON price_list_items(product_variant_id);
CREATE INDEX idx_upsell_rules_base_product_id ON upsell_rules(base_product_id);
CREATE INDEX idx_upsell_rules_suggested_product_id ON upsell_rules(suggested_product_id);
