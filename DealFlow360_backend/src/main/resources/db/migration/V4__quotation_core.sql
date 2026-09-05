-- Iteration 3: Quotation Core Schema Migration

-- 1. QUOTATIONS Table
CREATE TABLE quotations (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    price_list_id BIGINT REFERENCES price_lists(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    subtotal_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    valid_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. QUOTATION_LINES Table
CREATE TABLE quotation_lines (
    id BIGSERIAL PRIMARY KEY,
    quotation_id BIGINT NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    product_variant_id BIGINT REFERENCES product_variants(id) ON DELETE SET NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(15, 2) NOT NULL,
    tax_percent NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    subtotal_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00
);

-- 3. QUOTATION_VERSIONS Table
CREATE TABLE quotation_versions (
    id BIGSERIAL PRIMARY KEY,
    quotation_id BIGINT NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    total_amount NUMERIC(15, 2) NOT NULL,
    change_summary VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_quotation_versions_quotation_version UNIQUE (quotation_id, version_number)
);

-- 4. CUSTOMER_REQUESTS Table
CREATE TABLE customer_requests (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    quotation_id BIGINT REFERENCES quotations(id) ON DELETE SET NULL,
    request_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Foreign Keys, status filtering, and relationship query paths
CREATE INDEX idx_quotations_customer_id ON quotations(customer_id);
CREATE INDEX idx_quotations_price_list_id ON quotations(price_list_id);
CREATE INDEX idx_quotations_status ON quotations(status);

CREATE INDEX idx_quotation_lines_quotation_id ON quotation_lines(quotation_id);
CREATE INDEX idx_quotation_lines_product_id ON quotation_lines(product_id);
CREATE INDEX idx_quotation_lines_product_variant_id ON quotation_lines(product_variant_id);

CREATE INDEX idx_quotation_versions_quotation_id ON quotation_versions(quotation_id);

CREATE INDEX idx_customer_requests_customer_id ON customer_requests(customer_id);
CREATE INDEX idx_customer_requests_quotation_id ON customer_requests(quotation_id);
CREATE INDEX idx_customer_requests_status ON customer_requests(status);
