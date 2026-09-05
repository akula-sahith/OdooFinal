import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Inbox, CheckCircle2, Play, UserCheck } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Card } from '../../../components/ui/Card/Card';
import { Pagination } from '../../../components/tables/Pagination/Pagination';
import { ConfirmationDialog } from '../../../components/dialogs/ConfirmationDialog/ConfirmationDialog';
import { useToast } from '../../../components/feedback/Toast';
import { usePermissions } from '../../../hooks/auth/usePermissions';
import { useSalespersonRequests } from '../hooks/useSalespersonRequests';
import { SalespersonRequestTable } from '../components/SalespersonRequestTable';
import { SalespersonRequestFilters } from '../components/SalespersonRequestFilters';
import { salespersonRequestService } from '../services/salespersonRequestService';

export const SalespersonRequestsPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = usePermissions();

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    action: '', // 'review' | 'confirm' | 'claim'
    request: null,
    isSubmitting: false,
  });

  const {
    requests,
    loading,
    error,
    meta,
    search,
    statusFilter,
    priorityFilter,
    assignmentFilter,
    page,
    pageSize,
    setSearch,
    setStatusFilter,
    setPriorityFilter,
    setAssignmentFilter,
    setPage,
    setPageSize,
    refetch,
  } = useSalespersonRequests();

  const handleStartReviewClick = (requestRecord) => {
    setConfirmModal({
      isOpen: true,
      action: 'review',
      request: requestRecord,
      isSubmitting: false,
    });
  };

  const handleConfirmRequirementClick = (requestRecord) => {
    setConfirmModal({
      isOpen: true,
      action: 'confirm',
      request: requestRecord,
      isSubmitting: false,
    });
  };

  const handleClaimRequestClick = (requestRecord) => {
    setConfirmModal({
      isOpen: true,
      action: 'claim',
      request: requestRecord,
      isSubmitting: false,
    });
  };

  const handleConfirmAction = async () => {
    const { action, request: requestRecord } = confirmModal;
    if (!requestRecord) return;

    setConfirmModal((prev) => ({ ...prev, isSubmitting: true }));
    try {
      if (action === 'review') {
        await salespersonRequestService.startReview(requestRecord.id);
        toast.success(`Review started for request "${requestRecord.title}".`);
      } else if (action === 'confirm') {
        await salespersonRequestService.confirmRequirement(requestRecord.id);
        toast.success(`Requirement for "${requestRecord.title}" confirmed! Ready for quotation.`);
      } else if (action === 'claim') {
        await salespersonRequestService.claimRequest(requestRecord.id, {
          id: user?.id || 'SP-014',
          name: user?.fullName || 'Sarah Jenkins',
        });
        toast.success(`Request "${requestRecord.title}" claimed successfully.`);
      }
      setConfirmModal({ isOpen: false, action: '', request: null, isSubmitting: false });
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to update requirement request status.');
      setConfirmModal((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setAssignmentFilter('ALL');
    setPage(1);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <PageHeader
        title="Commercial Requirement Requests Workspace"
        description="Inspect customer B2B procurement requests, conduct clarifications, and manage requirement lifecycle status."
      />

      {/* Filters Bar */}
      <SalespersonRequestFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        assignmentFilter={assignmentFilter}
        onAssignmentFilterChange={setAssignmentFilter}
        onReset={handleResetFilters}
      />

      {/* Main Table Card */}
      <Card variant="default" padding="none" className="overflow-hidden">
        <SalespersonRequestTable
          requests={requests}
          loading={loading}
          error={error}
          onRetry={refetch}
          onView={(id) => navigate(`/company/sales/requests/${id}`)}
          onStartReview={handleStartReviewClick}
          onConfirmRequirement={handleConfirmRequirementClick}
          onClaimRequest={handleClaimRequestClick}
          emptyTitle="No requirement requests found"
          emptyDescription="There are currently no customer requests matching your filter parameters."
        />

        {!loading && !error && meta.total > 0 && (
          <div className="px-6 py-4 border-t border-slate-200/80 bg-slate-50/30">
            <Pagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
              totalItems={meta.total}
              pageSize={meta.limit}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        )}
      </Card>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, action: '', request: null, isSubmitting: false })}
        onConfirm={handleConfirmAction}
        title={
          confirmModal.action === 'review'
            ? 'Start Sales Review'
            : confirmModal.action === 'confirm'
            ? 'Confirm Customer Requirement'
            : 'Claim Requirement Request'
        }
        description={
          confirmModal.action === 'review'
            ? `Initiate review for request "${confirmModal.request?.title}"? Status will update to UNDER_REVIEW.`
            : confirmModal.action === 'confirm'
            ? `Confirm that the customer's requirement for "${confirmModal.request?.title}" is complete? This is the handoff point for future quotation creation.`
            : `Assign request "${confirmModal.request?.title}" to your active sales queue?`
        }
        confirmLabel={
          confirmModal.action === 'review'
            ? 'Start Review'
            : confirmModal.action === 'confirm'
            ? 'Confirm Requirement'
            : 'Claim Request'
        }
        confirmVariant={confirmModal.action === 'confirm' ? 'primary' : 'primary'}
        isLoading={confirmModal.isSubmitting}
      />
    </div>
  );
};

export default SalespersonRequestsPage;
