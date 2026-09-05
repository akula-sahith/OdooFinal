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

// Customer Portal Workspace (Phase 9.1)
import { CustomerLayout } from '../../components/customer/CustomerLayout';
import { CustomerDashboardPage } from '../../features/customer-account/pages/CustomerDashboardPage';
import { CustomerProfilePage } from '../../features/customer-account/pages/CustomerProfilePage';
import { CustomerAccountPage } from '../../features/customer-account/pages/CustomerAccountPage';
import { CustomerRequestsPlaceholder } from '../../features/customer-account/pages/CustomerRequestsPlaceholder';
import { CustomerConversationsPlaceholder } from '../../features/customer-account/pages/CustomerConversationsPlaceholder';
import { CustomerQuotationsPlaceholder } from '../../features/customer-account/pages/CustomerQuotationsPlaceholder';

// Customer Requirement Requests & Communication (Phase 9.2)
import { CustomerRequestsPage } from '../../features/customer-requests/pages/CustomerRequestsPage';
import { CustomerCreateRequestPage } from '../../features/customer-requests/pages/CustomerCreateRequestPage';
import { CustomerRequestDetailPage } from '../../features/customer-requests/pages/CustomerRequestDetailPage';

// Customer Quotation Review & Negotiation (Phase 10.5)
import { CustomerQuotationPage } from '../../features/customer-quotations/pages/CustomerQuotationPage';
import { CustomerQuotationDetailPage } from '../../features/customer-quotations/pages/CustomerQuotationDetailPage';

// Company Application Shell Placeholders
import { DashboardPlaceholder } from '../../pages/company/DashboardPlaceholder';
import { CustomersPlaceholder } from '../../pages/company/CustomersPlaceholder';
import { CustomerDetailsPlaceholder } from '../../pages/company/CustomerDetailsPlaceholder';
import { UsersPlaceholder } from '../../pages/company/UsersPlaceholder';
import { UserDetailsPlaceholder } from '../../pages/company/UserDetailsPlaceholder';
import { RolesPlaceholder } from '../../pages/company/RolesPlaceholder';
import { RoleDetailsPlaceholder } from '../../pages/company/RoleDetailsPlaceholder';
import { PricingPlaceholder } from '../../pages/company/PricingPlaceholder';
import { PricingDetailsPlaceholder } from '../../pages/company/PricingDetailsPlaceholder';
import { QuotationPage } from '../../features/quotations/pages/QuotationPage';
import { QuotationCreatePage } from '../../features/quotations/pages/QuotationCreatePage';
import { QuotationDetailPage } from '../../features/quotations/pages/QuotationDetailPage';
import { QuotationEditPage } from '../../features/quotations/pages/QuotationEditPage';
import { QuotationFinalizationPage } from '../../features/quotation-finalization/pages/QuotationFinalizationPage';
import { ApprovalQueuePage } from '../../features/approvals/pages/ApprovalQueuePage';
import { ApprovalDetailPage } from '../../features/approvals/pages/ApprovalDetailPage';
import { OrdersPlaceholder } from '../../pages/company/OrdersPlaceholder';
import { OrderDetailsPlaceholder } from '../../pages/company/OrderDetailsPlaceholder';
import { SecurityPlaceholder } from '../../pages/company/SecurityPlaceholder';
import { AuditLogsPlaceholder } from '../../pages/company/AuditLogsPlaceholder';
import { SettingsPlaceholder } from '../../pages/company/SettingsPlaceholder';
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
import { NotificationsPage } from '../../features/notifications/pages/NotificationsPage';

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
        <Route path="notifications" element={<NotificationsPage userType="CUSTOMER" />} />
        <Route path="conversations" element={<CustomerConversationsPlaceholder />} />
        <Route path="quotations" element={<CustomerQuotationPage />} />
        <Route path="quotations/:quotationId" element={<CustomerQuotationDetailPage />} />
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
              <DashboardPlaceholder />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="admin/dashboard"
          element={
            <ProtectedCompanyRoute requiredPermission="dashboard.view">
              <DashboardPlaceholder />
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
          path="sales/conversations/:conversationId"
          element={<Navigate to="/company/sales/requests" replace />}
        />

        <Route
          path="notifications"
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
              <CustomersPlaceholder />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="customers/:id"
          element={
            <ProtectedCompanyRoute requiredPermission="customers.view">
              <CustomerDetailsPlaceholder />
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
              <OrdersPlaceholder />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="orders/:id"
          element={
            <ProtectedCompanyRoute requiredPermission="orders.view">
              <OrderDetailsPlaceholder />
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
              <SecurityPlaceholder />
            </ProtectedCompanyRoute>
          }
        />

        <Route
          path="audit-logs"
          element={
            <ProtectedCompanyRoute requiredPermission="audit_logs.view">
              <AuditLogsPlaceholder />
            </ProtectedCompanyRoute>
          }
        />

        <Route
          path="settings"
          element={
            <ProtectedCompanyRoute requiredPermission="settings.view">
              <SettingsPlaceholder />
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
