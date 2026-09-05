# DEALFLOW360 — PHASE 10.4 QUOTATION APPROVAL INTEGRATION CONTRACT

## Overview
This document defines the integration contract between the DealFlow360 Frontend and Backend for Phase 10.4 — Quotation Approval Workflow (Manager $\rightarrow$ Finance/Ops).

---

## 1. Core Principles & Governance Boundary

1. **Role Boundary**:
   - **Salesperson**: Creates, requests discounts, submits for approval, and edits upon revision request. Cannot self-approve or approve others.
   - **Sales Manager**: Reviews Tier 1 (`PENDING_MANAGER_APPROVAL`). Approves, rejects, or requests revision.
   - **Finance / Operations**: Reviews Tier 2 (`PENDING_FINANCE_APPROVAL`). Approves, rejects, or requests revision.
   - **Admin**: Manages system governance config and users; does **NOT** approve individual quotations.
2. **Immutable Review Snapshot**: Approvers review an immutable commercial snapshot. If quotation data changes during review, previous approvals are invalidated.
3. **Mandatory Reasons**: Rejections and Revision requests strictly require non-empty reasons/comments.
4. **Optimistic Concurrency Protection**: If a quotation is processed concurrently by another user, backend returns `409 Conflict`.

---

## 2. Approval State Machine

```
               ┌───────────────────────┐
               │         DRAFT         │
               └───────────┬───────────┘
                           │ Submit for Approval
                           ▼
               ┌───────────────────────┐
               │    PENDING_MANAGER    │
               │       APPROVAL        │
               └─┬─────────┬─────────┬─┘
        Approve  │  Reject │ Revision│ Escalate
                 │         │         │
                 ▼         │         ▼
          ┌─────────────┐  │   ┌───────────────────┐
          │  APPROVED   │  │   │PENDING_FINANCE_APP│
          └─────────────┘  │   └─────────┬─────────┘
                           │             │ Approve / Reject / Revision
                           ▼             ▼
                    ┌──────────────┬─────────────┐
                    │   REJECTED   │  APPROVED   │
                    └──────────────┴─────────────┘
```

---

## 3. API Endpoints

### 3.1 Fetch Approval Queue
`GET /api/v1/company/approvals`

---

### 3.2 Submit Quotation for Approval
`POST /api/v1/company/approvals/:quotationId/submit`

---

### 3.3 Approve Quotation
`POST /api/v1/company/approvals/:quotationId/approve`

**Payload:**
```json
{
  "comment": "Commercial proposal authorized within tier limit."
}
```

---

### 3.4 Reject Quotation
`POST /api/v1/company/approvals/:quotationId/reject`

**Payload:**
```json
{
  "reason": "Requested 18% discount exceeds maximum profit margin threshold for Tier 4 hardware."
}
```

---

### 3.5 Request Revision
`POST /api/v1/company/approvals/:quotationId/request-revision`

**Payload:**
```json
{
  "reason": "Discount exceeds salesperson tier. Please adjust requested discount to 5% or below and resubmit."
}
```

---

## 4. Security & Governance Matrix

| Action | Required Permission | Allowed Roles |
|---|---|---|
| View Approval Queue | `approvals.view` | Sales Manager, Finance, Admin (Read-only) |
| View Proposal Detail | `approvals.view` | Sales Manager, Finance, Admin |
| Approve Quotation | `approvals.approve` | Sales Manager (Tier 1), Finance (Tier 2) |
| Reject Quotation | `approvals.approve` | Sales Manager (Tier 1), Finance (Tier 2) |
| Request Revision | `approvals.request_revision` | Sales Manager (Tier 1), Finance (Tier 2) |
| Self-Approval | N/A | **STRICTLY PROHIBITED** (`creatorId !== approverId`) |
| Admin Approval | N/A | **STRICTLY PROHIBITED** (Admin does not approve proposals) |

---

## 5. PHASE 10.5 — CUSTOMER QUOTATION REVIEW, RESPONSE & NEGOTIATION CONTRACT

### 5.1 Core Customer Security & Isolation Principles

1. **Explicit DTO Boundary**: Internal governance fields (e.g. `approvalLevel`, `managerComments`, `financeComments`, `riskScore`, `discountAuthority`, `internalUserIds`, `internalAuditEvents`) are **STRICTLY EXCLUDED** from all customer responses (`/api/v1/customer/quotations*`).
2. **IDOR & Ownership Verification**: Backend resolves customer identity exclusively from authenticated session context. Customers can only view/action quotations belonging to their account (`customerId`).
3. **No Direct Commercial Mutation**: Customers cannot directly alter unit base prices, discount percentages, or quantities. Commercial change requests create a negotiation message thread without modifying quotation values directly.
4. **Optimistic Concurrency Protection**: Customer action requests (`accept`, `reject`, `request-changes`) accept `expectedVersion`. If a salesperson publishes a newer version in the interim, backend returns `409 Conflict`.

