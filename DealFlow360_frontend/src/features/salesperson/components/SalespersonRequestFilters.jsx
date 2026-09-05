import React from 'react';
import { RefreshCw, Filter } from 'lucide-react';
import { SearchInput } from '../../../components/ui/SearchInput/SearchInput';
import { Select } from '../../../components/ui/Select/Select';
import { Button } from '../../../components/ui/Button/Button';
import { SALESPERSON_REQUEST_STATUS_LABELS } from '../types/salespersonTypes';

/**
 * SalespersonRequestFilters Component
 * Search bar, status filter, priority filter, assignment filter, and filter reset control.
 */
export const SalespersonRequestFilters = ({
  search = '',
  onSearchChange,
  statusFilter = 'ALL',
  onStatusFilterChange,
  priorityFilter = 'ALL',
  onPriorityFilterChange,
  assignmentFilter = 'ALL',
  onAssignmentFilterChange,
  onReset,
}) => {
  const statusOptions = [
    { value: 'ALL', label: 'All Lifecycle Statuses' },
    { value: 'SUBMITTED', label: SALESPERSON_REQUEST_STATUS_LABELS.SUBMITTED },
    { value: 'UNDER_REVIEW', label: SALESPERSON_REQUEST_STATUS_LABELS.UNDER_REVIEW },
    { value: 'REQUIREMENT_CLARIFICATION', label: SALESPERSON_REQUEST_STATUS_LABELS.REQUIREMENT_CLARIFICATION },
    { value: 'REQUIREMENT_CONFIRMED', label: SALESPERSON_REQUEST_STATUS_LABELS.REQUIREMENT_CONFIRMED },
    { value: 'CLOSED', label: SALESPERSON_REQUEST_STATUS_LABELS.CLOSED },
    { value: 'CANCELLED', label: SALESPERSON_REQUEST_STATUS_LABELS.CANCELLED },
  ];

  const priorityOptions = [
    { value: 'ALL', label: 'All Priorities' },
    { value: 'URGENT', label: 'Urgent Priority' },
    { value: 'HIGH', label: 'High Priority' },
    { value: 'NORMAL', label: 'Normal Priority' },
    { value: 'LOW', label: 'Low Priority' },
  ];

  const assignmentOptions = [
    { value: 'ALL', label: 'All Assignments' },
    { value: 'MINE', label: 'Assigned to Me' },
    { value: 'UNASSIGNED', label: 'Unassigned Requests' },
  ];

  const isFiltered = search !== '' || statusFilter !== 'ALL' || priorityFilter !== 'ALL' || assignmentFilter !== 'ALL';

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-3 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
      {/* Search Input */}
      <div className="flex-1 max-w-md">
        <SearchInput
          value={search}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          onClear={() => onSearchChange && onSearchChange('')}
          placeholder="Search by ID, customer name, title, or specification..."
        />
      </div>

      {/* Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-44">
          <Select
            value={assignmentFilter}
            onChange={(e) => onAssignmentFilterChange && onAssignmentFilterChange(e.target.value)}
            options={assignmentOptions}
          />
        </div>

        <div className="w-48">
          <Select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange && onStatusFilterChange(e.target.value)}
            options={statusOptions}
          />
        </div>

        <div className="w-40">
          <Select
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange && onPriorityFilterChange(e.target.value)}
            options={priorityOptions}
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

export default SalespersonRequestFilters;
