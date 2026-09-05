-- Iteration 8: Deal Health, Anomaly & Audit Schema Migration

-- 1. AUDIT_LOG Table
CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(100) NOT NULL,
    entity_id BIGINT NOT NULL,
    action VARCHAR(100) NOT NULL,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    changes_json TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. DEAL_HEALTH_ALERTS Table
CREATE TABLE deal_health_alerts (
    id BIGSERIAL PRIMARY KEY,
    quotation_id BIGINT NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
    alert_type VARCHAR(100) NOT NULL, -- STALLED_DEAL, DISCOUNT_ANOMALY, DELIVERY_SLIPPAGE
    severity VARCHAR(50) NOT NULL DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, CRITICAL
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, ACKNOWLEDGED, RESOLVED
    triggered_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMPTZ
);

-- 3. Extend NEGOTIATION_REQUESTS Table with counter discount, line comments, and proposed unit price columns
ALTER TABLE negotiation_requests
    ADD COLUMN counter_discount_percent NUMERIC(5, 2),
    ADD COLUMN line_comments TEXT,
    ADD COLUMN proposed_unit_price NUMERIC(15, 2);

-- Indexes for Foreign Keys and query filters
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_deal_health_alerts_quotation_id ON deal_health_alerts(quotation_id);
CREATE INDEX idx_deal_health_alerts_status ON deal_health_alerts(status);
CREATE INDEX idx_deal_health_alerts_alert_type ON deal_health_alerts(alert_type);
