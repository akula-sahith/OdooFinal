import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Tag } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Card } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import { Pagination } from '../../../components/tables/Pagination/Pagination';
import { useQuotations } from '../hooks/useQuotations';
import { QuotationTable } from '../components/QuotationTable';
import { QuotationFilters } from '../components/QuotationFilters';
import { quotationService } from '../services/quotationService';

export const QuotationPage = () => {
  const navigate = useNavigate();
  const [priceListOptions, setPriceListOptions] = useState([]);

  const {
    quotations,
    loading,
    error,
    meta,
    search,
    statusFilter,
    priceListFilter,
    page,
    pageSize,
    setSearch,
    setStatusFilter,
    setPriceListFilter,
    setPage,
    setPageSize,
    refetch,
  } = useQuotations();

  useEffect(() => {
    async function loadPriceLists() {
      try {
        const lists = await quotationService.getQuotationEligiblePriceLists();
        setPriceListOptions(lists);
      } catch (err) {
        // ignore
      }
    }
    loadPriceLists();
  }, []);

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setPriceListFilter('ALL');
    setPage(1);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <PageHeader
        title="B2B Commercial Quotations Workspace"
        description="Draft commercial pricing proposals, manage quote specifications, and track proposal governance."
        actions={
          <Button
            variant="primary"
            leftIcon={Plus}
            onClick={() => navigate('/company/quotations/new')}
            className="bg-[#714B67] hover:bg-[#5a3b52] text-white"
          >
            Create Quotation
          </Button>
        }
      />

      {/* Filters Bar */}
      <QuotationFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priceListFilter={priceListFilter}
        onPriceListFilterChange={setPriceListFilter}
        priceListOptions={priceListOptions}
        onReset={handleResetFilters}
      />

      {/* Main Table Card */}
      <Card variant="default" padding="none" className="overflow-hidden">
        <QuotationTable
          quotations={quotations}
          loading={loading}
          error={error}
          onRetry={refetch}
          onView={(id) => navigate(`/company/quotations/${id}`)}
          onEdit={(id) => navigate(`/company/quotations/${id}/edit`)}
          emptyTitle="No sales quotations found"
          emptyDescription="Create a new commercial proposal from a confirmed customer request."
          emptyAction={
            <Button
              variant="primary"
              leftIcon={Plus}
              onClick={() => navigate('/company/quotations/new')}
              className="bg-[#714B67] hover:bg-[#5a3b52] text-white"
            >
              Create First Quotation
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
    </div>
  );
};

export default QuotationPage;
