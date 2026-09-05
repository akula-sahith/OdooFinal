# DEALFLOW360 — CUSTOMER AUTHENTICATION & IDENTITY INTEGRATION CONTRACT

## Overview
This document specifies the backend integration contract for **Phase 9.1: Customer Authentication and Account Foundation**.

The Customer Portal operates in a **completely separate identity domain** from Company Staff/Admin personnel. Customer accounts have no access to Company Staff RBAC roles, internal endpoints, or Admin management tools.

---

## 1. Customer Authentication Endpoints

### 1.1 Customer Sign In
- **Method**: `POST`
- **Endpoint**: `/api/v1/customer/auth/login`
- **Request Payload**:
  ```json
  {
    "email": "procurement@acmecorp.com",
    "password": "SecretPassword123!",
    "rememberMe": true
  }
  ```
- **Response Payload (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "CUST-88102",
      "firstName": "John",
      "lastName": "Smith",
      "email": "procurement@acmecorp.com",
      "companyName": "Acme Enterprises Inc.",
      "phone": "+1 (555) 019-2831",
      "portal": "customer",
      "accountStatus": "ACTIVE",
      "createdAt": "2026-09-05T12:00:00Z"
    }
  }
  ```

### 1.2 Customer Registration (Self-Service)
- **Method**: `POST`
- **Endpoint**: `/api/v1/customer/auth/signup`
- **Request Payload**:
  ```json
  {
    "firstName": "John",
    "lastName": "Smith",
    "email": "procurement@acmecorp.com",
    "phone": "+1 (555) 019-2831",
    "companyName": "Acme Enterprises Inc.",
    "password": "SecretPassword123!",
    "portal": "customer"
  }
  ```

### 1.3 Forgot Password (Privacy-Safe Response)
- **Method**: `POST`
- **Endpoint**: `/api/v1/customer/auth/forgot-password`
- **Request Payload**:
  ```json
  {
    "email": "procurement@acmecorp.com"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "message": "If an account exists for this email, password recovery instructions have been dispatched."
  }
  ```

### 1.4 Reset Password (Token-Based)
- **Method**: `POST`
- **Endpoint**: `/api/v1/customer/auth/reset-password`
- **Request Payload**:
  ```json
  {
    "token": "reset_token_xyz123",
    "password": "NewSecretPassword123!"
  }
  ```

---

## 2. Customer Profile & Account Endpoints

### 2.1 Get Profile
- **Method**: `GET`
- **Endpoint**: `/api/v1/customer/profile`
- **Authorization**: `Bearer <JWT_TOKEN>`

### 2.2 Update Profile
- **Method**: `PATCH`
- **Endpoint**: `/api/v1/customer/profile`
- **Request Payload**:
  ```json
  {
    "firstName": "John",
    "lastName": "Smith",
    "email": "procurement@acmecorp.com",
    "phone": "+1 (555) 019-9988",
    "companyName": "Acme Global Solutions Inc."
  }
  ```

---

## 3. Security & Resource Ownership Boundaries

1. **Stable Customer Identity Key (`customerId`)**:
   - The permanent key identifying a Customer is `customerId` (e.g. `CUST-88102`). Email addresses are mutable contact identifiers.
   - Future customer requests, conversations, and quotations MUST reference `customerId`.

2. **Strict Domain Isolation**:
   - Customer tokens CANNOT authenticate against `/api/v1/company/*` routes.
   - Attempts by a Customer token to access Admin resources must return `403 Forbidden`.

3. **Backend Ownership Enforcement**:
   - The backend MUST enforce resource ownership so that Customer A can only query resources where `customerId == CustomerA.id`.