### 5.2 Customer Quotation Endpoints

#### 5.2.1 List Customer Quotations
`GET /api/v1/customer/quotations`

**Query Parameters:**
`search`, `status` (`SENT`, `UNDER_REVIEW`, `NEGOTIATION`, `REVISION_AVAILABLE`, `ACCEPTED`, `REJECTED`, `EXPIRED`), `page`, `limit`

#### 5.2.2 Fetch Customer Quotation Detail
`GET /api/v1/customer/quotations/:quotationId`

#### 5.2.3 Fetch Customer-Visible Version History
`GET /api/v1/customer/quotations/:quotationId/versions`

#### 5.2.4 Accept Quotation Proposal
`POST /api/v1/customer/quotations/:quotationId/accept`

**Request Payload:**
```json
{
  "expectedVersion": 1
}
```

#### 5.2.5 Reject Quotation Proposal
`POST /api/v1/customer/quotations/:quotationId/reject`

**Request Payload:**
```json
{
  "reason": "Budget constraints; requirement deferred to next quarter.",
  "expectedVersion": 1
}
```

#### 5.2.6 Request Commercial Changes
`POST /api/v1/customer/quotations/:quotationId/request-changes`

**Request Payload:**
```json
{
  "category": "Discount",
  "message": "Can you provide a 7% volume discount if we order 100 units?",
  "expectedVersion": 1
}
```

#### 5.2.7 Quotation Negotiation Thread
`GET /api/v1/customer/quotations/:quotationId/negotiation-thread`
`POST /api/v1/customer/quotations/:quotationId/negotiation-thread`

**Send Message Payload:**
```json
{
  "message": "We can proceed if delivery is scheduled within 14 business days.",
  "senderType": "CUSTOMER"
}
```

---

## 6. PHASE 10.6 — QUOTATION FINALIZATION, VERSION CONTROL & COMMERCIAL CLOSURE CONTRACT

### 6.1 Domain Rules & Immutability Invariants

1. **Commercial Closure State Machine**:
   `SENT` $\rightarrow$ `ACCEPTED` $\rightarrow$ `COMMERCIALLY_CLOSED` $\rightarrow$ `READY_FOR_ORDER`
   *Disallowed*: Direct transition from `DRAFT`, `PENDING_APPROVAL`, `REJECTED`, or `EXPIRED` to `COMMERCIALLY_CLOSED`.
2. **Immutable Commercial Snapshot**:
   When a proposal is accepted, a static commercial snapshot is generated. This frozen snapshot preserves unit prices, discounts, line totals, and terms at the exact moment of acceptance.
3. **Price List & Catalog Historical Integrity**:
   Subsequent alterations to Price Lists, base prices, product names, or Discount Tiers **MUST NOT** mutate previously accepted commercial snapshots.
4. **Order Readiness Handoff Gateway**:
   Commercial closure transitions `orderReadinessStatus` to `READY_FOR_ORDER`. Phase 10.6 provides a clean contract consumable by Phase 11 Order Management without creating actual Order records.

### 6.2 Finalization & Version Control Endpoints

#### 6.2.1 Get Finalization Details
`GET /api/v1/company/quotations/:quotationId/finalization`

#### 6.2.2 Fetch Version History List
`GET /api/v1/company/quotations/:quotationId/versions`

#### 6.2.3 Side-by-Side Version Comparison Matrix
`GET /api/v1/company/quotations/:quotationId/compare?versionA=1&versionB=3`

**Response:**
```json
{
  "versionA": { "version": 1, "grandTotal": 100000, "discountPercentage": 5 },
  "versionB": { "version": 3, "grandTotal": 95000, "discountPercentage": 7 },
  "delta": {
    "totalDelta": -5000,
    "discountDelta": 2,
    "itemsChanged": 1
  }
}
```

#### 6.2.4 Fetch Frozen Commercial Snapshot
`GET /api/v1/company/quotations/:quotationId/snapshot`

#### 6.2.5 Finalize & Lock Commercial Closure
`POST /api/v1/company/quotations/:quotationId/finalize`

#### 6.2.6 Fetch Order Readiness Gateway Status
`GET /api/v1/company/quotations/:quotationId/order-readiness`


