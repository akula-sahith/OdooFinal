# DealFlow360 Phase 15 — Payment Management Integration Contract

## 1. Executive Summary
Phase 15 connects commercial invoices (`ISSUED`, `PARTIALLY_PAID`, `OVERDUE`) to official payment transactions.
It maintains accurate ledger records, calculates outstanding balances, automatically updates invoice status based on financial state, supports configurable payment methods, provides cancellation audit trails, and feeds customer portal payment history.

---

## 2. Payment Lifecycle & Invoice Balance Integration Flow

```
Invoice (ISSUED / PARTIALLY_PAID / OVERDUE)
       ↓
Record Payment (Select Invoice, Amount, Payment Method, Date, Reference)
       ↓
Amount Validation (Amount > 0 and Amount <= Outstanding Balance)
       ↓
Payment Recorded (COMPLETED)
       ↓
Recalculate Balance (Amount Paid += Payment, Amount Due = Grand Total - Amount Paid)
       ↓
Update Invoice Status (PARTIALLY_PAID if Amount Due > 0, PAID if Amount Due = 0)
```

---

## 3. Financial Balance Invariants & Governance Rules
- $\text{Amount Paid} = \sum \text{COMPLETED Payments}$
- $\text{Amount Due} = \max(0, \text{Grand Total} - \text{Amount Paid})$
- Payments with status `PENDING`, `PROCESSING`, `FAILED`, `CANCELLED`, or `REFUNDED` **DO NOT** contribute to `Amount Paid`.
- Payment amount must not exceed `amountDue` (prevents arbitrary overpayments).
- Payment currency must strictly match the invoice currency.
- Payments cannot be recorded against `VOID` or `CANCELLED` invoices.

---

## 4. Controlled Payment Cancellation Architecture
- Cancelling a completed payment requires a mandatory detailed reason ($\ge 5$ characters) and user authorization.
- The payment record status changes to `CANCELLED` (record is never deleted from storage).
- The invoice balance and status are automatically recalculated upon cancellation.

---

## 5. Security & Isolation Boundaries
- **Backend Ownership**: Organization ownership (`organizationId`) is derived from authenticated sessions.
- **Customer Data Isolation**: Customers accessing `/customer/payments` see only payment records associated with their own account.
- **Concurrency & Idempotency**: Payment transaction reference numbers and idempotency validation prevent duplicate submissions from double-clicking or network retries.

---

## 6. Phase 16 Portal Preparedness
Phase 15 exposes:
- Payment history timelines
- Payment receipt details
- Remittance notes & bank reference numbers
- Account balances (`grandTotal`, `amountPaid`, `amountDue`)

Phase 16 will consume these payment state APIs to render the comprehensive **Customer Order & Billing Portal**.
