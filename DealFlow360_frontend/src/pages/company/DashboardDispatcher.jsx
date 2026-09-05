/**
 * DashboardDispatcher Component
 * Dynamically routes /company/dashboard based on the authenticated user's role:
 * - ADMIN: AdminGovernancePage (System health, configuration, audit)
 * - SALESPERSON: SalespersonDashboardPage (My quotes, requirement requests, tasks)
 * - SALES_MANAGER: SalesAnalyticsPage (Team deal pipeline, revenue, approvals)
 * - FINANCE: FinanceAnalyticsPage (Invoices, payments, receivables aging)
 * - OPERATIONS: FulfillmentAnalyticsPage (Orders, picking, packing, stock)
 */

import React from 'react';
import { usePermissions } from '../../hooks/auth/usePermissions';
import { AdminGovernancePage } from '../../features/admin-governance/pages/AdminGovernancePage';
import { SalespersonDashboardPage } from '../../features/salesperson/pages/SalespersonDashboardPage';
import { SalesAnalyticsPage } from '../../features/analytics/pages/SalesAnalyticsPage';
import { FinanceAnalyticsPage } from '../../features/analytics/pages/FinanceAnalyticsPage';
import { FulfillmentAnalyticsPage } from '../../features/analytics/pages/FulfillmentAnalyticsPage';

export function DashboardDispatcher() {
  const { role } = usePermissions();

  const roleUpper = (role || 'ADMIN').toUpperCase();

  if (roleUpper === 'SALESPERSON') {
    return <SalespersonDashboardPage />;
  }

  if (roleUpper === 'SALES_MANAGER' || roleUpper === 'MANAGER') {
    return <SalesAnalyticsPage />;
  }

  if (roleUpper === 'FINANCE' || roleUpper === 'ACCOUNTANT') {
    return <FinanceAnalyticsPage />;
  }

  if (roleUpper === 'OPERATIONS' || roleUpper === 'WAREHOUSE') {
    return <FulfillmentAnalyticsPage />;
  }

  // Default to Admin Governance Dashboard
  return <AdminGovernancePage />;
}

export default DashboardDispatcher;
