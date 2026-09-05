# DealFlow360 — Salesperson Workspace & Customer Request Integration API Contract

## 1. Executive Overview
Phase 9.3 establishes the **Salesperson Workspace** and connects it to the existing **Customer Request** and **Conversation** resources built in Phase 9.2.

The core architectural invariant is **SINGLE SOURCE OF TRUTH**:
- There is **ONE** Request record (`requestId`, e.g., `REQ-10025`) shared between the B2B Customer Portal and the Company Salesperson Workspace.
- There is **ONE** Conversation resource (`conversationId`, e.g., `conv_REQ-10025`) containing the message thread between Customer and Salesperson.

```
CUSTOMER PORTAL                                 COMPANY WORKSPACE
 (Customer UI)                                   (Salesperson UI)
       │                                                │
       └────────────── Request ID: REQ-10025 ───────────┘
                                │
                    Conversation: conv_REQ-10025
                                │
                      Shared Message History
                                │
                      Lifecycle Transition
                                │
                     REQUIREMENT_CONFIRMED
                                │
                      (Quotation Handoff)
```

---

## 2. Shared Resource Identity Schema

| Field Name | Type | Description | Visibility & Security Boundary |
|---|---|---|---|
| `requestId` | String | Unique B2B Request Identifier (e.g. `REQ-10025`) | Public to Customer & Assigned Salesperson |
| `customerId` | String | Immutable Customer Entity ID (e.g. `CUST-001`) | Internal system reference |
| `companyName` | String | B2B Enterprise Account Name | Visible to Salesperson |
| `customerEmail` | String | Customer Procurement Contact Email | Contact info only. NO auth credentials exposed |
| `assignedSalespersonId` | String / Null | Staff ID of assigned Sales Engineer | Visible to Customer & Staff |
| `assignedSalespersonName` | String | Display Name of assigned Sales Engineer | Visible to Customer & Staff |
| `conversationId` | String | Unique Messaging Thread Identifier | Shared resource token |
| `status` | String | Lifecycle state enum | Shared source of truth |

---

## 3. Request Lifecycle State Machine

```
      SUBMITTED
          │
          ▼  (Salesperson starts review)
    UNDER_REVIEW ◄───────────────────┐
          │                          │
          ▼ (Ask Clarification)      │ (Customer responds)
REQUIREMENT_CLARIFICATION ───────────┘
          │
          ▼ (Confirm Requirement)
 REQUIREMENT_CONFIRMED
          │
          ▼ (Handoff to Phase 9.4 Quotations)
```

### Valid Lifecycle States & Action Boundaries:
1. `SUBMITTED`: Newly placed customer request awaiting sales engineer review.
   - Action: `[Start Review]` $\rightarrow$ `UNDER_REVIEW`
   - Action: `[Claim Request]` (if `assignedSalespersonId === null`)
2. `UNDER_REVIEW`: Sales Engineer actively analyzing specifications.
   - Action: `[Ask Clarification]` $\rightarrow$ `REQUIREMENT_CLARIFICATION` (sends message in shared conversation)
   - Action: `[Confirm Requirement]` $\rightarrow$ `REQUIREMENT_CONFIRMED`
3. `REQUIREMENT_CLARIFICATION`: Awaiting customer response to specific questions.
   - Action: Customer sends reply $\rightarrow$ `UNDER_REVIEW`
   - Action: Salesperson can post additional clarification messages or `[Confirm Requirement]`
4. `REQUIREMENT_CONFIRMED`: Specifications verified and locked.
   - Status: Read-only requirement handoff state for future Quotation module (Phase 9.4).
5. `CLOSED` / `CANCELLED`: Terminal states.

---

## 4. API Endpoints Contract

### A. Salesperson Requests
- `GET /sales/requests`
  - Query Params: `page`, `limit`, `search`, `status`, `priority`, `assignment` (`MINE`, `UNASSIGNED`, `ALL`)
  - Description: Returns paginated list of requirement requests accessible to authenticated salesperson.
  - Authorization: Backend enforces `assignedSalespersonId === authenticatedSalespersonId` for assigned views.

- `GET /sales/requests/:requestId`
  - Description: Returns complete request detail including customer contact info, product reference, quantity, and status.
  - Authorization: 403 / 404 if authenticated salesperson is not authorized to access `requestId`.

- `POST /sales/requests/:requestId/claim`
  - Description: Assigns an unassigned request to the authenticated salesperson.

- `POST /sales/requests/:requestId/start-review`
  - Description: Transitions request state from `SUBMITTED` to `UNDER_REVIEW`.

- `POST /sales/requests/:requestId/clarification`
  - Body: `{ message: string }`
  - Description: Transitions status to `REQUIREMENT_CLARIFICATION` and appends clarification message to shared conversation.

- `POST /sales/requests/:requestId/confirm`
  - Body: `{ notes?: string }`
  - Description: Transitions status to `REQUIREMENT_CONFIRMED` and logs requirement confirmation audit event.

### B. Shared Conversation & Messaging
- `GET /customer/requests/:requestId/conversation` or `GET /sales/requests/:requestId/conversation`
  - Description: Resolves or initializes the single shared `conversationId` for `requestId`.

- `GET /conversations/:conversationId/messages`
  - Description: Returns chronologically ordered message history.

- `POST /conversations/:conversationId/messages`
  - Body: `{ content: string, senderType: 'CUSTOMER' | 'SALESPERSON' }`
  - Description: Posts new message in shared conversation thread.

---

## 5. Security & RBAC Responsibilities

### FRONTEND RESPONSIBILITIES:
- Scope request queries appropriately (`assignment=MINE`).
- Filter UI action controls based on fine-grained permissions (`requests.view`, `requests.update_assigned`, `requests.communicate`, `requests.confirm`).
- Sanitize message input and clarify dirty state before navigation.
- Ensure customer passwords, auth tokens, and unrelated records are never rendered or requested.

### BACKEND RESPONSIBILITIES:
- Authenticate all requests via JWT / session tokens.
- Enforce strict server-side RBAC authorization before returning data or executing status changes.
- Verify `assignedSalespersonId` matching on `/sales/requests/:id` endpoints.
- Reject invalid lifecycle status transitions (e.g. arbitrary transition to quotation statuses like `APPROVED` or `SENT`).
