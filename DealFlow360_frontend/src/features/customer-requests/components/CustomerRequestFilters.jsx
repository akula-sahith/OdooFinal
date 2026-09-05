import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { SearchInput } from '../../../components/ui/SearchInput/SearchInput';
import { Select } from '../../../components/ui/Select/Select';
import { REQUEST_STATUS_OPTIONS, REQUEST_PRIORITY_OPTIONS } from '../types/customerRequestTypes';

/**
 * CustomerRequestFilters Component
 * Search and Filter bar for customer requirement requests.
 */
export const CustomerRequestFilters = ({
  search = '',
  onSearchChange,
  statusFilter = 'ALL',
  onStatusFilterChange,
  priorityFilter = 'ALL',
  onPriorityFilterChange,
  onReset,
}) => {
  const isFiltered = search.trim() !== '' || statusFilter !== 'ALL' || priorityFilter !== 'ALL';

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm mb-6 text-left">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="flex-1 max-w-md">
          <SearchInput
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange('')}
            placeholder="Search by request ID, title, or details..."
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Filters:
          </div>

          <div className="w-44">
            <Select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              options={REQUEST_STATUS_OPTIONS}
              aria-label="Filter by Status"
            />
          </div>

          <div className="w-40">
            <Select
              value={priorityFilter}
              onChange={(e) => onPriorityFilterChange(e.target.value)}
              options={REQUEST_PRIORITY_OPTIONS}
              aria-label="Filter by Priority"
            />
          </div>

          {isFiltered && onReset && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerRequestFilters;
