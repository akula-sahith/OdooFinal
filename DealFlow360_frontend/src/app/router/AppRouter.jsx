import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Combined Auth Page
import { UnifiedAuth } from '../../pages/auth/UnifiedAuth';

// Customer Auth Pages (Phase 9.1)
import { CustomerLoginPage } from '../../features/customer-auth/pages/CustomerLoginPage';
import { CustomerSignupPage } from '../../features/customer-auth/pages/CustomerSignupPage';
import { ForgotPasswordPage } from '../../features/customer-auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../../features/customer-auth/pages/ResetPasswordPage';
import { CustomerVerify } from '../../pages/auth/customer/CustomerVerify';
import { CustomerMFA } from '../../pages/auth/customer/CustomerMFA';

// Customer Portal Workspace (Phase 9.1 & Phase 16)
import { CustomerLayout } from '../../components/customer/CustomerLayout';
import { CustomerDashboardPage } from '../../features/customer-account/pages/CustomerDashboardPage';
import { CustomerProfilePage } from '../../features/customer-account/pages/CustomerProfilePage';
import { CustomerAccountPage } from '../../features/customer-account/pages/CustomerAccountPage';
import { CustomerRequestsPlaceholder } from '../../features/customer-account/pages/CustomerRequestsPlaceholder';
import { CustomerConversationsPlaceholder } from '../../features/customer-account/pages/CustomerConversationsPlaceholder';
import { CustomerQuotationsPlaceholder } from '../../features/customer-account/pages/CustomerQuotationsPlaceholder';
import { CustomerOrderListPage } from '../../features/customer-account/pages/CustomerOrderListPage';
import { CustomerOrderDetailPage } from '../../features/customer-account/pages/CustomerOrderDetailPage';
import { CustomerShipmentListPage } from '../../features/customer-account/pages/CustomerShipmentListPage';
import { CustomerShipmentDetailPage } from '../../features/customer-account/pages/CustomerShipmentDetailPage';
import { CustomerMessagesPage } from '../../features/customer-account/pages/CustomerMessagesPage';

// Customer Requirement Requests & Communication (Phase 9.2)
import { CustomerRequestsPage } from '../../features/customer-requests/pages/CustomerRequestsPage';
import { CustomerCreateRequestPage } from '../../features/customer-requests/pages/CustomerCreateRequestPage';
import { CustomerRequestDetailPage } from '../../features/customer-requests/pages/CustomerRequestDetailPage';

// Customer Quotation Review & Negotiation (Phase 10.5)
import { CustomerQuotationPage } from '../../features/customer-quotations/pages/CustomerQuotationPage';
import { CustomerQuotationDetailPage } from '../../features/customer-quotations/pages/CustomerQuotationDetailPage';

// Company Application Shell Dispatchers & Features
import { DashboardDispatcher } from '../../pages/company/DashboardDispatcher';
import { CustomerListPage } from '../../features/customers/pages/CustomerListPage';
import { OrderListPage } from '../../features/orders/pages/OrderListPage';
import { QuotationPage } from '../../features/quotations/pages/QuotationPage';
import { QuotationCreatePage } from '../../features/quotations/pages/QuotationCreatePage';
import { QuotationDetailPage } from '../../features/quotations/pages/QuotationDetailPage';
import { QuotationEditPage } from '../../features/quotations/pages/QuotationEditPage';
import { QuotationFinalizationPage } from '../../features/quotation-finalization/pages/QuotationFinalizationPage';
import { ApprovalQueuePage } from '../../features/approvals/pages/ApprovalQueuePage';
import { ApprovalDetailPage } from '../../features/approvals/pages/ApprovalDetailPage';
import { WorkerProfile } from '../../pages/company/WorkerProfile';
import { PermissionDenied } from '../../pages/company/PermissionDenied';
import { NotFound } from '../../pages/company/NotFound';

// Phase 4 — Admin Product Catalogue & Category Management
import { ProductListPage } from '../../features/products/pages/ProductListPage';
import { ProductCreatePage } from '../../features/products/pages/ProductCreatePage';
import { ProductDetailPage } from '../../features/products/pages/ProductDetailPage';
import { ProductEditPage } from '../../features/products/pages/ProductEditPage';
import { CategoryListPage } from '../../features/products/pages/CategoryListPage';

