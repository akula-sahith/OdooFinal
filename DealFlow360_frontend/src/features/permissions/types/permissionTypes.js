/**
 * Centralized Permission Definitions & Group Catalog
 * Defines all fine-grained action capability tokens across DealFlow360 enterprise modules.
 */

export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: 'dashboard.view',

  // Product Master Catalog
  PRODUCTS_VIEW: 'products.view',
  PRODUCTS_CREATE: 'products.create',
  PRODUCTS_UPDATE: 'products.update',
  PRODUCTS_MANAGE_STATUS: 'products.manage_status',

  // Product Categories
  CATEGORIES_VIEW: 'categories.view',
  CATEGORIES_CREATE: 'categories.create',
  CATEGORIES_UPDATE: 'categories.update',

  // Base Price Lists
  PRICING_VIEW: 'pricing.view',
  PRICING_CREATE: 'pricing.create',
  PRICING_UPDATE: 'pricing.update',
  PRICING_MANAGE_STATUS: 'pricing.manage_status',

  // Discount Tiers & Governance
  DISCOUNTS_VIEW: 'discounts.view',
  DISCOUNTS_CREATE: 'discounts.create',
  DISCOUNTS_UPDATE: 'discounts.update',
  DISCOUNTS_MANAGE_STATUS: 'discounts.manage_status',

  // Approval Escalation Chain
  APPROVALS_VIEW: 'approvals.view',
  APPROVALS_UPDATE: 'approvals.update',

  // Staff Users Management
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_UPDATE: 'users.update',
  USERS_MANAGE_STATUS: 'users.manage_status',

  // Security Roles & Access Control
  ROLES_VIEW: 'roles.view',
  ROLES_CREATE: 'roles.create',
  ROLES_UPDATE: 'roles.update',

  // Permission Reference Catalog
  PERMISSIONS_VIEW: 'permissions.view',

  // Customers (Future Sales Scope)
  CUSTOMERS_VIEW: 'customers.view',
  CUSTOMERS_CREATE: 'customers.create',
  CUSTOMERS_UPDATE: 'customers.update',

  // Quotations (Future Sales Scope)
  QUOTATIONS_VIEW: 'quotations.view',
  QUOTATIONS_CREATE: 'quotations.create',
  QUOTATIONS_UPDATE: 'quotations.update',

  // Customer Requests (Salesperson Scope)
  REQUESTS_VIEW: 'requests.view',
  REQUESTS_VIEW_ASSIGNED: 'requests.view_assigned',
  REQUESTS_UPDATE_ASSIGNED: 'requests.update_assigned',
  REQUESTS_COMMUNICATE: 'requests.communicate',
  REQUESTS_CONFIRM: 'requests.confirm',
  CUSTOMERS_VIEW_RELATED: 'customers.view_related',

  // Orders & System Logs
  ORDERS_VIEW: 'orders.view',
  SECURITY_VIEW: 'security.view',
  AUDIT_LOGS_VIEW: 'audit_logs.view',
  SETTINGS_VIEW: 'settings.view',
};

