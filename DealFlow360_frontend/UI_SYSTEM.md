# DEALFLOW360 — Global UI System Documentation (Phase 2.5)

Welcome to the **DealFlow360 Global UI System**. This document defines the single visual and interaction design foundation for all present and future DealFlow360 modules.

---

## 1. Core Principles & Design Language

- **One Design System**: All modules (Dashboard, Users, Roles, Customers, Products, Pricing, Quotations, Approvals, Orders, Notifications, Security, Audit Logs, Settings) consume these shared components.
- **Brand Colors**:
  - Primary Accent: DealFlow360 Plum (`#714B67`)
  - Dark Accent: Dark Plum (`#56384E`)
  - Light Plum Tint: (`#F7F2F5`)
  - Secondary Accent: Teal (`#00A09D`)
  - Page Background: Slate Canvas (`#F8FAFC`)
- **Typography**:
  - Headings: `Plus Jakarta Sans`
  - Body & UI: `Aptos` (with fallbacks to `Inter`, system-ui)

---

## 2. Shared Component Registry & Usage

### 2.1 Buttons (`src/components/ui/Button`)
```jsx
import { Button } from '@/components/ui';
import { Plus } from 'lucide-react';

<Button
  variant="primary" // primary | secondary | outline | ghost | danger | success | link
  size="md"        // sm | md | lg
  leadingIcon={Plus}
  isLoading={isSubmitting}
  loadingText="Saving..."
  onClick={handleSave}
>
  Save Changes
</Button>
```

### 2.2 Form Controls (`src/components/ui`)
- **Input**: `<Input label="Email" leadingIcon={Mail} error={errors.email} />`
- **Textarea**: `<Textarea label="Notes" maxLength={200} resize="vertical" />`
- **Select**: `<Select label="Department" options={optionsArray} isClearable />`
- **Checkbox**: `<Checkbox label="Agree to terms" checked={isChecked} indeterminate={isSome} />`
- **Radio / RadioGroup**: `<RadioGroup label="Billing" options={billingOptions} value={val} onChange={setVal} />`
- **Switch**: `<Switch label="Email Notifications" checked={enabled} onChange={setEnabled} />`
- **SearchInput**: `<SearchInput placeholder="Search records..." onSearch={handleSearch} showShortcut />`

### 2.3 Cards & Badges (`src/components/ui`)
- **Card**: Modular wrapper (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`) with variants `standard`, `elevated`, `interactive`, `bordered`.
- **StatusBadge**: Specialized workflow badge mapped to centralized `STATUS_DEFINITIONS` in `tokens.js`:
  ```jsx
  <StatusBadge status="APPROVED" size="md" />
  ```
  Supported keys: `ACTIVE`, `INACTIVE`, `PENDING`, `APPROVED`, `REJECTED`, `DRAFT`, `SENT`, `ACCEPTED`, `EXPIRED`, `CANCELLED`, `PROCESSING`, `COMPLETED`.

### 2.4 Tables & Pagination (`src/components/tables`)
- **DataTable**: Data-source independent table with column sorting, row selection checkboxes, row click listeners, skeleton loading, and empty state.
  ```jsx
  <DataTable
    columns={columnsConfig}
    data={itemsArray}
    isLoading={isLoading}
    selectable
    selectedRowIds={selectedIds}
    onSelectRow={handleSelectRow}
    onSelectAll={handleSelectAll}
    sortColumn={sortCol}
    sortDirection={sortDir}
    onSort={handleSort}
  />
  ```
- **Pagination**: Independent pagination controller:
  ```jsx
  <Pagination
    currentPage={page}
    totalPages={totalPages}
    pageSize={pageSize}
    totalItems={totalCount}
    onPageChange={setPage}
    onPageSizeChange={setPageSize}
  />
  ```

### 2.5 Overlays & Dialogs (`src/components/dialogs`)
- **Modal**: Accessible dialog with focus trap, backdrop blur, and Escape listener (`<Modal isOpen={isOpen} onClose={close} title="Modal Title">... shadow-xl</Modal>`).
- **ConfirmationDialog**: `<ConfirmationDialog isOpen={isOpen} onClose={close} onConfirm={handleConfirm} variant="danger" title="Suspend Account?" />`
- **Drawer**: `<Drawer isOpen={isOpen} onClose={close} position="right">...</Drawer>`
- **Dropdown**: `<Dropdown trigger={<Button>Actions</Button>} items={menuItems} />`

### 2.6 Feedback & Notifications (`src/components/feedback`)
- **Toast Engine**: Call via `useToast()` hook:
  ```jsx
  const toast = useToast();
  toast.success('Changes saved successfully.');
  toast.error('Unable to connect to backend.');
  ```
- **Alert**: Persistent inline banner (`<Alert variant="warning" title="Note">...</Alert>`).
- **Skeleton**: Pre-layout shimmer placeholders (`<Skeleton variant="card" />`, `<Skeleton variant="text" width="60%" />`).
- **EmptyState**: `<EmptyState title="No Records" description="Items will appear here." />`
- **ErrorState**: Graceful error fallback hiding technical secrets. `<ErrorState onRetry={fetchData} />`
- **PermissionDenied**: 403 authorization boundary page & component. `<PermissionDenied />`
- **NotFound**: 404 page & component. `<NotFound />`

---

## 3. Developer Test Harness Route

An interactive developer showcase is available in development mode at:
`/dev/ui`

Use this route to visually verify component variants, accessibility states, and design tokens without writing mock code.