// Phase 5 — Admin Price List Management
import { PriceListPage } from '../../features/price-lists/pages/PriceListPage';
import { PriceListCreatePage } from '../../features/price-lists/pages/PriceListCreatePage';
import { PriceListDetailPage } from '../../features/price-lists/pages/PriceListDetailPage';
import { PriceListEditPage } from '../../features/price-lists/pages/PriceListEditPage';

// Phase 6 — Admin Discount Governance & Approval Chain Configuration
import { DiscountTierPage } from '../../features/discount-tiers/pages/DiscountTierPage';
import { DiscountTierCreatePage } from '../../features/discount-tiers/pages/DiscountTierCreatePage';
import { DiscountTierDetailPage } from '../../features/discount-tiers/pages/DiscountTierDetailPage';
import { DiscountTierEditPage } from '../../features/discount-tiers/pages/DiscountTierEditPage';
import { ApprovalChainPage } from '../../features/approval-chain/pages/ApprovalChainPage';

// Phase 7 — Admin Staff User, Role and Permission Management
import { UserPage } from '../../features/users/pages/UserPage';
import { UserCreatePage } from '../../features/users/pages/UserCreatePage';
import { UserDetailPage } from '../../features/users/pages/UserDetailPage';
import { UserEditPage } from '../../features/users/pages/UserEditPage';

import { RolePage } from '../../features/roles/pages/RolePage';
import { RoleCreatePage } from '../../features/roles/pages/RoleCreatePage';
import { RoleDetailPage } from '../../features/roles/pages/RoleDetailPage';
import { RoleEditPage } from '../../features/roles/pages/RoleEditPage';

import { PermissionPage } from '../../features/permissions/pages/PermissionPage';

// Phase 9.3 & 9.4 — Salesperson Workspace, Communication & Notifications
import { SalespersonDashboardPage } from '../../features/salesperson/pages/SalespersonDashboardPage';
import { SalespersonRequestsPage } from '../../features/salesperson/pages/SalespersonRequestsPage';
import { SalespersonRequestDetailPage } from '../../features/salesperson/pages/SalespersonRequestDetailPage';
import { SalespersonMessagesPage } from '../../features/salesperson/pages/SalespersonMessagesPage';

// Phase 12 — Inventory & Warehouse Management
import { InventoryDashboardPage } from '../../features/inventory/pages/InventoryDashboardPage';
import { InventoryStockPage } from '../../features/inventory/pages/InventoryStockPage';
import { InventoryMovementsPage } from '../../features/inventory/pages/InventoryMovementsPage';
import { InventoryAdjustmentsPage } from '../../features/inventory/pages/InventoryAdjustmentsPage';
import { LowStockPage } from '../../features/inventory/pages/LowStockPage';
import { OutOfStockPage } from '../../features/inventory/pages/OutOfStockPage';
import { WarehouseListPage } from '../../features/inventory/pages/WarehouseListPage';
import { WarehouseDetailPage } from '../../features/inventory/pages/WarehouseDetailPage';
import { NotificationsPage } from '../../features/notifications/pages/NotificationsPage';

// Phase 13 — Fulfillment, Packing, Shipping & Delivery
import { FulfillmentDashboardPage } from '../../features/fulfillment/pages/FulfillmentDashboardPage';
import { FulfillmentDetailPage } from '../../features/fulfillment/pages/FulfillmentDetailPage';
import { PickingQueuePage } from '../../features/fulfillment/pages/PickingQueuePage';
import { PackingQueuePage } from '../../features/fulfillment/pages/PackingQueuePage';
import { ShipmentListPage } from '../../features/fulfillment/pages/ShipmentListPage';
import { ShipmentDetailPage } from '../../features/fulfillment/pages/ShipmentDetailPage';
import { CarrierListPage } from '../../features/fulfillment/pages/CarrierListPage';
import { CustomerOrderTrackingPage } from '../../features/fulfillment/pages/CustomerOrderTrackingPage';

