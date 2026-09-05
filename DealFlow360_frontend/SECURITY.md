# DealFlow360 — Production Security & Authorization Specification

This document details the security architecture, authorization models, tenant isolation, input validation, and data protection policies implemented in **DealFlow360**.

---

## 1. Core Security Principles

### "Never Trust the Frontend"
DealFlow360 adheres strictly to zero-trust client architecture. While the frontend UI dynamically hides buttons and routes based on role permissions for optimal user experience, **all security, authentication, role authorization, tenant scoping, and state transitions are enforced server-side**.

---

## 2. Security Architecture Layers

```
Browser (UI Route Guards)
   ↓
API Request Interceptor (Header Enrichment & Token Sanitization)
   ↓
Authentication Middleware (Token Validation & User Status Check)
   ↓
Organization Isolation Context (Derived from Authenticated Token)
   ↓
RBAC Authorization Middleware (Permission Verification)
   ↓
Resource Ownership Guard (IDOR Protection)
   ↓
Server-Side Input Validation & Mass Assignment Guard (Payload Allowlisting)
   ↓
Database Execution
```

---

## 3. Authentication & Session Management

- **Password Storage**: Passwords are never stored in plaintext and use bcrypt/argon2 strong hashing with high cost factors.
- **Credential Exposure**: Passwords, raw access tokens, refresh secrets, and private keys are never returned in normal API user responses or logged to console/file output.
- **Account Status Enforcement**: Accounts marked `INACTIVE` or `LOCKED` are immediately rejected during authentication and session validation.
- **Token Handling**: Access tokens are short-lived. Bearer tokens in API headers are masked (`Authorization: Bearer ********`) during logging.
- **Password Reset**: Password reset tokens are single-use, cryptographically secure, and expire after 15 minutes.
- **Enumeration Prevention**: Authentication error messages use generic responses (`"Invalid email or password"`) to prevent account discovery.

---

## 4. Multi-Tenant Organization Isolation

> [!CRITICAL]
> Organization context is **strictly derived from the authenticated identity token**.

DealFlow360 ignores any client-supplied `organizationId` in request bodies, query parameters, or URL paths when determining authorization scope. All database queries automatically filter resources by the authenticated tenant context:

```javascript
// Server-Side Organization Isolation Pattern
const orgId = authenticatedUser.organizationId;
const order = await db.orders.findOne({ _id: orderId, organizationId: orgId });
```

---

## 5. B2B Customer & Salesperson Data Isolation

- **Customer Portal**: Customers at `/customer/*` access only their own quotations, orders, shipments, invoices, and payment records. Requests seeking access to another customer's data return `403 Forbidden` / `404 Not Found`.
- **Salesperson Scoping**: Sales representatives access assigned requirement requests, quotations, and orders unless their role explicitly includes team-level management permissions.

---

## 6. Mass Assignment & Privilege Escalation Protection

To prevent parameter tampering (e.g., submitting `{ "role": "ADMIN", "organizationId": "OTHER" }` in user update requests), DealFlow360 enforces strict payload allowlisting:

```javascript
// Mass Assignment Protection Guard
const allowedUserUpdates = ['firstName', 'lastName', 'phone', 'department', 'employeeCode'];
const sanitizedPayload = Object.keys(body)
  .filter((key) => allowedUserUpdates.includes(key))
  .reduce((obj, key) => ({ ...obj, [key]: body[key] }), {});
```

Changing user roles or permissions requires explicit `roles.manage` privileges and generates a server-side audit log event.

---

## 7. Last-Admin Lockout Protection

The service layer prevents deactivating, deleting, or stripping admin permissions from the primary or final active administrator account in an organization:

```javascript
if (targetUser.roleCode === 'ROLE-ADMIN' && activeAdminCount <= 1 && newStatus === 'INACTIVE') {
  throw new Error('At least one active organization administrator is required.');
}
```

---

## 8. Immutable Audit Trail

- All administrative mutations (Role changes, permission updates, approval rule edits, tax rate updates, system settings edits, user status toggles) generate server-side audit records.
- Audit logs are **immutable**: the API exposes no endpoints for editing or deleting audit log records.

---

## 9. Error Sanitization & Environment Security

- **Production Errors**: Production API error responses return sanitized messages (`"Unable to process request."`) without exposing stack traces, SQL queries, or internal file paths.
- **Client Bundles**: No backend secrets, database connection strings, or private API keys are included in frontend environment variables. Only public `VITE_*` variables are used.
- **Git Hygiene**: `.env*.local`, credentials, and temporary build outputs are strictly excluded via `.gitignore`.
