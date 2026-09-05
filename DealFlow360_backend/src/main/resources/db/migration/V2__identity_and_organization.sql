-- Iteration 1: Identity & Organization Schema Migration

-- 1. SALES_TEAMS Table
CREATE TABLE sales_teams (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- 2. USERS Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    team_id BIGINT REFERENCES sales_teams(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. CUSTOMERS Table
CREATE TABLE customers (
    id BIGSERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    sales_team_id BIGINT REFERENCES sales_teams(id) ON DELETE SET NULL,
    discount_tier_id BIGINT,
    portal_email VARCHAR(255),
    portal_password_hash VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. CUSTOMER_CONTACTS Table
CREATE TABLE customer_contacts (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE'
);

-- Indexes for Foreign Keys and frequent lookup paths
CREATE INDEX idx_users_team_id ON users(team_id);
CREATE INDEX idx_customers_sales_team_id ON customers(sales_team_id);
CREATE INDEX idx_customers_discount_tier_id ON customers(discount_tier_id);
CREATE INDEX idx_customer_contacts_customer_id ON customer_contacts(customer_id);
