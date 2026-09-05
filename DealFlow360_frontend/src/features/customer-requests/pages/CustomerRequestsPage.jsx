import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Card } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import { Pagination } from '../../../components/tables/Pagination/Pagination';
import { ConfirmationDialog } from '../../../components/dialogs/ConfirmationDialog/ConfirmationDialog';
import { useToast } from '../../../components/feedback/Toast';
import { useCustomerRequests } from '../hooks/useCustomerRequests';
import { CustomerRequestTable } from '../components/CustomerRequestTable';
import { CustomerRequestFilters } from '../components/CustomerRequestFilters';
import { customerRequestService } from '../services/customerRequestService';

export const CustomerRequestsPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    action: '', // 'submit' | 'cancel'
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
    page,
    pageSize,
    setSearch,
    setStatusFilter,
    setPriorityFilter,
    setPage,
    setPageSize,
    refetch,
  } = useCustomerRequests();

  const handleSubmitClick = (requestRecord) => {
    setConfirmModal({
      isOpen: true,
      action: 'submit',
      request: requestRecord,
      isSubmitting: false,
    });
  };

  const handleCancelClick = (requestRecord) => {
    setConfirmModal({
      isOpen: true,
      action: 'cancel',
      request: requestRecord,
      isSubmitting: false,
    });
  };

  const handleConfirmAction = async () => {
    const { action, request: requestRecord } = confirmModal;
    if (!requestRecord) return;

    setConfirmModal((prev) => ({ ...prev, isSubmitting: true }));
    try {
      if (action === 'submit') {
        await customerRequestService.submitRequest(requestRecord.id);
        toast.success(`Request "${requestRecord.title}" submitted to sales workflow.`);
      } else if (action === 'cancel') {
        await customerRequestService.cancelRequest(requestRecord.id);
        toast.success(`Request "${requestRecord.title}" cancelled.`);
      }
      setConfirmModal({ isOpen: false, action: '', request: null, isSubmitting: false });
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to update requirement request.');
      setConfirmModal((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setPage(1);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <PageHeader
        title="My Commercial Requirement Requests"
        description="Track procurement proposals, submitted specifications, and active lifecycle status."
        actions={
          <Button
            variant="primary"
            leftIcon={Plus}
            onClick={() => navigate('/customer/requests/new')}
            className="bg-[#714B67] hover:bg-[#5a3b52] text-white"
          >
            Create New Request
          </Button>
        }
      />

      {/* Filters */}
      <CustomerRequestFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        onReset={handleResetFilters}
      />

      {/* Main Table Card */}
      <Card variant="default" padding="none" className="overflow-hidden">
        <CustomerRequestTable
          requests={requests}
          loading={loading}
          error={error}
          onRetry={refetch}
          onView={(id) => navigate(`/customer/requests/${id}`)}
          onSubmitRequest={handleSubmitClick}
          onCancelRequest={handleCancelClick}
          emptyTitle="You have not submitted any requirement requests"
          emptyDescription="Create a new commercial request to specify product attributes and communicate with sales engineers."
          emptyAction={
            <Button
              variant="primary"
              leftIcon={Plus}
              onClick={() => navigate('/customer/requests/new')}
              className="bg-[#714B67] hover:bg-[#5a3b52] text-white"
            >
              Create Your First Request
            </Button>
          }
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
        title={confirmModal.action === 'submit' ? 'Submit Requirement Request' : 'Cancel Requirement Request'}
        description={
          confirmModal.action === 'submit'
            ? `Submit request "${confirmModal.request?.title}" into the DealFlow360 sales workflow? An assigned sales representative will review your specifications.`
            : `Are you sure you want to cancel request "${confirmModal.request?.title}"? Cancelled requests remain in your history.`
        }
        confirmLabel={confirmModal.action === 'submit' ? 'Submit Request' : 'Cancel Request'}
        confirmVariant={confirmModal.action === 'submit' ? 'primary' : 'danger'}
        isLoading={confirmModal.isSubmitting}
      />
    </div>
  );
};

export default CustomerRequestsPage;