export const PERMISSION_GROUPS = [
  {
    id: 'dashboard',
    title: 'DASHBOARD & OVERVIEW',
    description: 'Executive reporting, key metrics, and operational overview access.',
    permissions: [
      { key: 'dashboard.view', label: 'View Executive Dashboard', action: 'View', description: 'Access main dashboard KPIs and metric cards' },
    ],
  },
  {
    id: 'products',
    title: 'PRODUCT CATALOGUE',
    description: 'Master products, SKU specifications, categories, and inventory items.',
    permissions: [
      { key: 'products.view', label: 'View Products', action: 'View', description: 'Search and inspect master product catalogue entries' },
      { key: 'products.create', label: 'Create Product', action: 'Create', description: 'Define new product records and SKU specifications' },
      { key: 'products.update', label: 'Edit Product', action: 'Update', description: 'Modify existing product descriptions, SKUs, and attributes' },
      { key: 'products.manage_status', label: 'Manage Product Status', action: 'Manage Status', description: 'Activate or deactivate products in the catalogue' },
      { key: 'categories.view', label: 'View Categories', action: 'View', description: 'Inspect product category classifications' },
      { key: 'categories.create', label: 'Create Category', action: 'Create', description: 'Add new category taxonomy nodes' },
      { key: 'categories.update', label: 'Edit Category', action: 'Update', description: 'Modify category names and parent structures' },
    ],
  },
  {
    id: 'pricing',
    title: 'PRICE LISTS & BASE PRICING',
    description: 'Master commercial price lists, currency catalogs, and product base prices.',
    permissions: [
      { key: 'pricing.view', label: 'View Price Lists', action: 'View', description: 'Inspect active and historical base price lists' },
      { key: 'pricing.create', label: 'Create Price List', action: 'Create', description: 'Configure new price list catalogs and currency catalogs' },
      { key: 'pricing.update', label: 'Edit Price List & Base Prices', action: 'Update', description: 'Modify price list headers and assign base product prices' },
      { key: 'pricing.manage_status', label: 'Manage Price List Status', action: 'Manage Status', description: 'Activate or deactivate master price lists' },
    ],
  },
  {
    id: 'discounts',
    title: 'DISCOUNT GOVERNANCE & TIERS',
    description: 'Permitted discount bands, maximum limits, and role escalation rules.',
    permissions: [
      { key: 'discounts.view', label: 'View Discount Tiers', action: 'View', description: 'Inspect active discount governance tiers and rules' },
      { key: 'discounts.create', label: 'Create Discount Tier', action: 'Create', description: 'Define new discount percentage bands and required approval roles' },
      { key: 'discounts.update', label: 'Edit Discount Tier', action: 'Update', description: 'Modify discount thresholds, priority order, and assigned roles' },
      { key: 'discounts.manage_status', label: 'Manage Discount Tier Status', action: 'Manage Status', description: 'Activate or deactivate discount governance rules' },
    ],
  },
  {
    id: 'approvals',
    title: 'APPROVAL CHAIN GOVERNANCE',
    description: 'Escalation thresholds, multi-tier approval sequences, and workflow rules.',
    permissions: [
      { key: 'approvals.view', label: 'View Approval Chain', action: 'View', description: 'Inspect discount escalation sequence and trigger conditions' },
      { key: 'approvals.update', label: 'Edit Approval Chain', action: 'Update', description: 'Configure escalation thresholds and assigned approval roles' },
    ],
  },
  {
    id: 'users',
    title: 'STAFF USER MANAGEMENT',
    description: 'Internal staff profiles, role assignments, department access, and account status.',
    permissions: [
      { key: 'users.view', label: 'View Staff Users', action: 'View', description: 'Inspect internal staff profiles and role assignments' },
      { key: 'users.create', label: 'Create Staff User', action: 'Create', description: 'Provision new staff user profiles and assign security roles' },
      { key: 'users.update', label: 'Edit Staff User', action: 'Update', description: 'Modify staff names, emails, and assigned security roles' },
      { key: 'users.manage_status', label: 'Manage User Status', action: 'Manage Status', description: 'Activate or deactivate staff user accounts' },
    ],
  },
  {
    id: 'roles',
    title: 'ROLES & ACCESS CONTROL (RBAC)',
    description: 'Security role definitions, permission matrices, and access policies.',
    permissions: [
      { key: 'roles.view', label: 'View Security Roles', action: 'View', description: 'Inspect RBAC security roles and permission matrices' },
      { key: 'roles.create', label: 'Create Security Role', action: 'Create', description: 'Define new security roles and assign capabilities' },
      { key: 'roles.update', label: 'Edit Security Role', action: 'Update', description: 'Modify role names, descriptions, and assigned permission matrices' },
      { key: 'permissions.view', label: 'View Permission Catalogue', action: 'View', description: 'Inspect global permission catalog and module capability matrices' },
    ],
  },
  {
    id: 'customers',
    title: 'CUSTOMER ACCOUNTS (SALES SCOPE)',
    description: 'Enterprise client relationships, contact profiles, and billing accounts.',
    permissions: [
      { key: 'customers.view', label: 'View Customers', action: 'View', description: 'Inspect client accounts and procurement contacts' },
      { key: 'customers.create', label: 'Create Customer', action: 'Create', description: 'Add new customer enterprise profiles' },
      { key: 'customers.update', label: 'Edit Customer', action: 'Update', description: 'Modify customer account details and credit terms' },
    ],
  },
  {
    id: 'quotations',
    title: 'SALES QUOTATIONS (SALES SCOPE)',
    description: 'Commercial proposals, line items, and sales quotation workflows.',
    permissions: [
      { key: 'quotations.view', label: 'View Quotations', action: 'View', description: 'Inspect sales proposals and quotation statuses' },
      { key: 'quotations.create', label: 'Create Quotation', action: 'Create', description: 'Draft new sales quotations and apply authorized discounts' },
      { key: 'quotations.update', label: 'Edit Quotation', action: 'Update', description: 'Modify line items and terms on draft quotations' },
    ],
  },
  {
    id: 'requests',
    title: 'CUSTOMER REQUESTS (SALES WORKSPACE)',
    description: 'Customer requirement requests, clarifications, and requirements confirmation.',
    permissions: [
      { key: 'requests.view', label: 'View All Requests', action: 'View', description: 'Inspect all customer requirement requests' },
      { key: 'requests.view_assigned', label: 'View Assigned Requests', action: 'View Assigned', description: 'Inspect requests assigned to authenticated salesperson' },
      { key: 'requests.update_assigned', label: 'Update Assigned Requests', action: 'Update', description: 'Review, claim, and update assigned requests' },
      { key: 'requests.communicate', label: 'Communicate with Customer', action: 'Communicate', description: 'Send and receive messages in customer request conversation' },
      { key: 'requests.confirm', label: 'Confirm Requirement', action: 'Confirm', description: 'Mark requirement request as confirmed for quotation handoff' },
    ],
  },
  {
    id: 'system',
    title: 'SYSTEM, SECURITY & AUDIT',
    description: 'Security logs, immutable audit trails, and platform settings.',
    permissions: [
      { key: 'orders.view', label: 'View Orders', action: 'View', description: 'Inspect confirmed sales orders' },
      { key: 'security.view', label: 'View Security Center', action: 'View', description: 'Access platform security policies and session logs' },
      { key: 'audit_logs.view', label: 'View Audit Logs', action: 'View', description: 'Inspect immutable system event records' },
      { key: 'settings.view', label: 'View Company Settings', action: 'View', description: 'Access corporate parameter defaults' },
    ],
  },
];
