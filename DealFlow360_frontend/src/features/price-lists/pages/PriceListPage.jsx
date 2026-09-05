import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Card } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import { Pagination } from '../../../components/tables/Pagination/Pagination';
import { ConfirmationDialog } from '../../../components/dialogs/ConfirmationDialog/ConfirmationDialog';
import { useToast } from '../../../components/feedback/Toast';
import { usePriceLists } from '../hooks/usePriceLists';
import { PriceListFilters } from '../components/PriceListFilters';
import { PriceListTable } from '../components/PriceListTable';
import { priceListService } from '../services/priceListService';

export const PriceListPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [currency, setCurrency] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Status Toggle Confirmation State
  const [statusModalState, setStatusModalState] = useState({
    isOpen: false,
    priceList: null,
    targetStatus: '',
    isSubmitting: false,
  });

  const {
    priceLists,
    total,
    totalPages,
    isLoading,
    error,
    refetch,
  } = usePriceLists({
    search,
    currency,
    status,
    page,
    pageSize,
  });

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleCurrencyChange = (value) => {
    setCurrency(value);
    setPage(1);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCurrency('ALL');
    setStatus('ALL');
    setPage(1);
  };

  // Open confirmation modal for status toggle
  const handleToggleStatusClick = (priceList) => {
    const targetStatus = priceList.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setStatusModalState({
      isOpen: true,
      priceList,
      targetStatus,
      isSubmitting: false,
    });
  };

  // Confirm status update
  const handleConfirmStatusToggle = async () => {
    const { priceList, targetStatus } = statusModalState;
    if (!priceList) return;

    setStatusModalState((prev) => ({ ...prev, isSubmitting: true }));
    try {
      await priceListService.updatePriceListStatus(priceList.id, targetStatus);
      toast.success(
        `Price List "${priceList.name}" ${
          targetStatus === 'ACTIVE' ? 'activated' : 'deactivated'
        } successfully.`
      );
      setStatusModalState({ isOpen: false, priceList: null, targetStatus: '', isSubmitting: false });
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to update price list status.');
      setStatusModalState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleCloseStatusModal = () => {
    if (statusModalState.isSubmitting) return;
    setStatusModalState({ isOpen: false, priceList: null, targetStatus: '', isSubmitting: false });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Price Lists"
        description="Configure base product price lists and currency catalogs for sales workflow."
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="primary"
              leadingIcon={Plus}
              onClick={() => navigate('/company/price-lists/new')}
            >
              Create Price List
            </Button>
          </div>
        }
      />

      {/* Filters and Table Container */}
      <Card variant="default" padding="none" className="overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 bg-slate-50/50">
          <PriceListFilters
            search={search}
            onSearchChange={handleSearchChange}
            currency={currency}
            onCurrencyChange={handleCurrencyChange}
            status={status}
            onStatusChange={handleStatusChange}
            onReset={handleResetFilters}
          />
        </div>

        <PriceListTable
          priceLists={priceLists}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          onView={(id) => navigate(`/company/price-lists/${id}`)}
          onEdit={(id) => navigate(`/company/price-lists/${id}/edit`)}
          onToggleStatus={handleToggleStatusClick}
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
        onClose={handleCloseStatusModal}
        onConfirm={handleConfirmStatusToggle}
        title={
          statusModalState.targetStatus === 'ACTIVE'
            ? 'Activate Price List'
            : 'Deactivate Price List'
        }
        description={`Are you sure you want to set "${statusModalState.priceList?.name}" to ${statusModalState.targetStatus}? ${
          statusModalState.targetStatus === 'INACTIVE'
            ? 'Deactivated price lists cannot be selected for new quotation creation.'
            : 'Activated price lists will become available for base price lookups.'
        }`}
        confirmLabel={
          statusModalState.targetStatus === 'ACTIVE'
            ? 'Activate Price List'
            : 'Deactivate Price List'
        }
        confirmVariant={
          statusModalState.targetStatus === 'ACTIVE' ? 'primary' : 'danger'
        }
        isLoading={statusModalState.isSubmitting}
      />
    </div>
  );
};

export default PriceListPage;
