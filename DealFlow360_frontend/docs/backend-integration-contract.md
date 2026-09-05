# DEALFLOW360 — BACKEND INTEGRATION CONTRACT & API SPECIFICATION

## Overview
This document specifies the official integration contract between the **DealFlow360 Frontend Application** and the **DealFlow360 Enterprise Backend Service**.

The Admin Foundation encompasses Phases 1 through 7:
1. Authentication & Security Boundary
2. Role-Based Access Control (RBAC) & Governance
3. Admin Executive Dashboard
4. Product Master & Taxonomy Management
5. Commercial Price List Management & Currency Catalogs
6. Discount Tiers Governance & Approval Escalation Chain
7. Staff User Account Management & Role/Permission Assignment

---

## 1. Authentication & Security Expectations

### 1.1 Auth Domains
- **Company Staff Entry**: `/m-entry-z7829a/login` (Obfuscated internal entry point)
- **Customer Entry**: `/c-entry-x9283f/login` (Obfuscated B2B portal entry point)

### 1.2 Authorization Token Handling
- Requests to protected API endpoints MUST include a Bearer JWT Token in the `Authorization` HTTP Header:
  ```http
  Authorization: Bearer <JWT_ACCESS_TOKEN>
  ```
- **Token Security**: Tokens, secrets, and password hashes must never be serialized or rendered in frontend responses, models, or audit views.

---

## 2. Shared Response & Error Formats

