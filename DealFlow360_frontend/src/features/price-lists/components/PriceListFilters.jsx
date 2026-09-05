import React from 'react';
import { RotateCcw } from 'lucide-react';
import { SearchInput } from '../../../components/ui/SearchInput/SearchInput';
import { Select } from '../../../components/ui/Select/Select';
import { Button } from '../../../components/ui/Button/Button';
import { SUPPORTED_CURRENCIES } from '../../../constants/currency';

/**
 * PriceListFilters Component
 * Compact filter bar with search (name/code), currency selector (from SUPPORTED_CURRENCIES), and status selector.
 */
export const PriceListFilters = ({
  filters = {},
  onSearchChange,
  onCurrencyChange,
  onStatusChange,
  onClearFilters,
  className = '',
}) => {
  const hasActiveFilters = Boolean(
    filters.search || filters.currency || filters.status
  );

  const currencyOptions = [
    { value: '', label: 'All Currencies' },
    ...SUPPORTED_CURRENCIES.map((c) => ({
      value: c.code,
      label: `${c.code} (${c.symbol}) - ${c.name}`,
    })),
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
  ];

  return (
    <div className={`p-3 bg-white border border-slate-200/80 rounded-2xl shadow-2xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3 ${className}`}>
      {/* Search Bar */}
      <div className="flex-1 min-w-[220px]">
        <SearchInput
          value={filters.search || ''}
          onSearch={(val) => onSearchChange && onSearchChange(val)}
          placeholder="Search price list name or code..."
        />
      </div>

      {/* Currency Filter */}
      <div className="w-full sm:w-52 shrink-0">
        <Select
          value={filters.currency || ''}
          onChange={(e) => onCurrencyChange && onCurrencyChange(e.target.value)}
          options={currencyOptions}
          placeholder="All Currencies"
        />
      </div>

      {/* Status Filter */}
      <div className="w-full sm:w-40 shrink-0">
        <Select
          value={filters.status || ''}
          onChange={(e) => onStatusChange && onStatusChange(e.target.value)}
          options={statusOptions}
          placeholder="All Statuses"
        />
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="w-full sm:w-auto h-10 text-xs font-semibold text-slate-600 border-slate-300 hover:bg-slate-50 shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Reset
        </Button>
      )}
    </div>
  );
};

export default PriceListFilters;
