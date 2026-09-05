import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Filter } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Pagination } from '../../../components/tables/Pagination/Pagination';
import { useApprovals } from '../hooks/useApprovals';
import { ApprovalQueueTable } from '../components/ApprovalQueueTable';
import { ApprovalFilters } from '../components/ApprovalFilters';
import { usePermissions } from '../../../hooks/auth/usePermissions';

export const ApprovalQueuePage = () => {
  const navigate = useNavigate();
  const { user } = usePermissions();

  const userRole = user?.roleName || user?.role || 'Sales Manager';
  const isFinance = userRole.toLowerCase().includes('finance') || userRole.toLowerCase().includes('operations');

  const defaultLevel = isFinance ? 'FINANCE' : 'MANAGER';

  const {
    queue,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    changePage,
    refetch,
  } = useApprovals({ approvalLevel: defaultLevel });

  const handleViewDetails = (quotationId) => {
    navigate(`/company/approvals/${quotationId}`);
  };

  return (
    <div className="space-y-6 md:space-y-8 text-left">
      <PageHeader
        title="Commercial Proposal Approval Workspace"
        description={`Review, authorize, or request revisions for commercial sales quotations (${
          isFinance ? 'Tier 2 — Finance & Operations Escalation Queue' : 'Tier 1 — Sales Manager Review Queue'
        }).`}
      />

      <ApprovalFilters
        filters={filters}
        onFilterChange={updateFilters}
        onReset={() => updateFilters({ search: '', status: 'ALL', approvalLevel: defaultLevel, riskLevel: 'ALL' })}
        loading={loading}
      />

      <ApprovalQueueTable
        queue={queue}
        loading={loading}
        error={error}
        onRetry={refetch}
        onViewDetails={handleViewDetails}
      />

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={changePage}
        />
      )}
    </div>
  );
};

export default ApprovalQueuePage;