### 2.1 Standard Paginated List Response
```json
{
  "data": [ ... ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### 2.2 Standard Error Response
```json
{
  "status": 400,
  "message": "Validation failed on resource payload.",
  "errors": {
    "code": "A resource with this unique code already exists.",
    "email": "Email address must be unique across staff accounts."
  },
  "timestamp": "2026-09-05T19:00:00Z"
}
```

### 2.3 Expected HTTP Status Codes
- `200 OK`: Successful retrieval / update
- `201 Created`: Resource successfully created
- `400 Bad Request`: Validation failure or malformed payload
- `401 Unauthorized`: Session expired or invalid token
- `403 Forbidden`: Insufficient RBAC permission
- `404 Not Found`: Resource does not exist
- `409 Conflict`: Unique constraint violation (e.g. duplicate SKU/Code/Email)
- `422 Unprocessable Entity`: Business policy violation (e.g. deactivating sole Admin)
- `500 Internal Server Error`: Server failure

---

## 3. Data Models Specification

### 3.1 Product Model
```json
{
  "id": "prod_101",
  "name": "Enterprise Server Rack 42U",
  "sku": "SKU-SR-42U",
  "categoryId": "cat_servers",
  "categoryName": "Servers & Datacenter",
  "description": "Heavy-duty steel server rack enclosure.",
  "unitOfMeasure": "Unit",
  "status": "ACTIVE",
  "createdAt": "2026-06-01T10:00:00Z",
  "updatedAt": "2026-09-01T12:30:00Z"
}
```

### 3.2 Category Model
```json
{
  "id": "cat_servers",
  "name": "Servers & Datacenter",
  "code": "CAT-SERVERS",
  "parentId": null,
  "productCount": 12,
  "status": "ACTIVE"
}
```

### 3.3 Price List Model
```json
{
  "id": "pl_usd_2026",
  "name": "Standard US Enterprise Price List",
  "code": "PL-USD-ENT",
  "currency": "USD",
  "description": "Standard commercial base pricing list for North America.",
  "effectiveFrom": "2026-01-01T00:00:00Z",
  "effectiveTo": "2026-12-31T23:59:59Z",
  "isDefault": true,
  "status": "ACTIVE",
  "itemCount": 45,
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-08-15T09:12:00Z"
}
```

### 3.4 Price List Item Model
```json
{
  "id": "pli_501",
  "priceListId": "pl_usd_2026",
  "productId": "prod_101",
  "productName": "Enterprise Server Rack 42U",
  "sku": "SKU-SR-42U",
  "unitOfMeasure": "Unit",
  "basePrice": 2499.00,
  "currency": "USD",
  "createdAt": "2026-06-02T11:00:00Z"
}
```

### 3.5 Discount Tier Model
```json
{
  "id": "dt_tier_02",
  "name": "Manager Approval Discount Band",
  "code": "DT-MGR-02",
  "minDiscountPercent": 10.01,
  "maxDiscountPercent": 25.00,
  "requiresApproval": true,
  "requiredApprovalRole": "ROLE-MGR",
  "requiredApprovalRoleName": "Sales Manager",
  "priority": 2,
  "status": "ACTIVE",
  "createdAt": "2026-07-01T08:00:00Z"
}
```

### 3.6 Approval Chain Model
```json
{
  "id": "ac_rule_finance",
  "name": "High-Risk Discount Approval Rule",
  "thresholdPercent": 25.00,
  "approvalSequence": [
    { "level": 1, "roleCode": "ROLE-MGR", "roleName": "Sales Manager" },
    { "level": 2, "roleCode": "ROLE-FIN", "roleName": "Finance / Operations" }
  ],
  "autoRejectThresholdPercent": 50.00,
  "status": "ACTIVE"
}
```

### 3.7 Staff User Model
```json
{
  "id": "usr_admin_01",
  "firstName": "System",
  "lastName": "Administrator",
  "name": "System Administrator",
  "email": "admin@dealflow360.com",
  "roleId": "role_admin",
  "roleName": "Administrator",
  "roleCode": "ROLE-ADMIN",
  "department": "IT & Security Governance",
  "employeeCode": "EMP-001",
  "phone": "+1 (555) 019-2831",
  "status": "ACTIVE",
  "lastLoginAt": "2026-09-05T18:30:00Z",
  "createdAt": "2026-05-01T00:00:00Z",
  "updatedAt": "2026-09-05T12:00:00Z"
}
```

### 3.8 Role & Permission Model
```json
{
  "id": "role_salesperson",
  "name": "Salesperson",
  "code": "ROLE-SLS",
  "description": "Frontline commercial activity, client proposals, and standard quotation creation.",
  "isSystem": false,
  "userCount": 8,
  "status": "ACTIVE",
  "permissions": [
    "dashboard.view",
    "customers.view",
    "quotations.view", "quotations.create",
    "products.view", "categories.view",
    "pricing.view",
    "discounts.view"
  ]
}
```

---

## 4. API Endpoints Catalog

### 4.1 Products API
- `GET /api/v1/products` (`products.view`) — Query params: `search`, `categoryId`, `status`, `page`, `limit`
- `GET /api/v1/products/:id` (`products.view`)
- `POST /api/v1/products` (`products.create`)
- `PUT /api/v1/products/:id` (`products.update`)
- `PATCH /api/v1/products/:id/status` (`products.manage_status`)

### 4.2 Categories API
- `GET /api/v1/categories` (`categories.view`)
- `POST /api/v1/categories` (`categories.create`)
- `PUT /api/v1/categories/:id` (`categories.update`)

### 4.3 Price Lists API
- `GET /api/v1/price-lists` (`pricing.view`) — Query params: `search`, `status`, `page`, `limit`
- `GET /api/v1/price-lists/:id` (`pricing.view`)
- `POST /api/v1/price-lists` (`pricing.create`)
- `PUT /api/v1/price-lists/:id` (`pricing.update`)
- `PATCH /api/v1/price-lists/:id/status` (`pricing.manage_status`)
- `POST /api/v1/price-lists/:id/items` (`pricing.update`) — Assign product base price
- `PUT /api/v1/price-lists/:id/items/:itemId` (`pricing.update`) — Update base price
- `DELETE /api/v1/price-lists/:id/items/:itemId` (`pricing.update`) — Remove product base price

### 4.4 Discount Tiers API
- `GET /api/v1/discount-tiers` (`discounts.view`)
- `GET /api/v1/discount-tiers/:id` (`discounts.view`)
- `POST /api/v1/discount-tiers` (`discounts.create`)
- `PUT /api/v1/discount-tiers/:id` (`discounts.update`)
- `PATCH /api/v1/discount-tiers/:id/status` (`discounts.manage_status`)

### 4.5 Approval Chain API
- `GET /api/v1/approval-chain` (`approvals.view`)
- `PUT /api/v1/approval-chain` (`approvals.update`)

### 4.6 Staff Users API
- `GET /api/v1/users` (`users.view`) — Query params: `search`, `roleId`, `status`, `page`, `limit`
- `GET /api/v1/users/:id` (`users.view`) — Returns user and `effectivePermissions`
- `POST /api/v1/users` (`users.create`)
- `PUT /api/v1/users/:id` (`users.update`)
- `PATCH /api/v1/users/:id/status` (`users.manage_status`)

### 4.7 Security Roles & Permissions API
- `GET /api/v1/roles` (`roles.view`)
- `GET /api/v1/roles/:id` (`roles.view`)
- `POST /api/v1/roles` (`roles.create`)
- `PUT /api/v1/roles/:id` (`roles.update`)
- `PATCH /api/v1/roles/:id/status` (`roles.update`)
- `PUT /api/v1/roles/:id/permissions` (`roles.update`)
- `GET /api/v1/permissions` (`permissions.view`)

---

## 5. Architectural Handoff & Boundary Principles

1. **Admin Responsibility Boundary**:
   - Admin configures Products, Categories, Price Lists, Base Prices, Discount Rules, Approval Rules, Users, Roles, and Permissions.
   - Admin does **NOT** process individual quotation approvals, customer negotiations, customer orders, or invoice generation.

2. **Future Salesperson Consumption**:
   - The future Salesperson module will read active master Products, active Price Lists, and authorized Discount Bands to draft quotations.

3. **Future Customer Portal Isolation**:
   - Customer Portal users operate under a separate identity domain and authentication endpoint (`/c-entry-x9283f/login`). Customer accounts MUST NOT be assigned Company Admin permissions or roles.
