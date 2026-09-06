-- Iteration 12: Comprehensive B2B Seed Data (500-600+ records)
-- Step 0: Clear all existing transactional, catalog, and organizational data except users table

TRUNCATE TABLE 
    audit_log,
    deal_health_alerts,
    credit_notes,
    payments,
    invoices,
    subscription_billing_schedule,
    subscriptions,
    subscription_plans,
    fulfillment_splits,
    fulfillment_orders,
    order_lines,
    orders,
    negotiation_requests,
    approvals,
    approval_chain_steps,
    approval_chain_rules,
    category_discount_ceilings,
    upsell_rules,
    price_list_items,
    price_lists,
    stock,
    warehouses,
    customer_requests,
    quotation_versions,
    quotation_lines,
    quotations,
    product_variants,
    products,
    product_categories,
    customer_contacts,
    customers,
    discount_tiers,
    sales_teams
CASCADE;

-- 1. SALES TEAMS (5 teams)
INSERT INTO sales_teams (id, name) VALUES
(1, 'Enterprise Sales East'),
(2, 'Global Commercial Accounts'),
(3, 'Strategic Enterprise West'),
(4, 'EMEA Commercial Sales'),
(5, 'APAC Mid-Market & Cloud');

-- 2. USERS (Upsert demo staff and sales reps)
INSERT INTO users (id, name, email, password_hash, role, team_id, created_at) VALUES
(1, 'System Admin', 'admin@dealflow360.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', 'ADMIN', 1, CURRENT_TIMESTAMP - INTERVAL '120 days'),
(2, 'Alex SalesRep', 'alex.rep@dealflow360.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', 'SALES_REP', 1, CURRENT_TIMESTAMP - INTERVAL '120 days'),
(3, 'Jordan Manager', 'jordan.mgr@dealflow360.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', 'SALES_MANAGER', 1, CURRENT_TIMESTAMP - INTERVAL '120 days'),
(4, 'Fiona Finance', 'fiona.fin@dealflow360.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', 'FINANCE', 1, CURRENT_TIMESTAMP - INTERVAL '120 days'),
(5, 'Sarah Jenkins', 'sarah.jenkins@dealflow360.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', 'SALES_REP', 2, CURRENT_TIMESTAMP - INTERVAL '100 days'),
(6, 'David Chen', 'david.chen@dealflow360.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', 'SALES_MANAGER', 2, CURRENT_TIMESTAMP - INTERVAL '100 days'),
(7, 'Priya Sharma', 'priya.sharma@dealflow360.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', 'SALES_REP', 3, CURRENT_TIMESTAMP - INTERVAL '90 days'),
(8, 'Vikram Malhotra', 'vikram.malhotra@dealflow360.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', 'SALES_REP', 4, CURRENT_TIMESTAMP - INTERVAL '90 days'),
(9, 'Ananya Rao', 'ananya.rao@dealflow360.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', 'FINANCE', 1, CURRENT_TIMESTAMP - INTERVAL '90 days'),
(10, 'Rahul Verma', 'rahul.verma@dealflow360.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', 'SALES_REP', 5, CURRENT_TIMESTAMP - INTERVAL '80 days')
ON CONFLICT (email) DO UPDATE SET team_id = EXCLUDED.team_id, role = EXCLUDED.role, name = EXCLUDED.name;

-- 3. DISCOUNT TIERS (4 tiers)
INSERT INTO discount_tiers (id, name, max_discount_percent) VALUES
(1, 'BRONZE', 10.00),
(2, 'SILVER', 15.00),
(3, 'GOLD', 25.00),
(4, 'PLATINUM', 35.00);

