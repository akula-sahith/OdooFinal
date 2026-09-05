import React from 'react';
import { SearchInput } from '../../../components/ui/SearchInput/SearchInput';
import { Select } from '../../../components/ui/Select/Select';
import { Button } from '../../../components/ui/Button/Button';
import { RotateCcw } from 'lucide-react';
import { APPROVAL_LEVELS } from '../types/discountTierTypes';

/**
 * DiscountTierFilters Component
 * Search bar, status filter, approval level filter, and reset action for discount tiers table.
 */
export const DiscountTierFilters = ({
  search = '',
  onSearchChange,
  status = 'ALL',
  onStatusChange,
  approvalLevel = 'ALL',
  onApprovalLevelChange,
  onReset,
}) => {
  const statusOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'ACTIVE', label: 'Active Only' },
    { value: 'INACTIVE', label: 'Inactive Only' },
  ];

  const levelOptions = [
    { value: 'ALL', label: 'All Approval Levels' },
    ...APPROVAL_LEVELS.map((lvl) => ({
      value: String(lvl.value),
      label: lvl.label,
    })),
  ];

  const isFiltered = search !== '' || status !== 'ALL' || approvalLevel !== 'ALL';

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-left">
      {/* Search Input */}
      <div className="w-full md:w-80 shrink-0">
        <SearchInput
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onClear={() => onSearchChange('')}
          placeholder="Search by name, code, or role..."
        />
      </div>

      {/* Select Filters & Reset Button */}
      <div className="flex items-center gap-2.5 flex-wrap md:flex-nowrap">
        <div className="w-40">
          <Select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            options={statusOptions}
          />
        </div>

        <div className="w-56">
          <Select
            value={approvalLevel}
            onChange={(e) => onApprovalLevelChange(e.target.value)}
            options={levelOptions}
          />
        </div>

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
};

export default DiscountTierFilters;