// Phase 14 — Commercial Invoicing Module
import { InvoiceListPage } from '../../features/invoices/pages/InvoiceListPage';
import { InvoiceCreatePage } from '../../features/invoices/pages/InvoiceCreatePage';
import { InvoiceDetailPage } from '../../features/invoices/pages/InvoiceDetailPage';
import { InvoiceEditPage } from '../../features/invoices/pages/InvoiceEditPage';
import { CustomerInvoiceListPage } from '../../features/customer-account/pages/CustomerInvoiceListPage';
import { CustomerInvoiceDetailPage } from '../../features/customer-account/pages/CustomerInvoiceDetailPage';

// Phase 15 — Payment Management Module
import { PaymentListPage } from '../../features/payments/pages/PaymentListPage';
import { PaymentDetailPage } from '../../features/payments/pages/PaymentDetailPage';
import { CustomerPaymentListPage } from '../../features/customer-account/pages/CustomerPaymentListPage';
import { CustomerPaymentDetailPage } from '../../features/customer-account/pages/CustomerPaymentDetailPage';

// Phase 18 — Reporting & Analytics Module
import { AnalyticsDashboardPage } from '../../features/analytics/pages/AnalyticsDashboardPage';
import { SalesAnalyticsPage } from '../../features/analytics/pages/SalesAnalyticsPage';
import { QuotationAnalyticsPage } from '../../features/analytics/pages/QuotationAnalyticsPage';
import { OrderAnalyticsPage } from '../../features/analytics/pages/OrderAnalyticsPage';
import { FinanceAnalyticsPage } from '../../features/analytics/pages/FinanceAnalyticsPage';
import { FulfillmentAnalyticsPage } from '../../features/analytics/pages/FulfillmentAnalyticsPage';
import { CustomerAnalyticsPage } from '../../features/analytics/pages/CustomerAnalyticsPage';

// Phase 19 — Admin Governance & System Management Module
import { AdminGovernancePage } from '../../features/admin-governance/pages/AdminGovernancePage';
import { ApprovalRulesPage } from '../../features/admin-governance/pages/ApprovalRulesPage';
import { TaxConfigPage } from '../../features/admin-governance/pages/TaxConfigPage';
import { CurrencyConfigPage } from '../../features/admin-governance/pages/CurrencyConfigPage';
import { SystemSettingsPage } from '../../features/admin-governance/pages/SystemSettingsPage';
import { AuditLogsPage } from '../../features/admin-governance/pages/AuditLogsPage';
import { SecurityGovernancePage } from '../../features/admin-governance/pages/SecurityGovernancePage';

// Developer UI System Showcase
import { UIShowcase } from '../../pages/dev/UIShowcase';

// Guards
import { ProtectedCustomerRoute } from './ProtectedCustomerRoute';
import { ProtectedCompanyRoute } from './ProtectedCompanyRoute';

