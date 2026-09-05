# DEALFLOW360 — PHASE 12 INVENTORY & WAREHOUSE MANAGEMENT CONTRACT

## Overview
This document defines the architecture, data models, calculations, movement ledger rules, reservation contracts, and security boundaries for **Phase 12 — Inventory & Warehouse Management**.

---

## 1. Domain Architecture & Phase Boundaries

```
PRODUCT  ──>  PRICE LIST  ──>  QUOTATION  ──>  ORDER  ──>  INVENTORY  ──>  WAREHOUSE  ──>  RESERVATION  ──>  ALLOCATION  ──> [PHASE 13 FULFILLMENT]
```

### Phase 12 Scope:
- Warehouse Management & Locations (`ACTIVE`, `INACTIVE`)
- Physical Stock Records & Counts (`On Hand`, `Reserved`, `Available`)
- Stock Formula: `Available Quantity = On Hand Quantity - Reserved Quantity`
- Auditable Stock Movement Ledger (Receipts, Adjustments, Reservations, Releases, Allocations, Transfers)
- Order-to-Inventory Stock Reservations & Allocations
- Warehouse-to-Warehouse Stock Transfers
- Low-Stock Alerting & Reorder Thresholds

### Explicit Exclusions (Phase 13+):
- Picking & Packing execution
- Shipment creation & carrier integration
- Tracking numbers & Delivery management
- Invoice generation & Payment collection

---

## 2. Core Stock Calculation Rules

1. **Available Stock**: `availableQuantity = max(0, onHandQuantity - reservedQuantity)`
2. **Reserved Boundary**: `reservedQuantity` can **NEVER** exceed `onHandQuantity`.
3. **No Negative Stock**: Stock counts cannot drop below 0 unless explicit backorder functionality is enabled.
4. **Movement Audit Trail**: Physical stock changes generate immutable `InventoryMovement` log entries rather than un-audited table overwrites.

---

## 3. Movement Ledger Types

| Movement Type | Action | On Hand Impact | Reserved Impact | Available Impact |
|---|---|---|---|---|
| `STOCK_RECEIPT` | Purchase/Supplier Receipt | $+Qty$ | $0$ | $+Qty$ |
| `STOCK_ADJUSTMENT` | Manual Count/Damage Adjustment | $+/- Qty$ | $0$ | $+/- Qty$ |
| `STOCK_RESERVATION` | Order Stock Reservation | $0$ | $+Qty$ | $-Qty$ |
| `STOCK_RELEASE` | Reservation Cancelled | $0$ | $-Qty$ | $+Qty$ |
| `STOCK_ALLOCATION` | Warehouse Allocation | $0$ | $0$ | $0$ |
| `STOCK_TRANSFER_OUT` | Inter-warehouse Dispatch | $-Qty$ | $0$ | $-Qty$ |
| `STOCK_TRANSFER_IN` | Inter-warehouse Receipt | $+Qty$ | $0$ | $+Qty$ |

---

## 4. API Endpoints

### 4.1 Warehouse Management
- `GET /api/v1/company/warehouses`
- `GET /api/v1/company/warehouses/:id`
- `POST /api/v1/company/warehouses`
- `PUT /api/v1/company/warehouses/:id`
- `PATCH /api/v1/company/warehouses/:id/status`

### 4.2 Stock & Movements
- `GET /api/v1/company/inventory/stock`
- `GET /api/v1/company/inventory/product/:productId`
- `POST /api/v1/company/inventory/adjustments`
- `GET /api/v1/company/inventory/movements`
- `POST /api/v1/company/inventory/transfers`

### 4.3 Order-to-Inventory Reservations & Allocations
- `POST /api/v1/company/orders/:orderId/inventory-check`
- `POST /api/v1/company/orders/:orderId/reserve-inventory`
- `POST /api/v1/company/inventory/reservations/:id/release`
- `POST /api/v1/company/orders/:orderId/allocate-inventory`

---

## 5. Security & Governance Matrix

| Resource / Action | Allowed Roles | Customer Access |
|---|---|---|
| View Warehouses | Admin, Operations, Sales | **STRICTLY FORBIDDEN** |
| Create/Edit Warehouses | Admin, Operations | **STRICTLY FORBIDDEN** |
| View Master Stock | Admin, Operations, Sales | **STRICTLY FORBIDDEN** |
| Stock Adjustments | Admin, Authorized Operations | **STRICTLY FORBIDDEN** |
| Reserve Stock for Order | Operations, Sales Executive | **STRICTLY FORBIDDEN** |
| Warehouse Transfer | Operations Lead, Admin | **STRICTLY FORBIDDEN** |
