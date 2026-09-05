# DealFlow360 — Backend & Odoo Integration Master Handoff Specification

> **Document Version**: 1.0.0  
> **Status**: Production Frontend Verified — Ready for Backend & Odoo Integration  
> **Target Audience**: Backend Engineers, Odoo Developers, System Architects  

---

## Executive Summary & Architecture Overview

This document provides a comprehensive, deep-dive specification for the backend and Odoo development teams. The **DealFlow360** frontend has completed full system-wide quality gate verification. Every route, UI component, workflow, and customer/salesperson/admin role journey has been built and validated.

### Key Architectural Principle
The frontend architecture enforces complete separation of concerns:
```
[React Page / View] ──> [Custom Hook] ──> [Feature Service] ──> [apiClient.js] ──> [Odoo / REST API]
```
**No component directly executes fetch calls or embeds backend URLs.** Switching from the offline local preview store to real backend APIs requires **zero changes to UI components**—only configuring API endpoints in the central service layer and environment configuration (`VITE_API_BASE_URL`).

---

## 1. Frontend Inventory — What Has Been Built

### 1.1 Enterprise Module Overview

| Module | Key Routes | Major Features & Workflows |
| :--- | :--- | :--- |
| **Authentication & Auth** | `/login`<br>`/c-entry-x9283f/login`<br>`/m-entry-z7829a/login` | Dual portal auth (Company Staff vs. B2B Customer Portal), MFA (TOTP), token persistence, RBAC permission evaluation (`hasPermission`). |
| **Admin Governance** | `/company/admin`<br>`/company/users`<br>`/company/roles`<br>`/company/permissions`<br>`/company/settings` | Central governance dashboard, staff user administration, role assignment, permission catalogue (`users.view`, `roles.view`), tax config, currency config, immutable audit log viewer. |
| **Products & Catalog** | `/company/products`<br>`/company/products/new`<br>`/company/products/:id`<br>`/company/products/categories` | Product master catalogue, SKU management, categories hierarchy, stock unit assignment, status toggle (`ACTIVE`/`INACTIVE`). |
| **Price Lists** | `/company/price-lists`<br>`/company/price-lists/new`<br>`/company/price-lists/:id` | Multi-currency base price lists, effective date windows, product price item overrides. Strictly handles base commercial prices (no discount/quotation logic). |
| **Discount Tiers & Approvals** | `/company/discount-tiers`<br>`/company/approval-chain`<br>`/company/approvals` | Discount threshold rules, approval chain escalation steps, approval queue (`ApprovalQueuePage`), manager review (Approve / Reject / Return with comments). |
| **Customer Management** | `/company/customers`<br>`/company/customers/:id` | Enterprise B2B client directory, credit limit enforcement, lifetime revenue tracking, outstanding balances, account status. |
| **Quotations & Proposals** | `/company/quotations`<br>`/company/quotations/new`<br>`/company/quotations/:id`<br>`/company/quotations/:id/finalize` | B2B proposal builder, automated tax/discount calculations, PDF proposal view, submission, approval trigger, customer sending, revision history (`v1` $\rightarrow$ `v2` $\rightarrow$ `v3`). |
| **Customer B2B Portal** | `/customer/dashboard`<br>`/customer/quotations`<br>`/customer/orders`<br>`/customer/invoices`<br>`/customer/payments` | External client workspace: review proposals, submit change requests, accept/reject proposals, track sales orders, view shipment status, view invoices, submit payments. |
| **Contextual Messaging** | `/company/messages`<br>`/customer/messages` | Contextual conversation threads linked to specific entities (`quotationId`, `orderId`, `customerId`). Complete data isolation per customer account. |
| **Sales Orders** | `/company/orders`<br>`/company/orders/:id` | Sales order pipeline originating from accepted quotations (`SO-2026-XXXX`), stage progression (`CREATED` $\rightarrow$ `CONFIRMED` $\rightarrow$ `PROCESSING` $\rightarrow$ `FULFILLED` $\rightarrow$ `COMPLETED`). |
| **Inventory & Warehouses** | `/company/inventory`<br>`/company/inventory/stock`<br>`/company/inventory/warehouses` | Real-time stock levels per warehouse, stock movements, manual stock adjustments, low/out-of-stock alerts, warehouse master directory. |
| **Fulfillment & Shipping** | `/company/fulfillment`<br>`/company/fulfillment/picking`<br>`/company/fulfillment/packing`<br>`/company/fulfillment/shipments` | Picking queue, packing queue, carrier assignment, shipment generation with tracking numbers (`TRK-XXXX`), customer order tracking view. |
| **Commercial Invoices** | `/company/invoices`<br>`/company/invoices/new`<br>`/company/invoices/:id` | B2B commercial invoice generation from confirmed sales orders (`INV-2026-XXXX`), tax breakdowns, payment status (`DRAFT`, `ISSUED`, `PARTIALLY_PAID`, `PAID`, `OVERDUE`). |
| **Payments** | `/company/payments`<br>`/company/payments/:id` | B2B payment recording against invoices, full/partial payment support, payment method tracking, receipt generation. |
| **Analytics & Reporting** | `/company/analytics`<br>`/company/analytics/sales`<br>`/company/analytics/finance`<br>`/company/analytics/fulfillment` | Role-dispatched reporting dashboards (Sales, Quotations, Orders, Finance, Fulfillment, Customer Analytics). |

