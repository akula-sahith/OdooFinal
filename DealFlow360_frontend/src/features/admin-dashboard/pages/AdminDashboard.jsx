import React from 'react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Badge } from '../../../components/ui/Badge';
import { useAuth } from '../../../hooks/auth/useAuth';
import { usePermissions } from '../../../hooks/auth/usePermissions';
import { PermissionDenied } from '../../../components/feedback/PermissionDenied';
import { useAdminDashboard } from '../hooks/useAdminDashboard';

// Corrected Admin Governance & Configuration Sections
import { ConfigurationHealthSection } from '../components/ConfigurationHealthSection';
import { ConfigurationAttentionSection } from '../components/ConfigurationAttentionSection';
import { PlatformAnalyticsSection } from '../components/PlatformAnalyticsSection';
import { ConfigurationAuditSection } from '../components/ConfigurationAuditSection';
import { PlatformGovernanceActions } from '../components/PlatformGovernanceActions';

/**
 * Admin Dashboard Page Component (Phase 3)
 * Structure:
 * /company/dashboard
 *   ├── Platform Overview
 *   ├── Configuration Health (Products, Price Lists, Discount Tiers, Approval Chains, Warehouses)
 *   ├── System / Configuration Alerts
 *   ├── Platform Analytics
 *   ├── Recent Configuration Activity
 *   └── Quick Configuration Actions
 */
export const AdminDashboard = () => {
  const { user, role } = useAuth();
  const { hasPermission } = usePermissions();

  const {
    timeRange,
    setTimeRange,
    selectedTeam,
    setSelectedTeam,
    selectedCategory,
    setSelectedCategory,
    isLoading,
    error,
    data,
    sectionErrors,
    refetchSection,
  } = useAdminDashboard('30d');

  // Verify Role & Authorization
  const isAuthorized = role === 'Admin' || hasPermission('dashboard.view');

  if (!isAuthorized) {
    return (
      <PermissionDenied
        title="Admin Dashboard Restricted"
        description="You must be an authorized Administrator to access platform configuration rules and governance analytics."
      />
    );
  }

  const userName = user?.name || user?.email?.split('@')[0] || 'Admin';

  return (
    <div className="space-y-6 pb-12 text-left max-w-7xl mx-auto">
      {/* 1. PLATFORM OVERVIEW */}
      <PageHeader
        title="Admin Dashboard"
        description="Platform configuration status, governance rules, and system-wide analytics."
        badge={
          <Badge variant="plum" size="sm">
            Platform Overview & Governance
          </Badge>
        }
      />

      <div className="p-4 sm:p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
            Good day, {userName}.
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Platform governance rules, price lists, discount tiers, and warehouse setups are active.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-700">Platform System Operational</span>
        </div>
      </div>

      {/* 2. CONFIGURATION HEALTH (Products, Price Lists, Discount Tiers, Approval Chains, Warehouses) */}
      <ConfigurationHealthSection
        health={data?.configurationHealth || null}
        isLoading={isLoading}
        error={sectionErrors.configurationHealth || error}
        onRetry={() => refetchSection('configurationHealth')}
      />

      {/* 3. SYSTEM / CONFIGURATION ALERTS */}
      <ConfigurationAttentionSection
        alerts={data?.configurationAlerts || []}
        isLoading={isLoading}
        error={sectionErrors.configurationAlerts || error}
        onRetry={() => refetchSection('configurationAlerts')}
      />

      {/* 4. PLATFORM ANALYTICS */}
      <PlatformAnalyticsSection
        analytics={data?.platformAnalytics || null}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        selectedTeam={selectedTeam}
        onTeamChange={setSelectedTeam}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        isLoading={isLoading}
        error={sectionErrors.platformAnalytics || error}
        onRetry={() => refetchSection('platformAnalytics')}
      />

      {/* 5. RECENT CONFIGURATION ACTIVITY & 6. QUICK CONFIGURATION ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConfigurationAuditSection
          auditLogs={data?.configurationAudit || []}
          isLoading={isLoading}
          error={sectionErrors.configurationAudit || error}
          onRetry={() => refetchSection('configurationAudit')}
        />

        <PlatformGovernanceActions />
      </div>
    </div>
  );
};

export default AdminDashboard;
