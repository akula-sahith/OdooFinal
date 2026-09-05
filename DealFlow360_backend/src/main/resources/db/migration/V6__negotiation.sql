-- Iteration 5: Negotiation Schema Migration

-- 1. NEGOTIATION_REQUESTS Table
CREATE TABLE negotiation_requests (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    quotation_id BIGINT REFERENCES quotations(id) ON DELETE SET NULL,
    request_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Foreign Keys, status filtering, and query performance
CREATE INDEX idx_negotiation_requests_customer_id ON negotiation_requests(customer_id);
CREATE INDEX idx_negotiation_requests_quotation_id ON negotiation_requests(quotation_id);
CREATE INDEX idx_negotiation_requests_status ON negotiation_requests(status);