---

## 2. Business Flow & State Machines

### 2.1 Master Commercial Continuum
The frontend strictly maintains this non-negotiable enterprise relationship:

$$\begin{aligned}
\text{Product} &\longrightarrow \text{Price List} \longrightarrow \text{Discount Tier} \longrightarrow \text{Quotation (Draft)} \longrightarrow \text{Approval Evaluation} \\
&\longrightarrow \text{Approver Review (if required)} \longrightarrow \text{Sent to Customer} \longrightarrow \text{Customer Portal Review} \\
&\longrightarrow \text{Contextual Negotiation / Change Request} \longrightarrow \text{Salesperson Revision (v1 \rightarrow v2 \rightarrow v3)} \\
&\longrightarrow \text{Re-Approval (if recalculated terms exceed threshold)} \longrightarrow \text{Customer Acceptance} \\
&\longrightarrow \text{Commercial Closure} \longrightarrow \text{Order Generation} \longrightarrow \text{Inventory Stock Check \& Reservation} \\
&\longrightarrow \text{Fulfillment (Pick \rightarrow Pack \rightarrow Ship)} \longrightarrow \text{Invoice Generation} \longrightarrow \text{Payment Recording}
\end{aligned}$$

### 2.2 Quotation State Machine Specification

```
                          ┌──────────────┐
                          │    DRAFT     │
                          └──────┬───────┘
                                 │ Submit
                                 ▼
                     ┌───────────────────────┐
                     │   PENDING_APPROVAL    │
                     └───────────┬───────────┘
                                 │ Approved (or Auto-Approved)
                                 ▼
                          ┌──────────────┐
                          │   APPROVED   │
                          └──────┬───────┘
                                 │ Send to Customer
                                 ▼
                     ┌───────────────────────┐
                     │   SENT_TO_CUSTOMER    │
                     └───────────┬───────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 │ Customer Requests Change      │ Customer Accepts
                 ▼                               ▼
    ┌───────────────────────┐       ┌───────────────────────┐
    │   UNDER_NEGOTIATION   │       │       ACCEPTED        │
    └────────────┬──────────┘       └───────────┬───────────┘
                 │ Create Revision              │
                 ▼                              ▼
    ┌───────────────────────┐       ┌───────────────────────┐
    │       REVISION        │       │   COMMERCIAL_CLOSED   │
    └────────────┬──────────┘       └───────────┬───────────┘
                 │                              │
                 └───────► (Re-evaluate) ───────┼──► READY_FOR_ORDER
```

**Terminal States**: `REJECTED`, `EXPIRED`, `CANCELLED`.

---

## 3. API Readiness — What the Frontend is Waiting For

### 3.1 Authentication & User Session API Contracts

#### `POST /api/v1/auth/login`
- **Request Payload**:
  ```json
  {
    "email": "sales@company.com",
    "password": "SecretPassword123!"
  }
  ```
- **Expected Response (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "USR-1002",
      "name": "Sarah Jenkins",
      "email": "sales@company.com",
      "role": "SALESPERSON",
      "companyId": "COMP-001",
      "permissions": [
        "dashboard.view",
        "requests.view",
        "customers.view",
        "quotations.view",
        "quotations.create",
        "quotations.update",
        "orders.view"
      ]
    }
  }
  ```

#### `POST /api/v1/auth/customer/login`
- **Request Payload**:
  ```json
  {
    "email": "procurement@apexlogistics.com",
    "password": "CustomerPassword123!"
  }
  ```
- **Expected Response (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "customerUser": {
      "id": "CUST-USER-001",
      "customerId": "CUST-001",
      "companyName": "Apex Global Logistics Ltd",
      "contactPerson": "Robert Sterling",
      "email": "procurement@apexlogistics.com"
    }
  }
  ```

