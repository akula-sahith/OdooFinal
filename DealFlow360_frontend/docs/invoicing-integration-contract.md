# DealFlow360 Phase 14 — Commercial Invoicing Module Integration Contract

## 1. Executive Summary
Phase 14 converts completed/delivered/billable sales orders into official commercial invoices.
It bridges the operational fulfillment lifecycle (Phase 13) to financial billing, preserving historical commercial snapshots and preparing payment readiness fields (`amountPaid`, `amountDue`) for Phase 15 without executing payment collection.

---

## 2. Commercial Invoicing Lifecycle & Status Governance Transition Map

```
Accepted Quotation
       ↓
Sales Order (Confirmed / Delivered)
       ↓
Create Invoice (Select Billable Order)
       ↓
Draft Invoice (DRAFT) — Editable
       ↓
Issue Invoice (ISSUED) — Immutable Historical Snapshot
       ↓
Customer Statement / Billing Receipt
       ↓
[Phase 15 — Payment Processing: PARTIALLY_PAID / PAID]
```

### Status Transition Governance Rules:
- `DRAFT` → `ISSUED`, `CANCELLED`
- `ISSUED` → `PARTIALLY_PAID`, `PAID`, `OVERDUE`, `VOID`, `CANCELLED`
- `PARTIALLY_PAID` → `PAID`, `OVERDUE`, `VOID`
- `OVERDUE` → `PARTIALLY_PAID`, `PAID`, `VOID`
- Terminal States: `PAID`, `VOID`, `CANCELLED`
- Arbitrary jumps (e.g. `PAID` → `DRAFT` or `VOID` → `ISSUED`) are strictly prohibited by validation logic.

---

## 3. Historical Commercial Snapshot Protection
Upon invoice generation:
1. Product Name (`productNameSnapshot`), SKU (`skuSnapshot`), Description (`descriptionSnapshot`), Unit Prices, Discounts, and Tax Rates are snapshot into line item records.
2. Billing and Shipping Address snapshots are recorded.
3. Subsequent changes to Master Products, Price Lists, Discount Tiers, or Customer Accounts **NEVER** overwrite existing invoice values.

---

## 4. Financial Calculation Engine
- $\text{Line Subtotal} = \text{Quantity} \times \text{Unit Price}$
- $\text{Taxable Amount} = \max(0, \text{Line Subtotal} - \text{Discount})$
- $\text{Line Tax} = \text{Taxable Amount} \times \frac{\text{Tax Rate}}{100}$
- $\text{Line Total} = \text{Taxable Amount} + \text{Line Tax}$
- $\text{Subtotal} = \sum \text{Line Subtotal}$
- $\text{Discount Total} = \sum \text{Discount}$
- $\text{Tax Total} = \sum \text{Line Tax}$
- $\text{Grand Total} = \text{Subtotal} - \text{Discount Total} + \text{Tax Total}$
- $\text{Amount Due} = \text{Grand Total} - \text{Amount Paid}$

---

## 5. Duplicate Protection & 409 Conflict Handling
- Before creating an invoice, the service checks whether an active (non-cancelled, non-void) invoice already exists for the originating Sales Order.
- If a duplicate invoice is detected, a controlled `409 Conflict` error is returned to prevent double-billing.

---

## 6. Phase 15 Payment Readiness Boundary
Phase 14 maintains:
- `amountPaid` (default $0.00)
- `amountDue` (= `grandTotal` - `amountPaid`)
- `status` (`DRAFT`, `ISSUED`, `OVERDUE`, etc.)

Phase 14 explicitly **DOES NOT**:
- Process credit cards or bank transfers
- Mark invoices as `PAID` via dummy UI clicks
- Execute financial refunds or credit memos
