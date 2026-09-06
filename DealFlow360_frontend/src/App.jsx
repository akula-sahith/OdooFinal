import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { CustomerSignupPage } from './pages/auth/CustomerSignupPage';

// Workspace & Quotations Pages
import { QuotationListPage } from './pages/workspace/QuotationListPage';
import { PipelineKanbanPage } from './pages/workspace/PipelineKanbanPage';
import { QuotationBuilderPage } from './pages/quotation/QuotationBuilderPage';
import { OrderListPage } from './pages/workspace/OrderListPage';
import { OrderDetailPage } from './pages/workspace/OrderDetailPage';

// Governance & Operations Pages
import { ApprovalQueuePage } from './pages/approval/ApprovalQueuePage';
import { FulfillmentSplitPage } from './pages/fulfillment/FulfillmentSplitPage';
import { BillingInvoicingPage } from './pages/billing/BillingInvoicingPage';
import { CustomerPortalPage } from './pages/portal/CustomerPortalPage';
import { DealHealthDashboardPage } from './pages/dashboard/DealHealthDashboardPage';
import { ReportingAnalyticsPage } from './pages/reporting/ReportingAnalyticsPage';
import { BackendConfigPage } from './pages/config/BackendConfigPage';

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/portal/signup" element={<CustomerSignupPage />} />

          {/* Customer Portal Restricted Routes */}
          <Route
            path="/portal"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER', 'SALES_REP', 'SALES_MANAGER', 'ADMIN', 'ADMINISTRATOR']}>
                <CustomerPortalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portal/quotations/:id"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER', 'SALES_REP', 'SALES_MANAGER', 'ADMIN', 'ADMINISTRATOR']}>
                <CustomerPortalPage />
              </ProtectedRoute>
            }
          />

          {/* Internal Workspace Routes */}
          <Route
            path="/workspace"
            element={
              <ProtectedRoute allowedRoles={['SALES_REP', 'SALES_MANAGER', 'FINANCE', 'ADMIN', 'ADMINISTRATOR']}>
                <QuotationListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quotations"
            element={
              <ProtectedRoute allowedRoles={['SALES_REP', 'SALES_MANAGER', 'FINANCE', 'ADMIN', 'ADMINISTRATOR']}>
                <QuotationListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={['SALES_REP', 'SALES_MANAGER', 'FINANCE', 'ADMIN', 'ADMINISTRATOR', 'CUSTOMER']}>
                <OrderListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute allowedRoles={['SALES_REP', 'SALES_MANAGER', 'FINANCE', 'ADMIN', 'ADMINISTRATOR', 'CUSTOMER']}>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pipeline"
            element={
              <ProtectedRoute allowedRoles={['SALES_REP', 'SALES_MANAGER', 'FINANCE', 'ADMIN', 'ADMINISTRATOR']}>
                <PipelineKanbanPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quotations/:id"
            element={
              <ProtectedRoute allowedRoles={['SALES_REP', 'SALES_MANAGER', 'FINANCE', 'ADMIN', 'ADMINISTRATOR']}>
                <QuotationBuilderPage />
              </ProtectedRoute>
            }
          />

          {/* Approval Queue */}
          <Route
            path="/approvals"
            element={
              <ProtectedRoute allowedRoles={['SALES_MANAGER', 'FINANCE', 'ADMIN', 'ADMINISTRATOR']}>
                <ApprovalQueuePage />
              </ProtectedRoute>
            }
          />

          {/* Fulfillment & Warehouses */}
          <Route
            path="/fulfillment"
            element={
              <ProtectedRoute allowedRoles={['FINANCE', 'SALES_MANAGER', 'ADMIN', 'ADMINISTRATOR', 'SALES_REP']}>
                <FulfillmentSplitPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fulfillment/:orderId"
            element={
              <ProtectedRoute allowedRoles={['FINANCE', 'SALES_MANAGER', 'ADMIN', 'ADMINISTRATOR', 'SALES_REP']}>
                <FulfillmentSplitPage />
              </ProtectedRoute>
            }
          />

          {/* Billing & Invoicing */}
          <Route
            path="/billing"
            element={
              <ProtectedRoute allowedRoles={['FINANCE', 'SALES_MANAGER', 'ADMIN', 'ADMINISTRATOR']}>
                <BillingInvoicingPage />
              </ProtectedRoute>
            }
          />

          {/* Deal Health Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['SALES_REP', 'SALES_MANAGER', 'FINANCE', 'ADMIN', 'ADMINISTRATOR']}>
                <DealHealthDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Reporting */}
          <Route
            path="/reporting"
            element={
              <ProtectedRoute allowedRoles={['SALES_REP', 'SALES_MANAGER', 'FINANCE', 'ADMIN', 'ADMINISTRATOR']}>
                <ReportingAnalyticsPage />
              </ProtectedRoute>
            }
          />

          {/* Backend Configuration Hub */}
          <Route
            path="/config"
            element={
              <ProtectedRoute allowedRoles={['SALES_MANAGER', 'ADMIN', 'ADMINISTRATOR']}>
                <BackendConfigPage />
              </ProtectedRoute>
            }
          />

          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
