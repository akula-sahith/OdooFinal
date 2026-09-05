# DealFlow360 — Communication, Notification & Synchronization Integration API Contract

## 1. Architectural Architecture & Invariants

Phase 9.4 establishes the **Hardened Communication, Notification, Request Timeline, and Cross-Portal Synchronization Layer** connecting the B2B Customer Portal with the Salesperson Workspace.

```
                                  DEALFLOW360 CORE API
                                           │
                ┌──────────────────────────┴──────────────────────────┐
                │                                                     │
         CUSTOMER PORTAL                                       COMPANY PORTAL
        (Customer Account)                                    (Sales Representative)
                │                                                     │
                ├──────────────── Request ID: REQ-10025 ────────────────┤
                │                                                     │
                ├──────────── Conversation ID: conv_REQ-10025 ────────┤
                │                                                     │
                ├───────────── Audit Event Stream (Timeline) ─────────┤
                │                                                     │
                └────────────── Notification Recipient Bus ───────────┘
```

### Core Invariants:
1. **Single Source of Truth**: Exactly **ONE** Request and **ONE** Conversation resource exist per customer-salesperson requirement interaction.
2. **Immutable Audit Timeline**: All state transitions (`REQUEST_SUBMITTED`, `REVIEW_STARTED`, `CLARIFICATION_REQUESTED`, `CUSTOMER_RESPONDED`, `REQUIREMENT_CONFIRMED`) emit immutable backend audit events.
3. **Role-Based Notification Delivery**: Notifications are dispatched strictly based on recipient identity and authenticated user role.
4. **Idempotent Messaging**: Frontend prevents duplicate submissions during flight (`isSending`). Backend enforces rate limiting (HTTP `429`).
5. **Phase 10 Quotation Handoff**: `REQUIREMENT_CONFIRMED` serves as the official handoff state for future quotation creation.

---

## 2. API Endpoints Specification

### A. Customer Endpoints
- `GET /customer/requests`
  - Returns paginated list of requirement requests created by authenticated customer.
- `GET /customer/requests/:id`
  - Returns full request detail. Verified by server-side `customerId` ownership check.
- `POST /customer/requests`
  - Creates a new request (DRAFT or SUBMITTED).
- `POST /customer/requests/:id/submit`
  - Transitions request to `SUBMITTED`, emits `REQUEST_SUBMITTED` event, and generates a `NEW_REQUEST` notification for Sales team.
- `GET /customer/notifications`
  - Returns notifications for authenticated customer.
- `GET /customer/notifications/unread-count`
  - Returns numeric count of unread notifications.
- `PATCH /customer/notifications/:id/read`
  - Marks notification as read.
- `POST /customer/notifications/read-all`
  - Marks all customer notifications as read.

### B. Salesperson Endpoints
- `GET /sales/requests`
  - Query Params: `page`, `limit`, `search`, `status`, `priority`, `assignment` (`MINE`, `UNASSIGNED`, `ALL`).
  - Returns paginated list of assigned or unassigned requirement requests.
- `GET /sales/requests/:id`
  - Returns complete request specification and authorized customer contact details.
- `POST /sales/requests/:id/claim`
  - Assigns unassigned request to authenticated salesperson.
- `POST /sales/requests/:id/start-review`
  - Transitions status to `UNDER_REVIEW`, emits `REVIEW_STARTED` event, and notifies customer.
- `POST /sales/requests/:id/clarification`
  - Body: `{ message: string }`
  - Transitions status to `REQUIREMENT_CLARIFICATION`, posts message in conversation, emits `CLARIFICATION_REQUESTED` event, and notifies customer.
- `POST /sales/requests/:id/confirm`
  - Body: `{ notes?: string }`
  - Transitions status to `REQUIREMENT_CONFIRMED`, emits `REQUIREMENT_CONFIRMED` event, and notifies customer.
- `GET /sales/notifications`
  - Returns notifications for authenticated salesperson.
- `GET /sales/notifications/unread-count`
  - Returns numeric count of unread notifications.
- `PATCH /sales/notifications/:id/read`
- `POST /sales/notifications/read-all`

### C. Shared Conversation & Messaging Endpoints
- `GET /customer/requests/:requestId/conversation` or `GET /sales/requests/:requestId/conversation`
  - Returns shared `conversationId` and initial message thread.
- `GET /conversations/:conversationId/messages`
  - Returns ordered message list.
- `POST /conversations/:conversationId/messages`
  - Body: `{ content: string, senderType: 'CUSTOMER' | 'SALESPERSON' }`
  - Appends message to shared thread and triggers notification to recipient.
- `GET /requests/:requestId/messages/unread-count`
  - Returns count of unread messages sent by opposite party.
- `POST /requests/:requestId/messages/read`
  - Marks all messages sent by opposite party as read for authenticated caller.

### D. Request Audit Timeline Endpoints
- `GET /requests/:requestId/events`
  - Query Params: `visibility` (`CUSTOMER_VISIBLE` | `INTERNAL`)
  - Returns audit events for request timeline.

---

## 3. Error Handling Contract

| HTTP Code | Error Condition | User Facing Response / UX Treatment |
|---|---|---|
| `401 Unauthorized` | Expired or missing session token | Redirects safely to `/login` or `/c-entry-x9283f/login`. |
| `403 Forbidden` | Access to unassigned request / notification | Displays `ErrorState` ("Access Restricted"). |
| `404 Not Found` | Non-existent request / conversation | Displays `ErrorState` ("Request Not Found"). |
| `429 Too Many Requests` | Message spam / rate limit exceeded | Displays alert: `"You're sending messages too quickly. Please try again."` |
| `500 Server Error` | Internal API failure | Displays `ErrorState` with "Retry" button. Stack trace hidden. |

---

## 4. Frontend vs. Backend Responsibility Matrix

| Domain Area | Frontend Responsibility | Backend Responsibility |
|---|---|---|
| **Security & Ownership** | Route guards, UI action filtering | Server-side identity verification, authorization, 403 enforcement |
| **State Machine** | Display state-aware buttons ([Start Review], [Ask Clarification], [Confirm Requirement]) | Validate and enforce valid status transition matrix |
| **Notifications** | Render unread count badge, popover dropdown, auto-navigation | Event-driven notification generation, recipient routing, read tracking |
| **Messaging** | Disable send button during flight, character validation | Persist messages, update `readAt`, enforce 429 rate limiting |
| **Timeline Audit** | Render responsive milestone line, filter customer-safe events | Immutable event log creation (`RequestEvent`), timestamp authority |
| **Quotation Handoff** | Display "Requirement Confirmed" badge | Mark request eligible for Phase 10 Quotation module |
