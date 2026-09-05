import React from 'react';
import { RefreshCw } from 'lucide-react';
import { SearchInput } from '../../../components/ui/SearchInput/SearchInput';
import { Select } from '../../../components/ui/Select/Select';
import { Button } from '../../../components/ui/Button/Button';
import { QUOTATION_STATUS_DEFINITIONS } from '../../../constants/quotationStatus';

/**
 * QuotationFilters Component
 * Search bar, governance status filter, price list filter, and filter reset control.
 */
export const QuotationFilters = ({
  search = '',
  onSearchChange,
  statusFilter = 'ALL',
  onStatusFilterChange,
  priceListFilter = 'ALL',
  onPriceListFilterChange,
  priceListOptions = [],
  onReset,
}) => {
  const statusOptions = [
    { value: 'ALL', label: 'All Governance Statuses' },
    { value: 'DRAFT', label: QUOTATION_STATUS_DEFINITIONS.DRAFT.label },
    { value: 'PENDING_MANAGER_APPROVAL', label: QUOTATION_STATUS_DEFINITIONS.PENDING_MANAGER_APPROVAL.label },
    { value: 'APPROVED', label: QUOTATION_STATUS_DEFINITIONS.APPROVED.label },
    { value: 'SENT', label: QUOTATION_STATUS_DEFINITIONS.SENT.label },
    { value: 'ACCEPTED', label: QUOTATION_STATUS_DEFINITIONS.ACCEPTED.label },
    { value: 'REJECTED', label: QUOTATION_STATUS_DEFINITIONS.REJECTED.label },
    { value: 'EXPIRED', label: QUOTATION_STATUS_DEFINITIONS.EXPIRED.label },
    { value: 'CANCELLED', label: QUOTATION_STATUS_DEFINITIONS.CANCELLED.label },
  ];

  const formattedPriceListOptions = [
    { value: 'ALL', label: 'All Price Catalogs' },
    ...priceListOptions.map((pl) => ({
      value: pl.id || pl.priceListId,
      label: pl.name || pl.priceListName || pl.id,
    })),
  ];

  const isFiltered = search !== '' || statusFilter !== 'ALL' || priceListFilter !== 'ALL';

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-3 md:space-y-0 md:flex md:items-center md:justify-between gap-4 text-left">
      {/* Search Input */}
      <div className="flex-1 max-w-md">
        <SearchInput
          value={search}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          onClear={() => onSearchChange && onSearchChange('')}
          placeholder="Search by quote #, title, request ID, or client..."
        />
      </div>

      {/* Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-52">
          <Select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange && onStatusFilterChange(e.target.value)}
            options={statusOptions}
          />
        </div>

        <div className="w-52">
          <Select
            value={priceListFilter}
            onChange={(e) => onPriceListFilterChange && onPriceListFilterChange(e.target.value)}
            options={formattedPriceListOptions}
          />
        </div>

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            leftIcon={RefreshCw}
            className="text-slate-600 hover:text-[#714B67]"
          >
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuotationFilters;
