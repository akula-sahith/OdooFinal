# DEALFLOW360 — CUSTOMER REQUEST & COMMUNICATION INTEGRATION CONTRACT

## Overview
This document specifies the backend integration contract for **Phase 9.2: Customer Request and Communication Foundation**.

The Request object (`requestId`) is the central business entity connecting the Customer's commercial requirements with the assigned Salesperson.

---

## 1. Request Data Model & Lifecycle

### 1.1 Request Lifecycle Statuses (`REQUEST_STATUS`)
- `DRAFT`: Saved locally by Customer; not yet visible to Salesperson.
- `SUBMITTED`: Requirement submitted into DealFlow360 sales workflow.
- `UNDER_REVIEW`: Assigned Salesperson / Engineer reviewing specifications.
- `REQUIREMENT_CLARIFICATION`: Salesperson requested further clarification via conversation.
- `REQUIREMENT_CONFIRMED`: Specifications confirmed and ready for future Quotation generation.
- `CANCELLED`: Requirement cancelled by Customer.
- `CLOSED`: Requirement completed or closed.

### 1.2 Request Schema
```json
{
  "id": "REQ-10025",
  "requestId": "REQ-10025",
  "customerId": "CUST-88102",
  "assignedSalespersonId": "usr_rep_01",
  "assignedSalespersonName": "Alex Rivera",
  "title": "Enterprise Server Rack 42U Procurement",
  "description": "Requirement for 50 heavy-duty server rack units with power distribution.",
  "productId": "prod_101",
  "productName": "Enterprise Server Rack 42U",
  "quantity": 50,
  "priority": "HIGH",
  "status": "SUBMITTED",
  "createdAt": "2026-09-05T10:00:00Z",
  "updatedAt": "2026-09-05T10:05:00Z"
}
```

---

## 2. Conversation & Messaging Data Model

### 2.1 Conversation Schema
```json
{
  "id": "conv_REQ-10025",
  "requestId": "REQ-10025",
  "customerId": "CUST-88102",
  "assignedSalespersonId": "usr_rep_01",
  "status": "ACTIVE",
  "createdAt": "2026-09-05T10:00:00Z"
}
```

### 2.2 Message Schema
```json
{
  "id": "msg_9901",
  "conversationId": "conv_REQ-10025",
  "senderId": "CUST-88102",
  "senderType": "CUSTOMER",
  "senderName": "John Smith",
  "content": "Could you confirm target delivery times for 50 units?",
  "createdAt": "2026-09-05T10:30:00Z",
  "readAt": "2026-09-05T10:35:00Z"
}
```

---

## 3. Customer Request & Conversation API Endpoints

### 3.1 Get Customer Requests
- **Method**: `GET`
- **Endpoint**: `/api/v1/customer/requests`
- **Query Params**: `search`, `status`, `priority`, `page`, `limit`
- **Authorization**: `Bearer <JWT_TOKEN>` (Must be Customer identity)

### 3.2 Create Request
- **Method**: `POST`
- **Endpoint**: `/api/v1/customer/requests`
- **Request Payload**:
  ```json
  {
    "title": "Enterprise Server Rack 42U Procurement",
    "description": "Requirement details...",
    "productId": "prod_101",
    "quantity": 50,
    "priority": "HIGH",
    "isSubmit": true
  }
  ```

### 3.3 Get Single Request Detail
- **Method**: `GET`
- **Endpoint**: `/api/v1/customer/requests/:requestId`
- **Authorization**: Backend MUST verify `request.customerId === authenticatedCustomer.id` (returns `403` / `404` if mismatch).

### 3.4 Submit Draft Request
- **Method**: `POST`
- **Endpoint**: `/api/v1/customer/requests/:requestId/submit`

### 3.5 Cancel Request
- **Method**: `POST`
- **Endpoint**: `/api/v1/customer/requests/:requestId/cancel`

### 3.6 Get Conversation & Messages
- **Method**: `GET`
- **Endpoint**: `/api/v1/customer/requests/:requestId/conversation`
- **Method**: `GET`
- **Endpoint**: `/api/v1/conversations/:conversationId/messages`

### 3.7 Send Message
- **Method**: `POST`
- **Endpoint**: `/api/v1/conversations/:conversationId/messages`
- **Request Payload**:
  ```json
  {
    "content": "Can you provide delivery by October?",
    "senderType": "CUSTOMER"
  }
  ```

---

## 4. Customer ↔ Salesperson Handoff Principles

1. **One Single Request Object**:
   - The Customer UI and future Salesperson UI operate on the **exact same** `requestId` and `conversationId`.
2. **Salesperson Assignment**:
   - `assignedSalespersonId` is assigned by the backend or workflow routing logic.
3. **Future Quotation Handoff**:
   - When a requirement reaches `REQUIREMENT_CONFIRMED`, the future Salesperson module generates a Quotation referencing `requestId`. The Quotation attaches to the Request without replacing it.