---

### 3.2 Catalog & Pricing API Contracts

#### `GET /api/v1/products`
- **Query Parameters**: `page=1`, `limit=20`, `search=filter`, `category=CAT-01`, `status=ACTIVE`
- **Expected Response (200 OK)**:
  ```json
  {
    "data": [
      {
        "id": "PROD-1001",
        "name": "Industrial Water Filtration System",
        "sku": "FILT-IND-500",
        "categoryId": "CAT-01",
        "categoryName": "Industrial Machinery",
        "unitOfMeasure": "Units",
        "listPriceUSD": 45000.00,
        "stockOnHand": 14,
        "status": "ACTIVE"
      }
    ],
    "pagination": { "total": 42, "page": 1, "totalPages": 3 }
  }
  ```

#### `GET /api/v1/price-lists`
- **Expected Response (200 OK)**:
  ```json
  {
    "data": [
      {
        "id": "PL-USD-STD",
        "name": "Standard USD Enterprise Price List",
        "currency": "USD",
        "isDefault": true,
        "status": "ACTIVE",
        "items": [
          { "productId": "PROD-1001", "basePriceUSD": 45000.00 },
          { "productId": "PROD-1002", "basePriceUSD": 13950.00 }
        ]
      }
    ]
  }
  ```

---

### 3.3 Quotation & Negotiation API Contracts

#### `POST /api/v1/quotations`
- **Request Payload**:
  ```json
  {
    "customerId": "CUST-001",
    "priceListId": "PL-USD-STD",
    "items": [
      { "productId": "PROD-1001", "quantity": 2, "unitPriceUSD": 45000.00, "discountPercent": 5.0 },
      { "productId": "PROD-1002", "quantity": 4, "unitPriceUSD": 13950.00, "discountPercent": 10.0 }
    ],
    "paymentTerms": "NET_30",
    "validUntil": "2026-10-15",
    "notes": "B2B Annual Supply Agreement Tier 1"
  }
  ```
- **Expected Response (201 Created)**:
  ```json
  {
    "id": "QT-2026-0042",
    "version": 1,
    "status": "DRAFT",
    "subtotalUSD": 140800.00,
    "discountTotalUSD": 10080.00,
    "taxTotalUSD": 15096.00,
    "grandTotalUSD": 145816.00,
    "requiresApproval": true,
    "approvalReason": "Discount on PROD-1002 exceeds 8% standard tier limit."
  }
  ```

#### `POST /api/v1/quotations/:id/revise`
- **Request Payload**:
  ```json
  {
    "reason": "Customer requested bulk pricing discount for quantity increase.",
    "updatedItems": [
      { "productId": "PROD-1001", "quantity": 3, "unitPriceUSD": 42000.00 }
    ]
  }
  ```
- **Expected Response (200 OK)**:
  ```json
  {
    "id": "QT-2026-0042",
    "version": 2,
    "previousVersionId": "QT-2026-0042-V1",
    "status": "PENDING_APPROVAL",
    "requiresApproval": true
  }
  ```

---

### 3.4 Orders, Fulfillment, Invoicing & Payments API Contracts

#### `POST /api/v1/orders/from-quotation`
- **Request Payload**: `{ "quotationId": "QT-2026-0042" }`
- **Expected Response (201 Created)**:
  ```json
  {
    "id": "SO-2026-0101",
    "sourceQuotationId": "QT-2026-0042",
    "customerId": "CUST-001",
    "totalAmountUSD": 145816.00,
    "stage": "PROCESSING",
    "createdAt": "2026-09-05T22:00:00Z"
  }
  ```

#### `POST /api/v1/invoices/from-order`
- **Request Payload**: `{ "orderId": "SO-2026-0101" }`
- **Expected Response (201 Created)**:
  ```json
  {
    "id": "INV-2026-0089",
    "orderId": "SO-2026-0101",
    "customerId": "CUST-001",
    "amountDueUSD": 145816.00,
    "amountPaidUSD": 0.00,
    "status": "ISSUED",
    "dueDate": "2026-10-05"
  }
  ```

#### `POST /api/v1/payments`
- **Request Payload**:
  ```json
  {
    "invoiceId": "INV-2026-0089",
    "amountPaidUSD": 72908.00,
    "paymentMethod": "WIRE_TRANSFER",
    "referenceNumber": "WIRE-REF-998822"
  }
  ```
