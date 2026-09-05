import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Customer Auth Pages
import { CustomerLogin } from '../../pages/auth/customer/CustomerLogin';
import { CustomerSignup } from '../../pages/auth/customer/CustomerSignup';
import { CustomerVerify } from '../../pages/auth/customer/CustomerVerify';
import { CustomerForgotPassword } from '../../pages/auth/customer/CustomerForgotPassword';
import { CustomerResetPassword } from '../../pages/auth/customer/CustomerResetPassword';
import { CustomerMFA } from '../../pages/auth/customer/CustomerMFA';

// Company Auth Pages
import { CompanyLogin } from '../../pages/auth/company/CompanyLogin';
import { AcceptInvitation } from '../../pages/auth/company/AcceptInvitation';
import { CompanyForgotPassword } from '../../pages/auth/company/CompanyForgotPassword';
import { CompanyResetPassword } from '../../pages/auth/company/CompanyResetPassword';
import { CompanyMFA } from '../../pages/auth/company/CompanyMFA';

// Customer Workspace Preview
import { CustomerWorkspacePreview } from '../../pages/workspace/CustomerWorkspacePreview';

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
import { QuotationsPlaceholder } from '../../pages/company/QuotationsPlaceholder';
import { QuotationDetailsPlaceholder } from '../../pages/company/QuotationDetailsPlaceholder';
import { ApprovalsPlaceholder } from '../../pages/company/ApprovalsPlaceholder';
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

      {/* ROOT ROUTE — DIRECT REDIRECT TO CUSTOMER LOGIN BY DEFAULT */}
      <Route path="/" element={<Navigate to="/c-entry-x9283f/login" replace />} />

      {/* OBFUSCATED CUSTOMER PORTAL ROUTES */}
      <Route path="/c-entry-x9283f">
        <Route path="login" element={<CustomerLogin />} />
        <Route path="signup" element={<CustomerSignup />} />
        <Route path="verify" element={<CustomerVerify />} />
        <Route path="forgot-password" element={<CustomerForgotPassword />} />
        <Route path="reset-password/:token" element={<CustomerResetPassword />} />
        <Route path="mfa" element={<CustomerMFA />} />
        <Route
          path="workspace"
          element={
            <ProtectedCustomerRoute>
              <CustomerWorkspacePreview />
            </ProtectedCustomerRoute>
          }
        />
        <Route path="*" element={<Navigate to="/c-entry-x9283f/login" replace />} />
      </Route>

      {/* OBFUSCATED COMPANY STAFF ENTRY ROUTES */}
      <Route path="/m-entry-z7829a">
        <Route path="login" element={<CompanyLogin />} />
        <Route path="accept-invite" element={<AcceptInvitation />} />
        <Route path="forgot-password" element={<CompanyForgotPassword />} />
        <Route path="reset-password/:token" element={<CompanyResetPassword />} />
        <Route path="mfa" element={<CompanyMFA />} />
        <Route
          path="workspace"
          element={<Navigate to="/company/dashboard" replace />}
        />
        <Route path="*" element={<Navigate to="/m-entry-z7829a/login" replace />} />
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

        <Route
          path="quotations"
          element={
            <ProtectedCompanyRoute requiredPermission="quotations.view">
              <QuotationsPlaceholder />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="quotations/:id"
          element={
            <ProtectedCompanyRoute requiredPermission="quotations.view">
              <QuotationDetailsPlaceholder />
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

        {/* Management */}
        <Route
          path="users"
          element={
            <ProtectedCompanyRoute requiredPermission="users.view">
              <UsersPlaceholder />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="users/:id"
          element={
            <ProtectedCompanyRoute requiredPermission="users.view">
              <UserDetailsPlaceholder />
            </ProtectedCompanyRoute>
          }
        />

        <Route
          path="roles"
          element={
            <ProtectedCompanyRoute requiredPermission="roles.view">
              <RolesPlaceholder />
            </ProtectedCompanyRoute>
          }
        />
        <Route
          path="roles/:id"
          element={
            <ProtectedCompanyRoute requiredPermission="roles.view">
              <RoleDetailsPlaceholder />
            </ProtectedCompanyRoute>
          }
        />

        <Route
          path="approvals"
          element={
            <ProtectedCompanyRoute requiredPermission="approvals.view">
              <ApprovalsPlaceholder />
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
