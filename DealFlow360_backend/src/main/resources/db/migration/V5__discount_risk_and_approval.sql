-- Iteration 4: Discount Risk & Approval Schema Migration

-- 1. DISCOUNT_TIERS Table
CREATE TABLE discount_tiers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    max_discount_percent NUMERIC(5, 2) NOT NULL DEFAULT 0.00
);

-- Foreign Key Constraints for existing discount_tier_id columns in customers and price_lists
ALTER TABLE customers
    ADD CONSTRAINT fk_customers_discount_tier
    FOREIGN KEY (discount_tier_id) REFERENCES discount_tiers(id) ON DELETE SET NULL;

ALTER TABLE price_lists
    ADD CONSTRAINT fk_price_lists_discount_tier
    FOREIGN KEY (discount_tier_id) REFERENCES discount_tiers(id) ON DELETE SET NULL;

-- 2. CATEGORY_DISCOUNT_CEILINGS Table
CREATE TABLE category_discount_ceilings (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES product_categories(id) ON DELETE CASCADE,
    tier_id BIGINT NOT NULL REFERENCES discount_tiers(id) ON DELETE CASCADE,
    max_discount_percent NUMERIC(5, 2) NOT NULL,
    CONSTRAINT uk_category_discount_ceilings_category_tier UNIQUE (category_id, tier_id)
);

-- 3. APPROVAL_CHAIN_RULES Table
CREATE TABLE approval_chain_rules (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    customer_id BIGINT REFERENCES customers(id) ON DELETE CASCADE,
    tier_id BIGINT REFERENCES discount_tiers(id) ON DELETE SET NULL,
    min_discount_percent NUMERIC(5, 2),
    min_total_amount NUMERIC(15, 2)
);

-- 4. APPROVAL_CHAIN_STEPS Table
CREATE TABLE approval_chain_steps (
    id BIGSERIAL PRIMARY KEY,
    rule_id BIGINT NOT NULL REFERENCES approval_chain_rules(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    role VARCHAR(100) NOT NULL,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT uk_approval_chain_steps_rule_step UNIQUE (rule_id, step_number)
);

-- 5. APPROVALS Table
CREATE TABLE approvals (
    id BIGSERIAL PRIMARY KEY,
    quotation_id BIGINT NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
    approver_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    step_number INT NOT NULL DEFAULT 1,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    decision_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    decided_at TIMESTAMPTZ
);

-- Indexes for Foreign Keys, lookup fields, and approval query paths
CREATE INDEX idx_category_discount_ceilings_category_id ON category_discount_ceilings(category_id);
CREATE INDEX idx_category_discount_ceilings_tier_id ON category_discount_ceilings(tier_id);

CREATE INDEX idx_approval_chain_rules_customer_id ON approval_chain_rules(customer_id);
CREATE INDEX idx_approval_chain_rules_tier_id ON approval_chain_rules(tier_id);

CREATE INDEX idx_approval_chain_steps_rule_id ON approval_chain_steps(rule_id);
CREATE INDEX idx_approval_chain_steps_user_id ON approval_chain_steps(user_id);

CREATE INDEX idx_approvals_quotation_id ON approvals(quotation_id);
CREATE INDEX idx_approvals_approver_id ON approvals(approver_id);
CREATE INDEX idx_approvals_status ON approvals(status);