- **Expected Response (201 Created)**:
  ```json
  {
    "id": "PAY-2026-0045",
    "invoiceId": "INV-2026-0089",
    "amountPaidUSD": 72908.00,
    "invoiceRemainingUSD": 72908.00,
    "invoiceStatus": "PARTIALLY_PAID"
  }
  ```

---

### 3.5 Contextual Messaging API Contract

#### `POST /api/v1/conversations/:id/messages`
- **Request Payload**:
  ```json
  {
    "quotationId": "QT-2026-0042",
    "senderId": "CUST-USER-001",
    "senderType": "CUSTOMER",
    "content": "Can we increase the quantity of unit #1 to 3 items if you offer 5% additional discount?"
  }
  ```
- **Expected Response (201 Created)**:
  ```json
  {
    "messageId": "MSG-99201",
    "conversationId": "CONV-QT-2026-0042",
    "timestamp": "2026-09-05T22:30:00Z",
    "status": "DELIVERED"
  }
  ```

---

## 4. Technical Odoo Model Mapping Reference

For Odoo 16 / 17 backend developers, the frontend data structures map directly to native Odoo ORM models:

| DealFlow360 Frontend Domain | Native Odoo Model | Key Technical Fields | API Contract |
| :--- | :--- | :--- | :--- |
| **Product Catalogue** | `product.template`<br>`product.product` | `id`, `name`, `default_code` (SKU), `list_price`, `qty_available`, `categ_id` | `/api/v1/products` |
| **Categories** | `product.category` | `id`, `name`, `parent_id` | `/api/v1/categories` |
| **Price Lists** | `product.pricelist`<br>`product.pricelist.item` | `id`, `name`, `currency_id`, `item_ids` | `/api/v1/price-lists` |
| **B2B Customers** | `res.partner` | `id`, `name`, `email`, `phone`, `credit_limit`, `total_invoiced` | `/api/v1/customers` |
| **Quotations** | `sale.order` (`state='draft'/'sent'`) | `id`, `name` (`QT-...`), `partner_id`, `order_line`, `amount_total` | `/api/v1/quotations` |
| **Approvals** | `tier.validation` / Custom Rule | `id`, `res_model`, `res_id`, `reviewer_ids`, `state` | `/api/v1/approvals` |
| **Sales Orders** | `sale.order` (`state='sale'`) | `id`, `name` (`SO-...`), `date_order`, `picking_ids`, `invoice_ids` | `/api/v1/orders` |
| **Inventory / Stock** | `stock.quant`<br>`stock.location` | `product_id`, `location_id`, `quantity`, `reserved_quantity` | `/api/v1/inventory/stock` |
| **Fulfillment / Delivery** | `stock.picking` | `id`, `name` (`WH/OUT/...`), `state`, `carrier_id`, `carrier_tracking_ref` | `/api/v1/fulfillment` |
| **Commercial Invoices** | `account.move` (`move_type='out_invoice'`) | `id`, `name` (`INV/...`), `payment_state`, `amount_residual` | `/api/v1/invoices` |
| **Payments** | `account.payment` | `id`, `name`, `amount`, `payment_type`, `ref` | `/api/v1/payments` |

---

## 5. Security, Error Handling & System Expectations

1. **Authorization Headers**:
   Every API request sent from the frontend `apiClient.js` includes:
   ```http
   Authorization: Bearer <JWT_TOKEN>
   X-Company-ID: COMP-001
   Content-Type: application/json
   ```

2. **Standardized Error Handling**:
   Backend error responses must return standard JSON structures so `apiClient.js` can display appropriate UI alerts:
   ```json
   {
     "error": {
       "code": "DISCOUNT_THRESHOLD_EXCEEDED",
       "message": "The requested discount of 15% exceeds your tier limit of 10%. Approval is required.",
       "details": {
         "allowedMax": 10.0,
         "requested": 15.0
       }
     }
   }
   ```

3. **HTTP Status Code Spectrum**:
   - `200 OK` / `201 Created`: Successful query or entity creation.
   - `400 Bad Request`: Payload validation failure (triggers inline form field validation in UI).
   - `401 Unauthorized`: Session expired (triggers automatic redirect to `/login`).
   - `403 Forbidden`: Insufficient RBAC permission (triggers `/company/403` screen).
   - `404 Not Found`: Resource missing (triggers `/company/404` screen).
   - `409 Conflict`: Business rule violation (e.g. duplicate SKU or updating locked order).
   - `500 Internal Server Error`: System failure (triggers user-facing retry toast).

---

$$\mathbf{\text{SUMMARY: THE FRONTEND IS 100\% VERIFIED, TESTED, AND READY FOR API CONNECTION}}$$
