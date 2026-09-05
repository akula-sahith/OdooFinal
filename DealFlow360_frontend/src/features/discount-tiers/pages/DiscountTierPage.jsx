import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Card } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import { Pagination } from '../../../components/tables/Pagination/Pagination';
import { ConfirmationDialog } from '../../../components/dialogs/ConfirmationDialog/ConfirmationDialog';
import { useToast } from '../../../components/feedback/Toast';
import { usePermissions } from '../../../hooks/auth/usePermissions';
import { useDiscountTiers } from '../hooks/useDiscountTiers';
import { DiscountTierFilters } from '../components/DiscountTierFilters';
import { DiscountTierTable } from '../components/DiscountTierTable';
import { discountTierService } from '../services/discountTierService';

export const DiscountTierPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { hasPermission } = usePermissions();

  const canCreate = hasPermission('discounts.create');
  const canUpdate = hasPermission('discounts.update');
  const canManageStatus = hasPermission('discounts.manage_status');

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [approvalLevel, setApprovalLevel] = useState('ALL');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Status Toggle Confirmation Modal State
  const [statusModalState, setStatusModalState] = useState({
    isOpen: false,
    tier: null,
    targetStatus: '',
    isSubmitting: false,
  });

  const {
    discountTiers,
    total,
    totalPages,
    isLoading,
    error,
    refetch,
  } = useDiscountTiers({
    search,
    status,
    approvalLevel,
    page,
    pageSize,
  });

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handleApprovalLevelChange = (value) => {
    setApprovalLevel(value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatus('ALL');
    setApprovalLevel('ALL');
    setPage(1);
  };

  // Open confirmation modal for status toggle
  const handleToggleStatusClick = (tier) => {
    const targetStatus = tier.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setStatusModalState({
      isOpen: true,
      tier,
      targetStatus,
      isSubmitting: false,
    });
  };

  // Confirm status update
  const handleConfirmStatusToggle = async () => {
    const { tier, targetStatus } = statusModalState;
    if (!tier) return;

    setStatusModalState((prev) => ({ ...prev, isSubmitting: true }));
    try {
      await discountTierService.updateDiscountTierStatus(tier.id, targetStatus);
      toast.success(
        `Discount Tier "${tier.name}" ${
          targetStatus === 'ACTIVE' ? 'activated' : 'deactivated'
        } successfully.`
      );
      setStatusModalState({ isOpen: false, tier: null, targetStatus: '', isSubmitting: false });
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to update discount tier status.');
      setStatusModalState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Discount Tiers"
        description="Configure permitted discount percentages, role-based thresholds, and approval escalation tiers."
        actions={
          canCreate ? (
            <div className="flex items-center gap-2.5">
              <Button
                variant="primary"
                leadingIcon={Plus}
                onClick={() => navigate('/company/discount-tiers/new')}
              >
                Create Discount Tier
              </Button>
            </div>
          ) : null
        }
      />

      {/* Main Table Card Container */}
      <Card variant="default" padding="none" className="overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 bg-slate-50/50">
          <DiscountTierFilters
            search={search}
            onSearchChange={handleSearchChange}
            status={status}
            onStatusChange={handleStatusChange}
            approvalLevel={approvalLevel}
            onApprovalLevelChange={handleApprovalLevelChange}
            onReset={handleResetFilters}
          />
        </div>

        <DiscountTierTable
          discountTiers={discountTiers}
          loading={isLoading}
          error={error}
          onRetry={refetch}
          onView={(id) => navigate(`/company/discount-tiers/${id}`)}
          onEdit={canUpdate ? (id) => navigate(`/company/discount-tiers/${id}/edit`) : undefined}
          onToggleStatus={canManageStatus ? handleToggleStatusClick : undefined}
        />

        {/* Pagination Footer */}
        {!isLoading && !error && total > 0 && (
          <div className="px-6 py-4 border-t border-slate-200/80 bg-slate-50/30">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={total}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPage(1);
              }}
            />
          </div>
        )}
      </Card>

      {/* Confirmation Modal for Activation/Deactivation */}
      <ConfirmationDialog
        isOpen={statusModalState.isOpen}
        onClose={() => setStatusModalState({ isOpen: false, tier: null, targetStatus: '', isSubmitting: false })}
        onConfirm={handleConfirmStatusToggle}
        title={
          statusModalState.targetStatus === 'ACTIVE'
            ? 'Activate Discount Tier'
            : 'Deactivate Discount Tier'
        }
        description={`Are you sure you want to set "${statusModalState.tier?.name}" to ${statusModalState.targetStatus}? ${
          statusModalState.targetStatus === 'INACTIVE'
            ? 'Deactivated discount rules will not be evaluated during quotation creation.'
            : 'Activated discount rules will take effect for quotation discount checks.'
        }`}
        confirmLabel={
          statusModalState.targetStatus === 'ACTIVE'
            ? 'Activate Tier'
            : 'Deactivate Tier'
        }
        confirmVariant={
          statusModalState.targetStatus === 'ACTIVE' ? 'primary' : 'danger'
        }
        isLoading={statusModalState.isSubmitting}
      />
    </div>
  );
};

export default DiscountTierPage;
