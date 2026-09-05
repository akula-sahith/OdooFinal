-- Iteration 7: Subscription & Billing Schema Migration

-- 1. SUBSCRIPTION_PLANS Table
CREATE TABLE subscription_plans (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    billing_cycle VARCHAR(50) NOT NULL DEFAULT 'MONTHLY', -- MONTHLY, QUARTERLY, YEARLY
    proration_rule VARCHAR(100) NOT NULL DEFAULT 'EXACT_DAY',
    cancellation_refund_rule VARCHAR(100) NOT NULL DEFAULT 'PRO_RATA'
);

-- 2. SUBSCRIPTIONS Table
CREATE TABLE subscriptions (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id) ON DELETE SET NULL,
    customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    plan_id BIGINT NOT NULL REFERENCES subscription_plans(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, PAUSED, CANCELLED, EXPIRED
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. SUBSCRIPTION_BILLING_SCHEDULE Table
CREATE TABLE subscription_billing_schedule (
    id BIGSERIAL PRIMARY KEY,
    subscription_id BIGINT NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    billing_date TIMESTAMPTZ NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' -- PENDING, INVOICED, PAID, CANCELLED
);

-- 4. INVOICES Table
CREATE TABLE invoices (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id) ON DELETE SET NULL,
    customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT', -- DRAFT, ISSUED, PAID, PARTIALLY_PAID, OVERDUE, VOID
    subtotal_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. PAYMENTS Table
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    invoice_id BIGINT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'CREDIT_CARD',
    amount NUMERIC(15, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'SUCCESS',
    transaction_reference VARCHAR(255),
    processed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. CREDIT_NOTES Table
CREATE TABLE credit_notes (
    id BIGSERIAL PRIMARY KEY,
    invoice_id BIGINT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    amount NUMERIC(15, 2) NOT NULL,
    reason TEXT NOT NULL,
    discount_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Foreign Keys and lookups
CREATE INDEX idx_subscription_plans_product_id ON subscription_plans(product_id);
CREATE INDEX idx_subscriptions_customer_id ON subscriptions(customer_id);
CREATE INDEX idx_subscriptions_order_id ON subscriptions(order_id);
CREATE INDEX idx_subscriptions_plan_id ON subscriptions(plan_id);
CREATE INDEX idx_subscription_billing_schedule_sub_id ON subscription_billing_schedule(subscription_id);
CREATE INDEX idx_invoices_order_id ON invoices(order_id);
CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX idx_credit_notes_invoice_id ON credit_notes(invoice_id);
