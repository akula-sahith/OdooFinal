-- Iteration 6: Inventory & Fulfillment Schema Migration

-- 1. WAREHOUSES Table
CREATE TABLE warehouses (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    location VARCHAR(255),
    shipping_weight_factor NUMERIC(5, 2) NOT NULL DEFAULT 1.00
);

-- 2. STOCK Table
CREATE TABLE stock (
    id BIGSERIAL PRIMARY KEY,
    warehouse_id BIGINT NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    on_hand_amount INT NOT NULL DEFAULT 0,
    reserved_amount INT NOT NULL DEFAULT 0,
    CONSTRAINT uk_stock_warehouse_product UNIQUE (warehouse_id, product_id),
    CONSTRAINT chk_stock_on_hand CHECK (on_hand_amount >= 0),
    CONSTRAINT chk_stock_reserved CHECK (reserved_amount >= 0)
);

-- 3. ORDERS Table
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    quotation_id BIGINT REFERENCES quotations(id) ON DELETE SET NULL,
    customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    subtotal_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. ORDER_LINES Table
CREATE TABLE order_lines (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    product_variant_id BIGINT REFERENCES product_variants(id) ON DELETE SET NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(15, 2) NOT NULL,
    tax_percent NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    subtotal_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    is_subscription BOOLEAN NOT NULL DEFAULT FALSE
);

-- 5. FULFILLMENT_ORDERS Table
CREATE TABLE fulfillment_orders (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    shipped_at TIMESTAMPTZ
);

-- 6. FULFILLMENT_SPLITS Table
CREATE TABLE fulfillment_splits (
    id BIGSERIAL PRIMARY KEY,
    fulfillment_order_id BIGINT NOT NULL REFERENCES fulfillment_orders(id) ON DELETE CASCADE,
    order_line_id BIGINT NOT NULL REFERENCES order_lines(id) ON DELETE CASCADE,
    warehouse_id BIGINT NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
    quantity_allocated INT NOT NULL DEFAULT 0,
    quantity_shipped INT NOT NULL DEFAULT 0,
    backorder_source VARCHAR(100)
);

-- Indexes for Foreign Keys and frequent lookups
CREATE INDEX idx_stock_warehouse_id ON stock(warehouse_id);
CREATE INDEX idx_stock_product_id ON stock(product_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_quotation_id ON orders(quotation_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_lines_order_id ON order_lines(order_id);
CREATE INDEX idx_order_lines_product_id ON order_lines(product_id);
CREATE INDEX idx_fulfillment_orders_order_id ON fulfillment_orders(order_id);
CREATE INDEX idx_fulfillment_splits_fulfillment_order_id ON fulfillment_splits(fulfillment_order_id);
CREATE INDEX idx_fulfillment_splits_warehouse_id ON fulfillment_splits(warehouse_id);