export const AppRouter = () => {
  return (
    <Routes>
      {/* DEVELOPER UI SHOWCASE ROUTE */}
      <Route path="/dev/ui" element={<UIShowcase />} />

      {/* UNIFIED AUTHENTICATION ROUTE */}
      <Route path="/login" element={<UnifiedAuth />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* OBFUSCATED CUSTOMER PORTAL AUTH ROUTES (Phase 9.1) */}
      <Route path="/c-entry-x9283f">
        <Route path="login" element={<CustomerLoginPage />} />
        <Route path="signup" element={<CustomerSignupPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="verify" element={<CustomerVerify />} />
        <Route path="mfa" element={<CustomerMFA />} />
        <Route
          path="workspace"
          element={<Navigate to="/customer/dashboard" replace />}
        />
        <Route path="*" element={<Navigate to="/c-entry-x9283f/login" replace />} />
      </Route>

      {/* PROTECTED B2B CUSTOMER PORTAL WORKSPACE ROUTES (Phase 9.1) */}
      <Route
        path="/customer"
        element={
          <ProtectedCustomerRoute>
            <CustomerLayout />
          </ProtectedCustomerRoute>
        }
      >
        <Route index element={<Navigate to="/customer/dashboard" replace />} />
        <Route path="dashboard" element={<CustomerDashboardPage />} />
        <Route path="profile" element={<CustomerProfilePage />} />
        <Route path="account" element={<CustomerAccountPage />} />
        <Route path="requests" element={<CustomerRequestsPage />} />
        <Route path="requests/new" element={<CustomerCreateRequestPage />} />
        <Route path="requests/:requestId" element={<CustomerRequestDetailPage />} />
        <Route path="messages" element={<CustomerMessagesPage />} />
        <Route path="messages/:conversationId" element={<CustomerMessagesPage />} />
        <Route path="notifications" element={<NotificationsPage userType="CUSTOMER" />} />
        <Route path="notifications/:notificationId" element={<NotificationsPage userType="CUSTOMER" />} />
        <Route path="conversations" element={<CustomerMessagesPage />} />
        <Route path="quotations" element={<CustomerQuotationPage />} />
        <Route path="quotations/:quotationId" element={<CustomerQuotationDetailPage />} />
        <Route path="orders" element={<CustomerOrderListPage />} />
        <Route path="orders/:orderId" element={<CustomerOrderDetailPage />} />
        <Route path="shipments" element={<CustomerShipmentListPage />} />
        <Route path="shipments/:shipmentId" element={<CustomerShipmentDetailPage />} />
        <Route path="invoices" element={<CustomerInvoiceListPage />} />
        <Route path="invoices/:invoiceId" element={<CustomerInvoiceDetailPage />} />
        <Route path="payments" element={<CustomerPaymentListPage />} />
        <Route path="payments/:paymentId" element={<CustomerPaymentDetailPage />} />
        <Route path="analytics" element={<CustomerAnalyticsPage />} />
        <Route path="*" element={<Navigate to="/customer/dashboard" replace />} />
      </Route>

      {/* OBFUSCATED COMPANY STAFF ENTRY ROUTES */}
      <Route path="/m-entry-z7829a">
        <Route path="login" element={<UnifiedAuth />} />
        <Route path="accept-invite" element={<UnifiedAuth />} />
        <Route path="forgot-password" element={<UnifiedAuth />} />
        <Route path="reset-password/:token" element={<UnifiedAuth />} />
        <Route path="mfa" element={<UnifiedAuth />} />
        <Route
          path="workspace"
          element={<Navigate to="/company/dashboard" replace />}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Route>

      {/* PHASE 2 — COMPANY APPLICATION SHELL ROUTES */}
      <Route path="/company">
        <Route index element={<Navigate to="/company/dashboard" replace />} />

        {/* Workspace / Admin Dashboard */}
        <Route
          path="dashboard"
          element={
            <ProtectedCompanyRoute requiredPermission="dashboard.view">
              <DashboardDispatcher />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="admin/dashboard"
          element={
            <ProtectedCompanyRoute requiredPermission="dashboard.view">
              <DashboardDispatcher />
            </ProtectedCompanyRoute>
          }
        />

        {/* Phase 9.3 — Salesperson Workspace & Customer Request Integration */}
        <Route
          path="sales/dashboard"
          element={
            <ProtectedCompanyRoute requiredPermission="requests.view">
              <SalespersonDashboardPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="sales/requests"
          element={
            <ProtectedCompanyRoute requiredPermission="requests.view">
              <SalespersonRequestsPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="sales/requests/:requestId"
          element={
            <ProtectedCompanyRoute requiredPermission="requests.view">
              <SalespersonRequestDetailPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="messages"
          element={
            <ProtectedCompanyRoute>
              <SalespersonMessagesPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="messages/:conversationId"
          element={
            <ProtectedCompanyRoute>
              <SalespersonMessagesPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="sales/conversations/:conversationId"
          element={<Navigate to="/company/messages" replace />}
        />

        <Route
          path="notifications"
          element={
            <ProtectedCompanyRoute>
              <NotificationsPage userType="SALESPERSON" />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="notifications/:notificationId"
          element={
            <ProtectedCompanyRoute>
              <NotificationsPage userType="SALESPERSON" />
            </ProtectedCompanyRoute>
          }
        />

        {/* Sales */}
        <Route
          path="customers"
          element={
            <ProtectedCompanyRoute requiredPermission="customers.view">
              <CustomerListPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="customers/:id"
          element={
            <ProtectedCompanyRoute requiredPermission="customers.view">
              <CustomerListPage />
            </ProtectedCompanyRoute>
          }
        />

        {/* Quotations — Phase 10.1 Quotation Foundation */}
        <Route
          path="quotations"
          element={
            <ProtectedCompanyRoute requiredPermission="quotations.view">
              <QuotationPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="quotations/new"
          element={
            <ProtectedCompanyRoute requiredPermission="quotations.create">
              <QuotationCreatePage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="quotations/:quotationId"
          element={
            <ProtectedCompanyRoute requiredPermission="quotations.view">
              <QuotationDetailPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="quotations/:quotationId/edit"
          element={
            <ProtectedCompanyRoute requiredPermission="quotations.update">
              <QuotationEditPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="quotations/:quotationId/finalize"
          element={
            <ProtectedCompanyRoute requiredPermission="quotations.view">
              <QuotationFinalizationPage />
            </ProtectedCompanyRoute>
          }
        />

        <Route
          path="orders"
          element={
            <ProtectedCompanyRoute requiredPermission="orders.view">
              <OrderListPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="orders/:id"
          element={
            <ProtectedCompanyRoute requiredPermission="orders.view">
              <OrderListPage />
            </ProtectedCompanyRoute>
          }
        />

        {/* Phase 12 — Inventory & Warehouse Management */}
        <Route
          path="inventory"
          element={
            <ProtectedCompanyRoute requiredPermission="inventory.view">
              <InventoryDashboardPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="inventory/stock"
          element={
            <ProtectedCompanyRoute requiredPermission="inventory.view">
              <InventoryStockPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="inventory/movements"
          element={
            <ProtectedCompanyRoute requiredPermission="inventory.view">
              <InventoryMovementsPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="inventory/adjustments"
          element={
            <ProtectedCompanyRoute requiredPermission="inventory.adjust">
              <InventoryAdjustmentsPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="inventory/low-stock"
          element={
            <ProtectedCompanyRoute requiredPermission="inventory.view">
              <LowStockPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="inventory/out-of-stock"
          element={
            <ProtectedCompanyRoute requiredPermission="inventory.view">
              <OutOfStockPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="inventory/warehouses"
          element={
            <ProtectedCompanyRoute requiredPermission="warehouse.view">
              <WarehouseListPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="inventory/warehouses/:warehouseId"
          element={
            <ProtectedCompanyRoute requiredPermission="warehouse.view">
              <WarehouseDetailPage />
            </ProtectedCompanyRoute>
          }
        />

        {/* Phase 13 — Fulfillment, Packing, Shipping & Delivery */}
        <Route
          path="fulfillment"
          element={
            <ProtectedCompanyRoute requiredPermission="fulfillment.view">
              <FulfillmentDashboardPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="fulfillment/picking"
          element={
            <ProtectedCompanyRoute requiredPermission="fulfillment.pick">
              <PickingQueuePage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="fulfillment/packing"
          element={
            <ProtectedCompanyRoute requiredPermission="fulfillment.pack">
              <PackingQueuePage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="fulfillment/shipments"
          element={
            <ProtectedCompanyRoute requiredPermission="shipment.view">
              <ShipmentListPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="fulfillment/shipments/:shipmentId"
          element={
            <ProtectedCompanyRoute requiredPermission="shipment.view">
              <ShipmentDetailPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="fulfillment/carriers"
          element={
            <ProtectedCompanyRoute requiredPermission="carrier.view">
              <CarrierListPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="fulfillment/:fulfillmentId"
          element={
            <ProtectedCompanyRoute requiredPermission="fulfillment.view">
              <FulfillmentDetailPage />
            </ProtectedCompanyRoute>
          }
        />

        {/* Phase 14 — Commercial Invoicing Module */}
        <Route
          path="invoices"
          element={
            <ProtectedCompanyRoute requiredPermission="invoices.view">
              <InvoiceListPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="invoices/new"
          element={
            <ProtectedCompanyRoute requiredPermission="invoices.create">
              <InvoiceCreatePage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="invoices/:invoiceId"
          element={
            <ProtectedCompanyRoute requiredPermission="invoices.view">
              <InvoiceDetailPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="invoices/:invoiceId/edit"
          element={
            <ProtectedCompanyRoute requiredPermission="invoices.update">
              <InvoiceEditPage />
            </ProtectedCompanyRoute>
          }
        />

        {/* Phase 15 — Payment Management Module */}
        <Route
          path="payments"
          element={
            <ProtectedCompanyRoute requiredPermission="payments.view">
              <PaymentListPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="payments/:paymentId"
          element={
            <ProtectedCompanyRoute requiredPermission="payments.view">
              <PaymentDetailPage />
            </ProtectedCompanyRoute>
          }
        />

        {/* Phase 18 — Reporting & Analytics Module */}
        <Route
          path="analytics"
          element={
            <ProtectedCompanyRoute requiredPermission="analytics.view">
              <AnalyticsDashboardPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="analytics/sales"
          element={
            <ProtectedCompanyRoute requiredPermission="analytics.sales.view">
              <SalesAnalyticsPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="analytics/quotations"
          element={
            <ProtectedCompanyRoute requiredPermission="analytics.view">
              <QuotationAnalyticsPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="analytics/orders"
          element={
            <ProtectedCompanyRoute requiredPermission="orders.view">
              <OrderAnalyticsPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="analytics/finance"
          element={
            <ProtectedCompanyRoute requiredPermission="analytics.finance.view">
              <FinanceAnalyticsPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="analytics/fulfillment"
          element={
            <ProtectedCompanyRoute requiredPermission="fulfillment.view">
              <FulfillmentAnalyticsPage />
            </ProtectedCompanyRoute>
          }
        />

        {/* Phase 19 — Admin Governance & System Management Routes */}
        <Route
          path="admin"
          element={
            <ProtectedCompanyRoute requiredPermission="roles.view">
              <AdminGovernancePage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="admin/users"
          element={
            <ProtectedCompanyRoute requiredPermission="users.view">
              <UserPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="admin/roles"
          element={
            <ProtectedCompanyRoute requiredPermission="roles.view">
              <RolePage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="admin/permissions"
          element={
            <ProtectedCompanyRoute requiredPermission="permissions.view">
              <PermissionPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="admin/approval-rules"
          element={
            <ProtectedCompanyRoute requiredPermission="approvals.view">
              <ApprovalRulesPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="admin/warehouses"
          element={
            <ProtectedCompanyRoute requiredPermission="warehouse.view">
              <WarehouseListPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="admin/taxes"
          element={
            <ProtectedCompanyRoute requiredPermission="settings.view">
              <TaxConfigPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="admin/currencies"
          element={
            <ProtectedCompanyRoute requiredPermission="settings.view">
              <CurrencyConfigPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="admin/settings"
          element={
            <ProtectedCompanyRoute requiredPermission="settings.view">
              <SystemSettingsPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="admin/audit-logs"
          element={
            <ProtectedCompanyRoute requiredPermission="audit_logs.view">
              <AuditLogsPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="admin/security"
          element={
            <ProtectedCompanyRoute requiredPermission="security.view">
              <SecurityGovernancePage />
            </ProtectedCompanyRoute>
          }
        />

        {/* Catalog — Phase 4 Admin Product Catalogue & Category Management */}
        <Route
          path="products"
          element={
            <ProtectedCompanyRoute requiredPermission="products.view">
              <ProductListPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="products/new"
          element={
            <ProtectedCompanyRoute requiredPermission="products.create">
              <ProductCreatePage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="products/categories"
          element={
            <ProtectedCompanyRoute requiredPermission="categories.view">
              <CategoryListPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="products/:productId"
          element={
            <ProtectedCompanyRoute requiredPermission="products.view">
              <ProductDetailPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="products/:productId/edit"
          element={
            <ProtectedCompanyRoute requiredPermission="products.update">
              <ProductEditPage />
            </ProtectedCompanyRoute>
          }
        />

        {/* Phase 5 — Admin Price List Management */}
        <Route
          path="price-lists"
          element={
            <ProtectedCompanyRoute requiredPermission="pricing.view">
              <PriceListPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="price-lists/new"
          element={
            <ProtectedCompanyRoute requiredPermission="pricing.create">
              <PriceListCreatePage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="price-lists/:priceListId"
          element={
            <ProtectedCompanyRoute requiredPermission="pricing.view">
              <PriceListDetailPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="price-lists/:priceListId/edit"
          element={
            <ProtectedCompanyRoute requiredPermission="pricing.update">
              <PriceListEditPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="pricing"
          element={<Navigate to="/company/price-lists" replace />}
        />
        <Route
          path="pricing/:id"
          element={<Navigate to="/company/price-lists" replace />}
        />

        {/* Phase 6 — Admin Discount Governance & Approval Chain Configuration */}
        <Route
          path="discount-tiers"
          element={
            <ProtectedCompanyRoute requiredPermission="discounts.view">
              <DiscountTierPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="discount-tiers/new"
          element={
            <ProtectedCompanyRoute requiredPermission="discounts.create">
              <DiscountTierCreatePage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="discount-tiers/:discountTierId"
          element={
            <ProtectedCompanyRoute requiredPermission="discounts.view">
              <DiscountTierDetailPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="discount-tiers/:discountTierId/edit"
          element={
            <ProtectedCompanyRoute requiredPermission="discounts.update">
              <DiscountTierEditPage />
            </ProtectedCompanyRoute>
          }
        />

        <Route
          path="approval-chain"
          element={
            <ProtectedCompanyRoute requiredPermission="approvals.view">
              <ApprovalChainPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="approval-chain/edit"
          element={
            <ProtectedCompanyRoute requiredPermission="approvals.update">
              <ApprovalChainPage />
            </ProtectedCompanyRoute>
          }
        />

        {/* Management & Governance — Phase 7 */}
        <Route
          path="users"
          element={
            <ProtectedCompanyRoute requiredPermission="users.view">
              <UserPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="users/new"
          element={
            <ProtectedCompanyRoute requiredPermission="users.create">
              <UserCreatePage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="users/:userId"
          element={
            <ProtectedCompanyRoute requiredPermission="users.view">
              <UserDetailPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="users/:userId/edit"
          element={
            <ProtectedCompanyRoute requiredPermission="users.update">
              <UserEditPage />
            </ProtectedCompanyRoute>
          }
        />

        <Route
          path="roles"
          element={
            <ProtectedCompanyRoute requiredPermission="roles.view">
              <RolePage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="roles/new"
          element={
            <ProtectedCompanyRoute requiredPermission="roles.create">
              <RoleCreatePage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="roles/:roleId"
          element={
            <ProtectedCompanyRoute requiredPermission="roles.view">
              <RoleDetailPage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="roles/:roleId/edit"
          element={
            <ProtectedCompanyRoute requiredPermission="roles.update">
              <RoleEditPage />
            </ProtectedCompanyRoute>
          }
        />

        <Route
          path="permissions"
          element={
            <ProtectedCompanyRoute requiredPermission="permissions.view">
              <PermissionPage />
            </ProtectedCompanyRoute>
          }
        />

        {/* Phase 10.4 — Commercial Proposal Approvals Workflow */}
        <Route
          path="approvals"
          element={
            <ProtectedCompanyRoute requiredPermission="approvals.view">
              <ApprovalQueuePage />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="approvals/:quotationId"
          element={
            <ProtectedCompanyRoute requiredPermission="approvals.view">
              <ApprovalDetailPage />
            </ProtectedCompanyRoute>
          }
        />

        {/* System */}
        <Route
          path="security"
          element={
            <ProtectedCompanyRoute requiredPermission="security.view">
              <SecurityGovernancePage />
            </ProtectedCompanyRoute>
          }
        />

        <Route
          path="audit-logs"
          element={
            <ProtectedCompanyRoute requiredPermission="audit_logs.view">
              <AuditLogsPage />
            </ProtectedCompanyRoute>
          }
        />

        <Route
          path="settings"
          element={
            <ProtectedCompanyRoute requiredPermission="settings.view">
              <SystemSettingsPage />
            </ProtectedCompanyRoute>
          }
        />

        <Route
          path="profile"
          element={
            <ProtectedCompanyRoute>
              <WorkerProfile />
            </ProtectedCompanyRoute>
          }
        />

        {/* Error States */}
        <Route
          path="403"
          element={
            <ProtectedCompanyRoute>
              <PermissionDenied />
            </ProtectedCompanyRoute>
          }
        />

        <Route
          path="404"
          element={
            <ProtectedCompanyRoute>
              <NotFound />
            </ProtectedCompanyRoute>
          }
        />

        {/* Company Shell Catch-all */}
        <Route
          path="*"
          element={
            <ProtectedCompanyRoute>
              <NotFound />
            </ProtectedCompanyRoute>
          }
        />
      </Route>

      {/* GLOBAL CATCH-ALL */}
      <Route path="*" element={<Navigate to="/c-entry-x9283f/login" replace />} />
    </Routes>
  );
};
