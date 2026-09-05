import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { SearchInput } from '../../../components/ui/SearchInput/SearchInput';
import { Select } from '../../../components/ui/Select/Select';

/**
 * UserFilters Component
 * Search and Filter control bar for Staff Users table.
 */
export const UserFilters = ({
  search = '',
  onSearchChange,
  roleIdFilter = 'ALL',
  onRoleFilterChange,
  statusFilter = 'ALL',
  onStatusFilterChange,
  roles = [],
  onReset,
}) => {
  const roleOptions = [
    { value: 'ALL', label: 'All Roles' },
    ...roles.map((r) => ({ value: r.id, label: r.name })),
  ];

  const statusOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
  ];

  const isFiltered = search.trim() !== '' || roleIdFilter !== 'ALL' || statusFilter !== 'ALL';

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm mb-6">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="flex-1 max-w-md">
          <SearchInput
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange('')}
            placeholder="Search by staff name or email..."
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Filters:
          </div>

          <div className="w-48">
            <Select
              value={roleIdFilter}
              onChange={(e) => onRoleFilterChange(e.target.value)}
              options={roleOptions}
              aria-label="Filter by Role"
            />
          </div>

          <div className="w-36">
            <Select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              options={statusOptions}
              aria-label="Filter by Status"
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

export default UserFilters;