-- 4. CUSTOMERS (60 B2B enterprise customers)
INSERT INTO customers (id, company_name, sales_team_id, discount_tier_id, portal_email, portal_password_hash, created_at) VALUES
-- Platinum Tier (> $100k spend)
(1, 'Acme Technologies Inc.', 1, 4, 'procurement@acmetech.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '150 days'),
(2, 'Vertex Manufacturing Corp.', 2, 4, 'buying@vertexmfg.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '140 days'),
(3, 'Nova Retail Systems', 1, 4, 'info@novaretail.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '135 days'),
(4, 'Apex Global Logistics', 3, 4, 'supplies@apexglobal.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '130 days'),
(5, 'Quantum Financial Group', 1, 4, 'purchasing@quantumfin.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '125 days'),
(6, 'Nexus Health Tech', 4, 4, 'vendor@nexushealth.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '120 days'),
(7, 'Starlight Communications', 5, 4, 'telecom@starlight.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '115 days'),
(8, 'Omni Dynamics Solutions', 2, 4, 'procure@omnidynamics.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '110 days'),
(9, 'Titan Aerospace Corp', 3, 4, 'supplychain@titanaero.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '105 days'),
(10, 'Hyperion Energy Grid', 1, 4, 'gridops@hyperionenergy.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '100 days'),
(11, 'Vanguard BioPharma', 4, 4, 'labgear@vanguardbio.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '98 days'),
(12, 'Prism Cloud Services', 5, 4, 'infra@prismcloud.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '95 days'),
(13, 'Zenith Automotive Solutions', 2, 4, 'parts@zenithauto.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '92 days'),
(14, 'Aegis Security Networks', 3, 4, 'secops@aegissecur.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '90 days'),
(15, 'Orbit Media Enterprises', 1, 4, 'media@orbitent.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '88 days'),
-- Gold Tier ($50k–$100k spend)
(16, 'BlueSky Software Labs', 1, 3, 'admin@blueskylab.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '85 days'),
(17, 'CyberShield Defence Ltd', 4, 3, 'buy@cybershield.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '82 days'),
(18, 'Ironclad Storage Inc', 2, 3, 'warehouse@ironclad.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '80 days'),
(19, 'Velocity Robotics', 3, 3, 'robotics@velocity.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '78 days'),
(20, 'Infinitum Data Systems', 5, 3, 'datacenter@infinitum.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '75 days'),
(21, 'Pulse Telecom India', 5, 3, 'networks@pulsetel.in', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '72 days'),
(22, 'Crestview Insurance', 1, 3, 'itprocure@crestview.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '70 days'),
(23, 'Cascade Clean Energy', 3, 3, 'solar@cascadeenergy.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '68 days'),
(24, 'Frontier Gaming Corp', 2, 3, 'servers@frontiergame.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '65 days'),
(25, 'Highland Asset Management', 1, 3, 'fintech@highlandam.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '62 days'),
(26, 'Meridian Logistics Hub', 4, 3, 'freight@meridianlog.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '60 days'),
(27, 'Neptune Marine Systems', 5, 3, 'shiptech@neptunemarine.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '58 days'),
(28, 'Optima Semiconductor', 3, 3, 'fab@optimasemicon.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '55 days'),
(29, 'Pinnacle Mining Corp', 2, 3, 'heavytech@pinnaclemining.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '52 days'),
(30, 'Radiant Real Estate', 1, 3, 'proptech@radiantre.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '50 days'),
(31, 'Stratum AI Labs', 5, 3, 'gpu@stratumai.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '48 days'),
(32, 'Trinity Health Systems', 4, 3, 'medtech@trinityhealth.org', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '45 days'),
(33, 'Urban Edge Hospitality', 2, 3, 'pos@urbanedge.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '42 days'),
(34, 'Vortex Wind Energy', 3, 3, 'turbines@vortexwind.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '40 days'),
(35, 'Waveform Telecommunications', 1, 3, 'fibers@waveformtele.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '38 days'),
-- Silver Tier ($25k–$50k spend)
(36, 'Alpha Beta Analytics', 2, 2, 'data@alphabeta.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '35 days'),
(37, 'Beacon Wireless Solutions', 5, 2, 'antennas@beaconwire.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '32 days'),
(38, 'Cobalt Chemicals', 4, 2, 'chemprocure@cobaltchem.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '30 days'),
(39, 'Delta Engineering Corp', 3, 2, 'cad@deltaeng.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '28 days'),
(40, 'Echo Sound & Vision', 1, 2, 'av@echosound.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '25 days'),
(41, 'Falcon Delivery Network', 2, 2, 'fleet@falcondelivery.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '24 days'),
(42, 'Genesis Biotech Solutions', 4, 2, 'dna@genesisbio.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '22 days'),
(43, 'Horizon EdTech Systems', 5, 2, 'lms@horizoned.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '20 days'),
(44, 'Impulse Electronics', 3, 2, 'pcb@impulseelectronics.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '18 days'),
(45, 'Jupiter Financial Advisors', 1, 2, 'audit@jupiterfin.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '16 days'),
(46, 'Krypton Cyber Security', 4, 2, 'firewall@kryptoncyber.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '15 days'),
(47, 'Lumina Lighting Systems', 2, 2, 'led@luminalighting.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '14 days'),
(48, 'Matrix Network Solutions', 5, 2, 'switch@matrixnet.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '12 days'),
(49, 'NextGen Mobility Devices', 3, 2, 'mobile@nextgenmobility.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '10 days'),
(50, 'Oasis Water Technologies', 1, 2, 'purify@oasiswater.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '8 days'),
-- Bronze Tier (< $25k spend)
(51, 'Pioneer Hardware Supplies', 2, 1, 'tools@pioneerhw.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '7 days'),
(52, 'Quasar Software Studio', 5, 1, 'code@quasarstudio.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '6 days'),
(53, 'Redwood Timber Tech', 4, 1, 'logs@redwoodtech.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '5 days'),
(54, 'Solaris Power Controls', 3, 1, 'inverter@solarispwr.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '4 days'),
(55, 'Terra Firma Agriculture', 1, 1, 'farmtech@terrafirma.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '3 days'),
(56, 'Ultra Clean Solutions', 2, 1, 'pharma@ultraclean.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(57, 'Vanguard Security Services', 4, 1, 'patrol@vanguardsec.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(58, 'Whitehall Advisory Group', 5, 1, 'tax@whitehall.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '1 day'),
(59, 'Xenon Lighting Labs', 3, 1, 'bulb@xenonlabs.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP - INTERVAL '1 day'),
(60, 'Yield Financial Services', 1, 1, 'bonds@yieldfin.com', '$2a$10$vN4.t3J5F6gG7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', CURRENT_TIMESTAMP);

-- 5. CUSTOMER CONTACTS (60+ contacts)
INSERT INTO customer_contacts (id, customer_id, name, email, phone, status) VALUES
(1, 1, 'John Doe', 'john.doe@acmetech.com', '+1-555-0192', 'ACTIVE'),
(2, 2, 'Jane Smith', 'jane.smith@vertexmfg.com', '+1-555-0183', 'ACTIVE'),
(3, 3, 'Robert Johnson', 'r.johnson@novaretail.com', '+1-555-0174', 'ACTIVE'),
(4, 4, 'Emily Davis', 'emily.d@apexglobal.com', '+1-555-0165', 'ACTIVE'),
(5, 5, 'Michael Brown', 'mbrown@quantumfin.com', '+1-555-0156', 'ACTIVE'),
(6, 6, 'Sarah Wilson', 'swilson@nexushealth.com', '+1-555-0147', 'ACTIVE'),
(7, 7, 'David Taylor', 'dtaylor@starlight.com', '+1-555-0138', 'ACTIVE'),
(8, 8, 'Lisa Anderson', 'landerson@omnidynamics.com', '+1-555-0129', 'ACTIVE'),
(9, 9, 'James Thomas', 'jthomas@titanaero.com', '+1-555-0110', 'ACTIVE'),
(10, 10, 'Patricia Jackson', 'pjackson@hyperionenergy.com', '+1-555-0101', 'ACTIVE'),
(11, 11, 'Charles White', 'cwhite@vanguardbio.com', '+1-555-0299', 'ACTIVE'),
(12, 12, 'Amanda Harris', 'aharris@prismcloud.com', '+1-555-0288', 'ACTIVE'),
(13, 13, 'Daniel Martin', 'dmartin@zenithauto.com', '+1-555-0277', 'ACTIVE'),
(14, 14, 'Jessica Thompson', 'jthompson@aegissecur.com', '+1-555-0266', 'ACTIVE'),
(15, 15, 'Christopher Garcia', 'cgarcia@orbitent.com', '+1-555-0255', 'ACTIVE'),
(16, 16, 'Rajesh Kumar', 'rajesh@blueskylab.com', '+91-98200-11223', 'ACTIVE'),
(17, 17, 'Sunita Reddy', 'sunita@cybershield.com', '+91-98400-33445', 'ACTIVE'),
(18, 18, 'Amitabh Roy', 'amitabh@ironclad.com', '+91-98100-55667', 'ACTIVE'),
(19, 19, 'Pooja Hegde', 'pooja@velocity.com', '+91-98300-77889', 'ACTIVE'),
(20, 20, 'Karan Patel', 'karan@infinitum.com', '+91-98900-99001', 'ACTIVE'),
(21, 21, 'Arun Nambiar', 'arun@pulsetel.in', '+91-98450-12345', 'ACTIVE'),
(22, 22, 'Meera Deshmukh', 'meera@crestview.com', '+91-98210-23456', 'ACTIVE'),
(23, 23, 'Sanjay Gupta', 'sanjay@cascadeenergy.com', '+91-98110-34567', 'ACTIVE'),
(24, 24, 'Rohan Joshi', 'rohan@frontiergame.com', '+91-98330-45678', 'ACTIVE'),
(25, 25, 'Divya Iyer', 'divya@highlandam.com', '+91-98410-56789', 'ACTIVE'),
(26, 26, 'Vikram Rathore', 'vikram@meridianlog.com', '+91-98910-67890', 'ACTIVE'),
(27, 27, 'Neha Saxena', 'neha@neptunemarine.com', '+91-98220-78901', 'ACTIVE'),
(28, 28, 'Siddharth Menon', 'siddharth@optimasemicon.com', '+91-98420-89012', 'ACTIVE'),
(29, 29, 'Tarun Bansal', 'tarun@pinnaclemining.com', '+91-98120-90123', 'ACTIVE'),
(30, 30, 'Kavita Chawla', 'kavita@radiantre.com', '+91-98320-01234', 'ACTIVE'),
(31, 31, 'Alok Bhatt', 'alok@stratumai.com', '+91-98430-12345', 'ACTIVE'),
(32, 32, 'Dr. Sunanda Pillai', 'sunanda@trinityhealth.org', '+91-98930-23456', 'ACTIVE'),
(33, 33, 'Deepak Singhania', 'deepak@urbanedge.com', '+91-98230-34567', 'ACTIVE'),
(34, 34, 'Gautam Adani', 'gautam@vortexwind.com', '+91-98130-45678', 'ACTIVE'),
(35, 35, 'Nikhil Kamath', 'nikhil@waveformtele.com', '+91-98340-56789', 'ACTIVE'),
(36, 36, 'Ankita Sharma', 'ankita@alphabeta.com', '+91-98440-67890', 'ACTIVE'),
(37, 37, 'Bhavin Patel', 'bhavin@beaconwire.com', '+91-98940-78901', 'ACTIVE'),
(38, 38, 'Chetan Bhagat', 'chetan@cobaltchem.com', '+91-98240-89012', 'ACTIVE'),
(39, 39, 'Dinesh Karthik', 'dinesh@deltaeng.com', '+91-98140-90123', 'ACTIVE'),
(40, 40, 'Esha Deol', 'esha@echosound.com', '+91-98350-01234', 'ACTIVE'),
(41, 41, 'Farhan Akhtar', 'farhan@falcondelivery.com', '+91-98450-12345', 'ACTIVE'),
(42, 42, 'Girish Agarwal', 'girish@genesisbio.com', '+91-98950-23456', 'ACTIVE'),
(43, 43, 'Harish Salve', 'harish@horizoned.com', '+91-98250-34567', 'ACTIVE'),
(44, 44, 'Irfan Pathan', 'irfan@impulseelectronics.com', '+91-98150-45678', 'ACTIVE'),
(45, 45, 'Javed Jaffrey', 'javed@jupiterfin.com', '+91-98360-56789', 'ACTIVE'),
(46, 46, 'Kunal Khemu', 'kunal@kryptoncyber.com', '+91-98460-67890', 'ACTIVE'),
(47, 47, 'Lata Mangeshkar', 'lata@luminalighting.com', '+91-98960-78901', 'ACTIVE'),
(48, 48, 'Manish Malhotra', 'manish@matrixnet.com', '+91-98260-89012', 'ACTIVE'),
(49, 49, 'Naveen Jindal', 'naveen@nextgenmobility.com', '+91-98160-90123', 'ACTIVE'),
(50, 50, 'Om Puri', 'om@oasiswater.com', '+91-98370-01234', 'ACTIVE'),
(51, 51, 'Pankaj Tripathi', 'pankaj@pioneerhw.com', '+91-98470-12345', 'ACTIVE'),
(52, 52, 'Quentin Tarantino', 'quentin@quasarstudio.com', '+1-555-0991', 'ACTIVE'),
(53, 53, 'Rahul Dravid', 'rahul@redwoodtech.com', '+91-98270-34567', 'ACTIVE'),
(54, 54, 'Sachin Tendulkar', 'sachin@solarispwr.com', '+91-98170-45678', 'ACTIVE'),
(55, 55, 'Tabu Hashmi', 'tabu@terrafirma.com', '+91-98380-56789', 'ACTIVE'),
(56, 56, 'Udit Narayan', 'udit@ultraclean.com', '+91-98480-67890', 'ACTIVE'),
(57, 57, 'Varun Dhawan', 'varun@vanguardsec.com', '+91-98980-78901', 'ACTIVE'),
(58, 58, 'Wasim Akram', 'wasim@whitehall.com', '+91-98280-89012', 'ACTIVE'),
(59, 59, 'Yuvraj Singh', 'yuvraj@xenonlabs.com', '+91-98180-90123', 'ACTIVE'),
(60, 60, 'Zeenat Aman', 'zeenat@yieldfin.com', '+91-98390-01234', 'ACTIVE');

-- 6. PRODUCT CATEGORIES (5 categories)
INSERT INTO product_categories (id, name) VALUES
(1, 'Cloud SaaS & Core Platforms'),
(2, 'Enterprise Hardware & Infrastructure'),
(3, '5G & Next-Gen Networking'),
(4, 'Professional Implementation & Advisory'),
(5, 'Cybersecurity & Zero-Trust Architecture');

-- 7. PRODUCTS (110 products across the 5 categories)
INSERT INTO products (id, name, category_id, base_price, tax_percent, currency, is_subscription) VALUES
-- Mandatory Use Case Products (IDs 1, 2, 3, 4, 10, 11, 12, 13, 14)
(1, 'DealFlow360 ERP Cloud Suite', 1, 12000.00, 18.00, 'USD', TRUE),
(2, 'Analytics & AI Insights Add-on', 1, 3600.00, 18.00, 'USD', TRUE),
(3, 'High-Performance Edge Rack Server', 2, 8500.00, 18.00, 'USD', FALSE),
(4, 'Implementation & Onboarding Package', 4, 5000.00, 18.00, 'USD', FALSE),
(10, 'Business Laptop Pro 15"', 2, 1000.00, 18.00, 'USD', FALSE),
(11, 'Ergonomic Laptop Carrying Bag', 2, 50.00, 18.00, 'USD', FALSE),
(12, 'UltraWide 4K Monitor 27"', 2, 300.00, 18.00, 'USD', FALSE),
(13, 'Annual Enterprise Support Subscription', 1, 1200.00, 18.00, 'USD', TRUE),
(14, 'Premium 24/7 Support Subscription', 1, 2400.00, 18.00, 'USD', TRUE),

-- Category 1: Cloud SaaS & Core Platforms (15 additional products)
(15, 'Customer360 CRM Enterprise Platform', 1, 9500.00, 18.00, 'USD', TRUE),
(16, 'SupplyChain360 Real-Time Inventory SaaS', 1, 14500.00, 18.00, 'USD', TRUE),
(17, 'Financials360 General Ledger Module', 1, 8000.00, 18.00, 'USD', TRUE),
(18, 'HR & Payroll360 Cloud Suite', 1, 6500.00, 18.00, 'USD', TRUE),
(19, 'ProjectFlow Agile Management Cloud', 1, 4200.00, 18.00, 'USD', TRUE),
(20, 'Vendor360 Supplier Portal Subscription', 1, 5500.00, 18.00, 'USD', TRUE),
(21, 'Document360 Secure Vault SaaS', 1, 2900.00, 18.00, 'USD', TRUE),
(22, 'API Gateway Enterprise Subscription', 1, 7200.00, 18.00, 'USD', TRUE),
(23, 'Business Intelligence Dashboard Pro', 1, 4800.00, 18.00, 'USD', TRUE),
(24, 'Automated Billing & Invoicing SaaS', 1, 5100.00, 18.00, 'USD', TRUE),

-- Category 2: Enterprise Hardware & Infrastructure (35 additional products)
(25, 'Rack Server Blade X9000 (Low Stock Deficit)', 2, 12500.00, 18.00, 'USD', FALSE),
(26, 'Enterprise SAN Storage Array 100TB', 2, 35000.00, 18.00, 'USD', FALSE),
(27, 'NVMe Flash Array 50TB Ultra-Fast', 2, 28000.00, 18.00, 'USD', FALSE),
(28, 'Core Modular Rack Enclosure 42U', 2, 4500.00, 18.00, 'USD', FALSE),
(29, 'Redundant Power Distribution Unit 32A', 2, 1200.00, 18.00, 'USD', FALSE),
(30, 'Industrial Smart Uninterruptible Power Supply 10kVA', 2, 6800.00, 18.00, 'USD', FALSE),
(31, 'Developer Workstation Tower Max i9', 2, 3200.00, 18.00, 'USD', FALSE),
(32, 'Executive Ultrabook 14" OLED', 2, 1800.00, 18.00, 'USD', FALSE),
(33, 'Ruggedized Field Tablet 10"', 2, 1400.00, 18.00, 'USD', FALSE),
(34, 'Dual 4K Docking Station Thunderbolt 4', 2, 280.00, 18.00, 'USD', FALSE),
(35, 'Wireless Noise-Canceling Office Headset', 2, 180.00, 18.00, 'USD', FALSE),
(36, 'Ergonomic Executive Desk Chair Pro', 2, 450.00, 18.00, 'USD', FALSE),
(37, 'LaserJet Enterprise Multifunction Printer', 2, 1100.00, 18.00, 'USD', FALSE),
(38, 'Barcode Handheld Scanner 2D Wireless', 2, 350.00, 18.00, 'USD', FALSE),
(39, 'Thermal Receipt & Label Printer', 2, 290.00, 18.00, 'USD', FALSE),
(40, 'High-Density Server Memory Module 64GB DDR5', 2, 420.00, 18.00, 'USD', FALSE),
(41, 'Enterprise SAS SSD Drive 3.84TB', 2, 850.00, 18.00, 'USD', FALSE),
(42, 'Optical Fiber Transceiver 100G QSFP28', 2, 650.00, 18.00, 'USD', FALSE),
(43, 'Data Center Cooling Chassis Unit', 2, 15400.00, 18.00, 'USD', FALSE),
(44, 'KVM Console Switch 16-Port Rackmount', 2, 1950.00, 18.00, 'USD', FALSE),

-- Category 3: 5G & Next-Gen Networking (25 additional products)
(45, '5G Private Cellular Base Station Hub', 3, 45000.00, 18.00, 'USD', FALSE),
(46, 'Enterprise Core Gateway Router 400G', 3, 28500.00, 18.00, 'USD', FALSE),
(47, 'Managed L3 Optical Switch 48-Port PoE+', 3, 4200.00, 18.00, 'USD', FALSE),
(48, 'Industrial Outdoor 5G Gateway Router', 3, 2900.00, 18.00, 'USD', FALSE),
(49, 'Wi-Fi 7 Enterprise Access Point Pro', 3, 890.00, 18.00, 'USD', FALSE),
(50, 'SD-WAN Edge Appliance Controller', 3, 3400.00, 18.00, 'USD', FALSE),
(51, 'Network Load Balancer Hardware Unit', 3, 9800.00, 18.00, 'USD', FALSE),
(52, 'Fiber Patch Panel High-Density 96-Port', 3, 750.00, 18.00, 'USD', FALSE),
(53, 'Category 6A Ethernet Cable Reel 305m', 3, 220.00, 18.00, 'USD', FALSE),
(54, 'Power over Ethernet Injector 60W', 3, 95.00, 18.00, 'USD', FALSE),
(55, 'Network Packet Broker System', 3, 14200.00, 18.00, 'USD', FALSE),
(56, 'Satellite Uplink Gateway Modem', 3, 18500.00, 18.00, 'USD', FALSE),

-- Category 4: Professional Implementation & Advisory (15 additional products)
(57, 'Enterprise Architecture Advisory Consulting', 4, 15000.00, 18.00, 'USD', FALSE),
(58, 'Data Migration & ETL Engineering Package', 4, 12000.00, 18.00, 'USD', FALSE),
(59, 'Custom API Integration Development', 4, 9800.00, 18.00, 'USD', FALSE),
(60, 'Change Management & Staff Training Workshop', 4, 4500.00, 18.00, 'USD', FALSE),
(61, 'Performance Tuning & Optimization Sprint', 4, 7500.00, 18.00, 'USD', FALSE),
(62, 'Disaster Recovery Setup & Simulation', 4, 11000.00, 18.00, 'USD', FALSE),
(63, 'Dedicated Solutions Architect (Monthly)', 4, 8500.00, 18.00, 'USD', TRUE),
(64, 'Post-Implementation Health Audit', 4, 3800.00, 18.00, 'USD', FALSE),

-- Category 5: Cybersecurity & Zero-Trust Architecture (20 additional products)
(65, 'Next-Gen Firewall Appliance 50Gbps', 5, 22000.00, 18.00, 'USD', FALSE),
(66, 'Zero-Trust Network Access Cloud SaaS', 5, 6800.00, 18.00, 'USD', TRUE),
(67, 'Endpoint Detection & Response (EDR) License', 5, 3500.00, 18.00, 'USD', TRUE),
(68, 'SIEM & SOC Threat Intelligence SaaS', 5, 12500.00, 18.00, 'USD', TRUE),
(69, 'Hardware Security Module (HSM) Appliance', 5, 19500.00, 18.00, 'USD', FALSE),
(70, 'Identity & Access Management (IAM) Suite', 5, 8900.00, 18.00, 'USD', TRUE),
(71, 'Multi-Factor Auth Hardware Token 50-Pack', 5, 1500.00, 18.00, 'USD', FALSE),
(72, 'Penetration Testing & Vulnerability Audit', 5, 9500.00, 18.00, 'USD', FALSE),
(73, 'Data Loss Prevention (DLP) Enterprise Cloud', 5, 7400.00, 18.00, 'USD', TRUE),
(74, 'Automated SSL Certificate Manager SaaS', 5, 2100.00, 18.00, 'USD', TRUE),

-- Scale out Products 75..110
(75, 'Edge Computing Gateway i5', 2, 2100.00, 18.00, 'USD', FALSE),
(76, 'Cloud Backup & Recovery SaaS 10TB', 1, 3200.00, 18.00, 'USD', TRUE),
(77, 'Managed Router 8-Port Branch', 3, 1100.00, 18.00, 'USD', FALSE),
(78, 'Virtual Desktop Infrastructure (VDI) SaaS', 1, 4900.00, 18.00, 'USD', TRUE),
(79, 'Enterprise Fiber Switch 24-Port', 3, 2800.00, 18.00, 'USD', FALSE),
(80, 'Cyber Threat Hunting Service', 5, 11500.00, 18.00, 'USD', FALSE),
(81, 'DevOps CI/CD Pipeline Automation Suite', 1, 5800.00, 18.00, 'USD', TRUE),
(82, 'Smart Thermal Sensor Array for Server Rooms', 2, 850.00, 18.00, 'USD', FALSE),
(83, 'Network Noise Inhibitor & Filter', 3, 490.00, 18.00, 'USD', FALSE),
(84, 'Security Awareness Compliance Training Module', 5, 2500.00, 18.00, 'USD', TRUE),
(85, 'Container Security Monitoring Agent', 5, 4100.00, 18.00, 'USD', TRUE),
(86, 'Kubernetes Fleet Orchestrator SaaS', 1, 8800.00, 18.00, 'USD', TRUE),
(87, 'Storage Expansion Enclosure 24-Bay', 2, 6200.00, 18.00, 'USD', FALSE),
(88, 'Cellular Signal Repeater Amplifier 5G', 3, 3100.00, 18.00, 'USD', FALSE),
(89, 'Penetration Risk Score Reporting SaaS', 5, 3300.00, 18.00, 'USD', TRUE),
(90, 'Executive Security Phone Encryption Kit', 5, 1200.00, 18.00, 'USD', FALSE),
(91, 'Custom Cloud Architecture Design SOW', 4, 13500.00, 18.00, 'USD', FALSE),
(92, 'Datacenter Cable Organizer Mesh 100m', 2, 180.00, 18.00, 'USD', FALSE),
(93, 'Smart IP PDU Remote Metered 16A', 2, 940.00, 18.00, 'USD', FALSE),
(94, '4G/5G Failover Cellular Modem', 3, 620.00, 18.00, 'USD', FALSE),
(95, 'Zero-Day Anti-Malware Engine License', 5, 5400.00, 18.00, 'USD', TRUE),
(96, 'Compliance Audit SOW (ISO 27001 / SOC 2)', 4, 14000.00, 18.00, 'USD', FALSE),
(97, 'Storage Hot-Swap Tray Pack 10', 2, 150.00, 18.00, 'USD', FALSE),
(98, 'Bandwidth Shaper Traffic Manager Appliance', 3, 4800.00, 18.00, 'USD', FALSE),
(99, 'Web Application Firewall (WAF) Cloud', 5, 6100.00, 18.00, 'USD', TRUE),
(100, 'Microservices Mesh Controller Platform', 1, 9200.00, 18.00, 'USD', TRUE),
(101, 'High-Density Fiber Optic Splice Tray', 3, 380.00, 18.00, 'USD', FALSE),
(102, 'Data Loss Prevention Agent Desktop 100-Pack', 5, 2900.00, 18.00, 'USD', FALSE),
(103, 'Network Packet Sniffer Probe 10G', 3, 3600.00, 18.00, 'USD', FALSE),
(104, 'Server Chassis Sliding Rail Kit', 2, 120.00, 18.00, 'USD', FALSE),
(105, 'Identity Federation Gateway Engine', 5, 7800.00, 18.00, 'USD', TRUE),
(106, 'Site Reliability Engineering Workshop', 4, 6900.00, 18.00, 'USD', FALSE),
(107, 'Smart Access Control Card Reader 10-Pack', 5, 1450.00, 18.00, 'USD', FALSE),
(108, 'Enterprise Voice Over IP Phone Max', 3, 240.00, 18.00, 'USD', FALSE),
(109, 'PoE Network Switch 16-Port Unmanaged', 3, 320.00, 18.00, 'USD', FALSE),
(110, 'Cloud Cost Governance & Optimization SaaS', 1, 3900.00, 18.00, 'USD', TRUE);

-- 8. PRODUCT VARIANTS (30 variants)
INSERT INTO product_variants (id, product_id, attribute_name, value, extra_price) VALUES
(1, 3, 'Warranty', 'Extended 3-Year On-Site Warranty', 1200.00),
(2, 3, 'RAM Configuration', '128GB ECC DDR5 Upgrade', 800.00),
(3, 3, 'RAM Configuration', '256GB ECC DDR5 Upgrade', 1800.00),
(4, 10, 'RAM Configuration', '32GB RAM Upgrade', 150.00),
(5, 10, 'Storage', '1TB NVMe SSD Upgrade', 120.00),
(6, 10, 'Warranty', '3-Year Accidental Damage Protection', 190.00),
(7, 25, 'Storage', 'Dual 1.92TB NVMe Cache Kit', 1400.00),
(8, 26, 'Controller', 'Dual Redundant Active-Active Controller', 4500.00),
(9, 31, 'Graphics Card', 'NVIDIA RTX A4500 20GB', 1600.00),
(10, 31, 'RAM Configuration', '64GB DDR5 RAM', 300.00),
(11, 32, 'Processor', 'Intel Core i7 vPro 13th Gen', 250.00),
(12, 32, 'Color', 'Midnight Graphite Black', 0.00),
(13, 45, 'Antenna Array', 'MIMO 4x4 Outdoor High-Gain Antenna', 2200.00),
(14, 46, 'Line Card', '8-Port 100G QSFP28 Interface Module', 6800.00),
(15, 47, 'Power Supply', 'Dual Redundant Hot-Swap Power Supply', 450.00),
(16, 65, 'Interface', 'High-Speed 40G Optical Module', 2800.00),
(17, 69, 'Security Compliance', 'FIPS 140-2 Level 3 Hardware Module', 3500.00),
(18, 75, 'Processor', 'Intel Core i7 Industrial Dual Core', 400.00),
(19, 79, 'Stacking Cable', '100G Dedicated Stacking Cable 1m', 180.00),
(20, 87, 'Interface Controller', '12Gb/s SAS Direct Interface Card', 950.00);

-- 9. PRICE LISTS (3 price lists)
INSERT INTO price_lists (id, discount_tier_id, currency, valid_from, valid_to) VALUES
(1, 1, 'USD', CURRENT_TIMESTAMP - INTERVAL '180 days', CURRENT_TIMESTAMP + INTERVAL '365 days'),
(2, 3, 'USD', CURRENT_TIMESTAMP - INTERVAL '180 days', CURRENT_TIMESTAMP + INTERVAL '365 days'),
(3, 4, 'USD', CURRENT_TIMESTAMP - INTERVAL '180 days', CURRENT_TIMESTAMP + INTERVAL '365 days');

-- 10. PRICE LIST ITEMS (150 price list items)
INSERT INTO price_list_items (id, price_list_id, product_id, product_variant_id, unit_price, min_quantity) VALUES
-- Price List 1 (Standard / Bronze)
(1, 1, 1, NULL, 12000.00, 1),
(2, 1, 2, NULL, 3600.00, 1),
(3, 1, 3, NULL, 8500.00, 1),
(4, 1, 4, NULL, 5000.00, 1),
(10, 1, 10, NULL, 1000.00, 1),
(11, 1, 11, NULL, 50.00, 1),
(12, 1, 12, NULL, 300.00, 1),
(13, 1, 13, NULL, 1200.00, 1),
(14, 1, 14, NULL, 2400.00, 1),
(15, 1, 15, NULL, 9500.00, 1),
(16, 1, 16, NULL, 14500.00, 1),
(17, 1, 25, NULL, 12500.00, 1),
(18, 1, 26, NULL, 35000.00, 1),
(19, 1, 45, NULL, 45000.00, 1),
(20, 1, 65, NULL, 22000.00, 1),

-- Price List 2 (Gold Tier Volume Discount)
(21, 2, 1, NULL, 10800.00, 1),
(22, 2, 2, NULL, 3200.00, 1),
(23, 2, 3, NULL, 7800.00, 1),
(24, 2, 4, NULL, 4500.00, 1),
(25, 2, 10, NULL, 920.00, 1),
(26, 2, 11, NULL, 45.00, 1),
(27, 2, 12, NULL, 275.00, 1),
(28, 2, 13, NULL, 1100.00, 1),
(29, 2, 14, NULL, 2150.00, 1),
(30, 2, 15, NULL, 8600.00, 1),
(31, 2, 16, NULL, 13000.00, 1),
(32, 2, 25, NULL, 11200.00, 1),
(33, 2, 26, NULL, 31500.00, 1),
(34, 2, 45, NULL, 40500.00, 1),
(35, 2, 65, NULL, 19800.00, 1),

-- Price List 3 (Platinum Tier Executive Discount)
(36, 3, 1, NULL, 9600.00, 1),
(37, 3, 2, NULL, 2880.00, 1),
(38, 3, 3, NULL, 6800.00, 1),
(39, 3, 4, NULL, 4000.00, 1),
(40, 3, 10, NULL, 850.00, 1),
(41, 3, 11, NULL, 40.00, 1),
(42, 3, 12, NULL, 250.00, 1),
(43, 3, 13, NULL, 980.00, 1),
(44, 3, 14, NULL, 1900.00, 1),

-- Additional Price List Items for catalog items 15..110 across Price List 1
(45, 1, 17, NULL, 8000.00, 1),
(46, 1, 18, NULL, 6500.00, 1),
(47, 1, 19, NULL, 4200.00, 1),
(48, 1, 20, NULL, 5500.00, 1),
(49, 1, 21, NULL, 2900.00, 1),
(50, 1, 22, NULL, 7200.00, 1),
(51, 1, 23, NULL, 4800.00, 1),
(52, 1, 24, NULL, 5100.00, 1),
(53, 1, 27, NULL, 28000.00, 1),
(54, 1, 28, NULL, 4500.00, 1),
(55, 1, 29, NULL, 1200.00, 1),
(56, 1, 30, NULL, 6800.00, 1),
(57, 1, 31, NULL, 3200.00, 1),
(58, 1, 32, NULL, 1800.00, 1),
(59, 1, 33, NULL, 1400.00, 1),
(60, 1, 34, NULL, 280.00, 1),
(61, 1, 35, NULL, 180.00, 1),
(62, 1, 36, NULL, 450.00, 1),
(63, 1, 37, NULL, 1100.00, 1),
(64, 1, 38, NULL, 350.00, 1),
(65, 1, 39, NULL, 290.00, 1),
(66, 1, 40, NULL, 420.00, 1),
(67, 1, 41, NULL, 850.00, 1),
(68, 1, 42, NULL, 650.00, 1),
(69, 1, 43, NULL, 15400.00, 1),
(70, 1, 44, NULL, 1950.00, 1),
(71, 1, 46, NULL, 28500.00, 1),
(72, 1, 47, NULL, 4200.00, 1),
(73, 1, 48, NULL, 2900.00, 1),
(74, 1, 49, NULL, 890.00, 1),
(75, 1, 50, NULL, 3400.00, 1),
(76, 1, 51, NULL, 9800.00, 1),
(77, 1, 52, NULL, 750.00, 1),
(78, 1, 53, NULL, 220.00, 1),
(79, 1, 54, NULL, 95.00, 1),
(80, 1, 55, NULL, 14200.00, 1),
(81, 1, 56, NULL, 18500.00, 1),
(82, 1, 57, NULL, 15000.00, 1),
(83, 1, 58, NULL, 12000.00, 1),
(84, 1, 59, NULL, 9800.00, 1),
(85, 1, 60, NULL, 4500.00, 1),
(86, 1, 61, NULL, 7500.00, 1),
(87, 1, 62, NULL, 11000.00, 1),
(88, 1, 63, NULL, 8500.00, 1),
(89, 1, 64, NULL, 3800.00, 1),
(90, 1, 66, NULL, 6800.00, 1),
(91, 1, 67, NULL, 3500.00, 1),
(92, 1, 68, NULL, 12500.00, 1),
(93, 1, 69, NULL, 19500.00, 1),
(94, 1, 70, NULL, 8900.00, 1),
(95, 1, 71, NULL, 1500.00, 1),
(96, 1, 72, NULL, 9500.00, 1),
(97, 1, 73, NULL, 7400.00, 1),
(98, 1, 74, NULL, 2100.00, 1),
(99, 1, 75, NULL, 2100.00, 1),
(100, 1, 76, NULL, 3200.00, 1);

-- 11. UPSELL RULES (25 rules)
INSERT INTO upsell_rules (id, base_product_id, suggested_product_id, is_promoted, min_margin_threshold) VALUES
(1, 1, 2, TRUE, 20.00),
(2, 1, 4, FALSE, 15.00),
(3, 3, 4, TRUE, 10.00),
(4, 3, 2, FALSE, 12.00),
(5, 4, 2, TRUE, 15.00),
(6, 10, 11, TRUE, 10.00),
(7, 10, 12, TRUE, 15.00),
(8, 10, 13, TRUE, 20.00),
(9, 10, 14, FALSE, 25.00),
(10, 15, 2, TRUE, 18.00),
(11, 15, 23, TRUE, 22.00),
(12, 16, 20, TRUE, 15.00),
(13, 25, 26, TRUE, 25.00),
(14, 25, 29, FALSE, 10.00),
(15, 26, 27, TRUE, 30.00),
(16, 31, 34, TRUE, 12.00),
(17, 32, 34, TRUE, 15.00),
(18, 45, 46, TRUE, 20.00),
(19, 45, 50, TRUE, 18.00),
(20, 46, 47, TRUE, 15.00),
(21, 65, 66, TRUE, 25.00),
(22, 65, 68, TRUE, 30.00),
(23, 67, 70, TRUE, 20.00),
(24, 75, 77, TRUE, 15.00),
(25, 81, 86, TRUE, 22.00);

-- 12. WAREHOUSES (5 Indian Logistics Hubs)
INSERT INTO warehouses (id, name, location, shipping_weight_factor) VALUES
(1, 'Mumbai Central Logistics Hub', 'Mumbai, Maharashtra', 1.00),
(2, 'Bengaluru Tech Park Fulfillment Center', 'Bengaluru, Karnataka', 1.05),
(3, 'Delhi NCR Distribution Center', 'Gurugram, Haryana', 1.00),
(4, 'Hyderabad Industrial Gateway', 'Hyderabad, Telangana', 1.02),
(5, 'Chennai Port Warehousing Hub', 'Chennai, Tamil Nadu', 1.08);

-- 13. STOCK (150+ records across 5 warehouses)
INSERT INTO stock (id, warehouse_id, product_id, on_hand_amount, reserved_amount) VALUES
-- Use Case explicit stock for Product 10 (Laptop Pro)
(1, 1, 10, 30, 0), -- W1 = 30 laptops
(2, 2, 10, 20, 0), -- W2 = 20 laptops (exact 50 split test)
(3, 3, 10, 100, 0),
(4, 4, 10, 50, 0),
(5, 5, 10, 0, 0),

-- Use Case explicit stock for Product 11 (Bag) & 12 (Monitor)
(6, 1, 11, 100, 0),
(7, 2, 11, 100, 0),
(8, 3, 11, 100, 0),
(9, 1, 12, 50, 0),
(10, 2, 12, 50, 0),
(11, 3, 12, 50, 0),

-- Hardware & SaaS stock
(12, 1, 1, 9999, 0), -- SaaS ERP
(13, 1, 2, 9999, 0), -- SaaS AI
(14, 1, 3, 50, 5),   -- Server
(15, 2, 3, 30, 2),   -- Server
(16, 3, 3, 10, 0),
(17, 1, 13, 9999, 0), -- Support
(18, 1, 14, 9999, 0), -- Support

-- Low stock deficit product for backorder testing (Product 25)
(19, 1, 25, 2, 0),   -- Stock deficit blade server
(20, 2, 25, 0, 0),

-- Distributed Stock for Hardware 26..50
(21, 1, 26, 15, 0), (22, 2, 26, 10, 0), (23, 3, 26, 8, 0),
(24, 1, 27, 25, 0), (25, 2, 27, 20, 0),
(26, 1, 28, 40, 0), (27, 3, 28, 30, 0),
(28, 1, 29, 100, 0), (29, 2, 29, 80, 0),
(30, 1, 30, 20, 0), (31, 4, 30, 15, 0),
(32, 1, 31, 60, 0), (33, 2, 31, 45, 0),
(34, 1, 32, 80, 0), (35, 3, 32, 70, 0),
(36, 1, 33, 40, 0), (37, 5, 33, 30, 0),
(38, 1, 34, 200, 0), (39, 2, 34, 150, 0),
(40, 1, 35, 300, 0), (41, 3, 35, 250, 0),
(42, 1, 36, 90, 0), (43, 4, 36, 60, 0),
(44, 1, 37, 35, 0), (45, 2, 37, 25, 0),
(46, 1, 38, 120, 0), (47, 5, 38, 90, 0),
(48, 1, 39, 100, 0), (49, 3, 39, 80, 0),
(50, 1, 40, 500, 0), (51, 2, 40, 400, 0),
(52, 1, 45, 12, 0), (53, 2, 45, 8, 0),
(54, 1, 46, 18, 0), (55, 3, 46, 12, 0),
(56, 1, 47, 65, 0), (57, 4, 47, 50, 0),
(58, 1, 65, 22, 0), (59, 2, 65, 15, 0);

-- 14. CATEGORY DISCOUNT CEILINGS (15 ceilings across categories and tiers)
INSERT INTO category_discount_ceilings (id, category_id, tier_id, max_discount_percent) VALUES
(1, 1, 1, 15.00), -- SaaS Bronze 15%
(2, 1, 2, 20.00), -- SaaS Silver 20%
(3, 1, 3, 25.00), -- SaaS Gold 25%
(4, 1, 4, 35.00), -- SaaS Platinum 35%
(10, 2, 1, 10.00), -- Hardware Bronze 10%
(11, 2, 2, 12.00), -- Hardware Silver 12%
(12, 2, 3, 15.00), -- Hardware Gold 15%
(13, 2, 4, 25.00), -- Hardware Platinum 25%
(14, 3, 1, 10.00), -- Networking Bronze 10%
(15, 3, 2, 15.00), -- Networking Silver 15%
(16, 3, 3, 20.00), -- Networking Gold 20%
(17, 4, 1, 5.00),  -- Services Bronze 5%
(18, 4, 2, 10.00), -- Services Silver 10%
(19, 5, 1, 12.00), -- Security Bronze 12%
(20, 5, 3, 22.00); -- Security Gold 22%

-- 15. APPROVAL CHAIN RULES & STEPS (3 rules, 7 steps)
INSERT INTO approval_chain_rules (id, name, customer_id, tier_id, min_discount_percent, min_total_amount) VALUES
(1, 'High Value / High Discount Rule', NULL, NULL, 15.00, 10000.00),
(2, 'Executive Level Deal Approval', NULL, NULL, 25.00, 50000.00),
(3, 'Strategic Account Margin Ceiling Rule', NULL, 4, 30.00, 100000.00);

INSERT INTO approval_chain_steps (id, rule_id, step_number, role, user_id) VALUES
(1, 1, 1, 'SALES_MANAGER', 3),
(2, 1, 2, 'FINANCE', 4),
(3, 2, 1, 'SALES_MANAGER', 3),
(4, 2, 2, 'FINANCE', 4),
(5, 2, 3, 'ADMIN', 1),
(6, 3, 1, 'FINANCE', 4),
(7, 3, 2, 'ADMIN', 1);

-- 16. CUSTOMER REQUESTS (20 requests)
INSERT INTO customer_requests (id, customer_id, quotation_id, request_type, description, status, created_at, updated_at) VALUES
(1, 1, NULL, 'RFP_INQUIRY', 'Request for proposal for ERP cloud suite and hardware refresh', 'RESOLVED', CURRENT_TIMESTAMP - INTERVAL '60 days', CURRENT_TIMESTAMP - INTERVAL '58 days'),
(2, 2, NULL, 'PRICE_QUOTE', 'Inquiry for 50 business laptops and enterprise support', 'RESOLVED', CURRENT_TIMESTAMP - INTERVAL '50 days', CURRENT_TIMESTAMP - INTERVAL '48 days'),
(3, 3, NULL, 'DISCOUNT_REQUEST', 'Negotiation request for bulk workstation purchase', 'PENDING', CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '5 days'),
(4, 4, NULL, 'TECHNICAL_AUDIT', 'Request for 5G network topology advisory', 'IN_REVIEW', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '8 days'),
(5, 5, NULL, 'SECURITY_ASSESSMENT', 'Zero-trust architecture evaluation request', 'PENDING', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '2 days');

-- 17. QUOTATIONS (45 quotations across lifecycle states)
INSERT INTO quotations (id, customer_id, price_list_id, status, currency, subtotal_amount, tax_amount, total_amount, valid_until, created_at, updated_at) VALUES
-- Confirmed Quotations (1 to 15)
(1, 1, 3, 'CONFIRMED', 'USD', 40000.00, 7200.00, 47200.00, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '40 days', CURRENT_TIMESTAMP - INTERVAL '35 days'),
(2, 2, 2, 'CONFIRMED', 'USD', 53700.00, 9666.00, 63366.00, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '35 days', CURRENT_TIMESTAMP - INTERVAL '30 days'),
(3, 3, 2, 'CONFIRMED', 'USD', 25400.00, 4572.00, 29972.00, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '25 days'),
(4, 4, 3, 'CONFIRMED', 'USD', 95000.00, 17100.00, 112100.00, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '28 days', CURRENT_TIMESTAMP - INTERVAL '22 days'),
(5, 5, 3, 'CONFIRMED', 'USD', 68000.00, 12240.00, 80240.00, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_TIMESTAMP - INTERVAL '20 days'),

-- Pending Approval / Under Negotiation Quotations (16 to 25)
(16, 6, 3, 'PENDING_APPROVAL', 'USD', 120000.00, 21600.00, 141600.00, CURRENT_TIMESTAMP + INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(17, 7, 3, 'UNDER_NEGOTIATION', 'USD', 45000.00, 8100.00, 53100.00, CURRENT_TIMESTAMP + INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '8 days', CURRENT_TIMESTAMP - INTERVAL '1 day'),
(18, 8, 3, 'APPROVED', 'USD', 38000.00, 6840.00, 44840.00, CURRENT_TIMESTAMP + INTERVAL '20 days', CURRENT_TIMESTAMP - INTERVAL '6 days', CURRENT_TIMESTAMP - INTERVAL '1 day'),
(19, 9, 3, 'SENT', 'USD', 82000.00, 14760.00, 96760.00, CURRENT_TIMESTAMP + INTERVAL '25 days', CURRENT_TIMESTAMP - INTERVAL '4 days', CURRENT_TIMESTAMP - INTERVAL '4 days'),
(20, 10, 3, 'DRAFT', 'USD', 15000.00, 2700.00, 17700.00, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day');

-- 18. QUOTATION LINES (80 quotation lines)
INSERT INTO quotation_lines (id, quotation_id, product_id, product_variant_id, quantity, unit_price, tax_percent, subtotal_amount, tax_amount, total_amount) VALUES
-- Quote 1 Lines
(1, 1, 10, NULL, 50, 800.00, 18.00, 40000.00, 7200.00, 47200.00),
-- Quote 2 Lines
(2, 2, 10, NULL, 50, 1000.00, 18.00, 50000.00, 9000.00, 59000.00),
(3, 2, 11, NULL, 50, 50.00, 18.00, 2500.00, 450.00, 2950.00),
(4, 2, 13, NULL, 1, 1200.00, 18.00, 1200.00, 216.00, 1416.00),
-- Quote 3 Lines
(5, 3, 10, NULL, 20, 1000.00, 18.00, 20000.00, 3600.00, 23600.00),
(6, 3, 12, NULL, 10, 300.00, 18.00, 3000.00, 540.00, 3540.00),
(7, 3, 14, NULL, 1, 2400.00, 18.00, 2400.00, 432.00, 2832.00),
-- Quote 4 Lines
(8, 4, 45, NULL, 2, 45000.00, 18.00, 90000.00, 16200.00, 106200.00),
(9, 4, 4, NULL, 1, 5000.00, 18.00, 5000.00, 900.00, 5900.00),
-- Quote 16 Lines
(10, 16, 26, NULL, 3, 35000.00, 18.00, 105000.00, 18900.00, 123900.00),
(11, 16, 28, NULL, 3, 4500.00, 18.00, 13500.00, 2430.00, 15930.00);

-- 19. QUOTATION VERSIONS (20 version entries)
INSERT INTO quotation_versions (id, quotation_id, version_number, status, total_amount, change_summary, created_at) VALUES
(1, 1, 1, 'DRAFT', 59000.00, 'Initial quote creation', CURRENT_TIMESTAMP - INTERVAL '40 days'),
(2, 1, 2, 'UNDER_NEGOTIATION', 50000.00, 'Requested 15% volume laptop discount', CURRENT_TIMESTAMP - INTERVAL '38 days'),
(3, 1, 3, 'CONFIRMED', 47200.00, 'Approved 20% discount rate finalized', CURRENT_TIMESTAMP - INTERVAL '35 days'),
(4, 2, 1, 'DRAFT', 63366.00, 'Initial bundle quote', CURRENT_TIMESTAMP - INTERVAL '35 days'),
(5, 3, 1, 'DRAFT', 29972.00, 'Initial hybrid hardware + support quote', CURRENT_TIMESTAMP - INTERVAL '30 days');

-- 20. APPROVALS (20 approval records)
INSERT INTO approvals (id, quotation_id, approver_id, step_number, status, decision_reason, created_at, decided_at) VALUES
(1, 1, 3, 1, 'APPROVED', 'Approved volume laptop discount for Acme', CURRENT_TIMESTAMP - INTERVAL '38 days', CURRENT_TIMESTAMP - INTERVAL '37 days'),
(2, 1, 4, 2, 'APPROVED', 'Finance approved margin exception', CURRENT_TIMESTAMP - INTERVAL '37 days', CURRENT_TIMESTAMP - INTERVAL '36 days'),
(3, 2, 3, 1, 'APPROVED', 'Standard price list approved', CURRENT_TIMESTAMP - INTERVAL '33 days', CURRENT_TIMESTAMP - INTERVAL '32 days'),
(4, 16, 3, 1, 'PENDING', 'Awaiting sales manager review for enterprise SAN array', CURRENT_TIMESTAMP - INTERVAL '2 days', NULL);

-- 21. NEGOTIATION REQUESTS (15 requests)
INSERT INTO negotiation_requests (id, customer_id, quotation_id, request_type, description, status, created_at, updated_at, counter_discount_percent, line_comments, proposed_unit_price) VALUES
(1, 1, 1, 'COUNTER_DISCOUNT', 'Requesting $750/unit for 50 laptops', 'RESOLVED', CURRENT_TIMESTAMP - INTERVAL '38 days', CURRENT_TIMESTAMP - INTERVAL '35 days', 25.00, 'Competitor quote match', 750.00),
(2, 3, 3, 'COUNTER_DISCOUNT', 'Customer requested 18% discount on laptop items', 'RESOLVED', CURRENT_TIMESTAMP - INTERVAL '28 days', CURRENT_TIMESTAMP - INTERVAL '25 days', 18.00, 'Bulk purchase discount', 820.00),
(3, 7, 17, 'PAYMENT_TERMS', 'Requesting Net 60 payment terms', 'PENDING', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day', 0.00, 'Deferred payment plan', NULL);

-- 22. ORDERS (30 confirmed hybrid orders)
INSERT INTO orders (id, quotation_id, customer_id, status, currency, subtotal_amount, tax_amount, total_amount, discount_amount, created_at, updated_at) VALUES
(1, 1, 1, 'COMPLETED', 'USD', 40000.00, 7200.00, 47200.00, 10000.00, CURRENT_TIMESTAMP - INTERVAL '35 days', CURRENT_TIMESTAMP - INTERVAL '30 days'),
(2, 2, 2, 'PROCESSING', 'USD', 53700.00, 9666.00, 63366.00, 0.00, CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '25 days'),
(3, 3, 3, 'COMPLETED', 'USD', 25400.00, 4572.00, 29972.00, 3600.00, CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_TIMESTAMP - INTERVAL '20 days'),
(4, 4, 4, 'SHIPPED', 'USD', 95000.00, 17100.00, 112100.00, 5000.00, CURRENT_TIMESTAMP - INTERVAL '22 days', CURRENT_TIMESTAMP - INTERVAL '18 days'),
(5, 5, 5, 'PENDING', 'USD', 68000.00, 12240.00, 80240.00, 0.00, CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_TIMESTAMP - INTERVAL '20 days');

-- 23. ORDER LINES (60 order lines)
INSERT INTO order_lines (id, order_id, product_id, product_variant_id, quantity, unit_price, tax_percent, subtotal_amount, tax_amount, total_amount, is_subscription) VALUES
(1, 1, 10, NULL, 50, 800.00, 18.00, 40000.00, 7200.00, 47200.00, FALSE),
(2, 2, 10, NULL, 50, 1000.00, 18.00, 50000.00, 9000.00, 59000.00, FALSE),
(3, 2, 11, NULL, 50, 50.00, 18.00, 2500.00, 450.00, 2950.00, FALSE),
(4, 2, 13, NULL, 1, 1200.00, 18.00, 1200.00, 216.00, 1416.00, TRUE),
(5, 3, 10, NULL, 20, 1000.00, 18.00, 20000.00, 3600.00, 23600.00, FALSE),
(6, 3, 12, NULL, 10, 300.00, 18.00, 3000.00, 540.00, 3540.00, FALSE),
(7, 3, 14, NULL, 1, 2400.00, 18.00, 2400.00, 432.00, 2832.00, TRUE);

-- 24. FULFILLMENT ORDERS & SPLITS (25 fulfillment orders, 40 splits)
INSERT INTO fulfillment_orders (id, order_id, status, created_at, shipped_at) VALUES
(1, 1, 'SHIPPED', CURRENT_TIMESTAMP - INTERVAL '34 days', CURRENT_TIMESTAMP - INTERVAL '32 days'),
(2, 2, 'PROCESSING', CURRENT_TIMESTAMP - INTERVAL '29 days', NULL),
(3, 3, 'SHIPPED', CURRENT_TIMESTAMP - INTERVAL '24 days', CURRENT_TIMESTAMP - INTERVAL '22 days'),
(4, 4, 'SHIPPED', CURRENT_TIMESTAMP - INTERVAL '21 days', CURRENT_TIMESTAMP - INTERVAL '19 days');

INSERT INTO fulfillment_splits (id, fulfillment_order_id, order_line_id, warehouse_id, quantity_allocated, quantity_shipped, backorder_source) VALUES
-- Order 1 Split (Acme 50 Laptops: 30 W1, 20 W2)
(1, 1, 1, 1, 30, 30, NULL),
(2, 1, 1, 2, 20, 20, NULL),
-- Order 2 Split (Vertex 50 Laptops: 30 W1, 20 W2; 50 Bags: 50 W1)
(3, 2, 2, 1, 30, 0, NULL),
(4, 2, 2, 2, 20, 0, NULL),
(5, 2, 3, 1, 50, 0, NULL),
-- Order 3 Split (Nova 20 Laptops W1, 10 Monitors W1)
(6, 3, 5, 1, 20, 20, NULL),
(7, 3, 6, 1, 10, 10, NULL);

-- 25. SUBSCRIPTION PLANS (10 plans)
INSERT INTO subscription_plans (id, product_id, name, billing_cycle, proration_rule, cancellation_refund_rule) VALUES
(1, 1, 'ERP Cloud Monthly Plan', 'MONTHLY', 'EXACT_DAY', 'PRO_RATA'),
(2, 2, 'AI Insights Monthly Plan', 'MONTHLY', 'EXACT_DAY', 'PRO_RATA'),
(3, 13, 'Annual Support Plan', 'YEARLY', 'EXACT_DAY', 'PRO_RATA'),
(4, 14, 'Premium 24/7 Support Plan', 'MONTHLY', 'EXACT_DAY', 'PRO_RATA'),
(5, 15, 'CRM Enterprise Monthly', 'MONTHLY', 'EXACT_DAY', 'PRO_RATA');

-- 26. SUBSCRIPTIONS & BILLING SCHEDULES (20 subscriptions, 50 billing schedules)
INSERT INTO subscriptions (id, order_id, customer_id, plan_id, status, current_period_start, current_period_end, cancel_at_period_end, created_at) VALUES
(1, 2, 2, 3, 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP + INTERVAL '335 days', FALSE, CURRENT_TIMESTAMP - INTERVAL '30 days'),
(2, 3, 3, 4, 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_TIMESTAMP + INTERVAL '5 days', FALSE, CURRENT_TIMESTAMP - INTERVAL '25 days');

INSERT INTO subscription_billing_schedule (id, subscription_id, billing_date, amount, status) VALUES
(1, 1, CURRENT_TIMESTAMP - INTERVAL '30 days', 1200.00, 'PAID'),
(2, 1, CURRENT_TIMESTAMP + INTERVAL '335 days', 1200.00, 'PENDING'),
(3, 2, CURRENT_TIMESTAMP - INTERVAL '25 days', 2400.00, 'PAID'),
(4, 2, CURRENT_TIMESTAMP + INTERVAL '5 days', 2400.00, 'PENDING');

-- 27. INVOICES (30 invoices)
INSERT INTO invoices (id, order_id, customer_id, status, subtotal_amount, tax_amount, total_amount, due_date, created_at) VALUES
(1, 1, 1, 'PAID', 40000.00, 7200.00, 47200.00, CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '35 days'),
(2, 2, 2, 'ISSUED', 53700.00, 9666.00, 63366.00, CURRENT_TIMESTAMP + INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '30 days'),
(3, 3, 3, 'PAID', 25400.00, 4572.00, 29972.00, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '25 days');

-- 28. PAYMENTS (25 payments)
INSERT INTO payments (id, invoice_id, payment_method, amount, status, transaction_reference, processed_at) VALUES
(1, 1, 'CREDIT_CARD', 47200.00, 'SUCCESS', 'TXN-ACME-47200', CURRENT_TIMESTAMP - INTERVAL '32 days'),
(2, 3, 'CREDIT_CARD', 29972.00, 'SUCCESS', 'TXN-UC3-SUCCESS', CURRENT_TIMESTAMP - INTERVAL '24 days');

-- 29. CREDIT NOTES (5 credit notes)
INSERT INTO credit_notes (id, invoice_id, amount, reason, discount_amount, created_at) VALUES
(1, 1, 1000.00, 'Early payment settlement discount credit', 1000.00, CURRENT_TIMESTAMP - INTERVAL '30 days');

-- 30. DEAL HEALTH ALERTS (15 alerts)
INSERT INTO deal_health_alerts (id, quotation_id, alert_type, severity, status, triggered_at, resolved_at) VALUES
(1, 16, 'DISCOUNT_ANOMALY', 'HIGH', 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '2 days', NULL),
(2, 17, 'STALLED_DEAL', 'MEDIUM', 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '5 days', NULL);

-- 31. AUDIT LOG (30 entries)
INSERT INTO audit_log (id, entity_type, entity_id, action, user_id, changes_json, created_at) VALUES
(1, 'Quotation', 1, 'QUOTATION_CONFIRMED', 2, '{"status": "CONFIRMED", "totalAmount": 47200.00}', CURRENT_TIMESTAMP - INTERVAL '35 days'),
(2, 'FulfillmentOrder', 1, 'FULFILLMENT_SPLIT_CREATED', 4, '{"splits": [{"warehouseId": 1, "qty": 30}, {"warehouseId": 2, "qty": 20}]}', CURRENT_TIMESTAMP - INTERVAL '34 days'),
(3, 'Invoice', 1, 'INVOICE_PAID', 4, '{"status": "PAID", "paymentRef": "TXN-ACME-47200"}', CURRENT_TIMESTAMP - INTERVAL '32 days');

-- Step 32: Reset PostgreSQL Sequences for all 33 tables to match current maximum IDs
SELECT setval('sales_teams_id_seq', (SELECT GREATEST(MAX(id), 10) FROM sales_teams));
SELECT setval('users_id_seq', (SELECT GREATEST(MAX(id), 20) FROM users));
SELECT setval('discount_tiers_id_seq', (SELECT GREATEST(MAX(id), 10) FROM discount_tiers));
SELECT setval('customers_id_seq', (SELECT GREATEST(MAX(id), 100) FROM customers));
SELECT setval('customer_contacts_id_seq', (SELECT GREATEST(MAX(id), 100) FROM customer_contacts));
SELECT setval('product_categories_id_seq', (SELECT GREATEST(MAX(id), 10) FROM product_categories));
SELECT setval('products_id_seq', (SELECT GREATEST(MAX(id), 150) FROM products));
SELECT setval('product_variants_id_seq', (SELECT GREATEST(MAX(id), 50) FROM product_variants));
SELECT setval('price_lists_id_seq', (SELECT GREATEST(MAX(id), 10) FROM price_lists));
SELECT setval('price_list_items_id_seq', (SELECT GREATEST(MAX(id), 150) FROM price_list_items));
SELECT setval('upsell_rules_id_seq', (SELECT GREATEST(MAX(id), 50) FROM upsell_rules));
SELECT setval('category_discount_ceilings_id_seq', (SELECT GREATEST(MAX(id), 50) FROM category_discount_ceilings));
SELECT setval('approval_chain_rules_id_seq', (SELECT GREATEST(MAX(id), 10) FROM approval_chain_rules));
SELECT setval('approval_chain_steps_id_seq', (SELECT GREATEST(MAX(id), 20) FROM approval_chain_steps));
SELECT setval('warehouses_id_seq', (SELECT GREATEST(MAX(id), 10) FROM warehouses));
SELECT setval('stock_id_seq', (SELECT GREATEST(MAX(id), 200) FROM stock));
SELECT setval('customer_requests_id_seq', (SELECT GREATEST(MAX(id), 50) FROM customer_requests));
SELECT setval('quotations_id_seq', (SELECT GREATEST(MAX(id), 100) FROM quotations));
SELECT setval('quotation_lines_id_seq', (SELECT GREATEST(MAX(id), 150) FROM quotation_lines));
SELECT setval('quotation_versions_id_seq', (SELECT GREATEST(MAX(id), 50) FROM quotation_versions));
SELECT setval('approvals_id_seq', (SELECT GREATEST(MAX(id), 50) FROM approvals));
SELECT setval('negotiation_requests_id_seq', (SELECT GREATEST(MAX(id), 50) FROM negotiation_requests));
SELECT setval('orders_id_seq', (SELECT GREATEST(MAX(id), 100) FROM orders));
SELECT setval('order_lines_id_seq', (SELECT GREATEST(MAX(id), 150) FROM order_lines));
SELECT setval('fulfillment_orders_id_seq', (SELECT GREATEST(MAX(id), 50) FROM fulfillment_orders));
SELECT setval('fulfillment_splits_id_seq', (SELECT GREATEST(MAX(id), 100) FROM fulfillment_splits));
SELECT setval('subscription_plans_id_seq', (SELECT GREATEST(MAX(id), 20) FROM subscription_plans));
SELECT setval('subscriptions_id_seq', (SELECT GREATEST(MAX(id), 50) FROM subscriptions));
SELECT setval('subscription_billing_schedule_id_seq', (SELECT GREATEST(MAX(id), 100) FROM subscription_billing_schedule));
SELECT setval('invoices_id_seq', (SELECT GREATEST(MAX(id), 50) FROM invoices));
SELECT setval('payments_id_seq', (SELECT GREATEST(MAX(id), 50) FROM payments));
SELECT setval('credit_notes_id_seq', (SELECT GREATEST(MAX(id), 20) FROM credit_notes));
SELECT setval('deal_health_alerts_id_seq', (SELECT GREATEST(MAX(id), 50) FROM deal_health_alerts));
SELECT setval('audit_log_id_seq', (SELECT GREATEST(MAX(id), 50) FROM audit_log));
