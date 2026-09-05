import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { Input } from '../../../components/ui/Input/Input';
import { Select } from '../../../components/ui/Select/Select';

/**
 * ApprovalFilters Component
 * Debounced search & filter bar for approval workspace queues.
 */
export const ApprovalFilters = ({
  filters = {},
  onFilterChange,
  onReset,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== filters.search) {
        onFilterChange({ search: searchTerm });
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, filters.search, onFilterChange]);

  const handleSelectChange = (key) => (e) => {
    onFilterChange({ [key]: e.target.value });
  };

  const statusOptions = [
    { value: 'ALL', label: 'All Approval Statuses' },
    { value: 'PENDING_MANAGER_APPROVAL', label: 'Pending Manager Approval' },
    { value: 'PENDING_FINANCE_APPROVAL', label: 'Pending Finance Approval' },
    { value: 'REVISION_REQUESTED', label: 'Revision Requested' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
  ];

  const approvalLevelOptions = [
    { value: 'ALL', label: 'All Approval Levels' },
    { value: 'MANAGER', label: 'Tier 1 — Sales Manager' },
    { value: 'FINANCE', label: 'Tier 2 — Finance & Ops' },
  ];

  const riskLevelOptions = [
    { value: 'ALL', label: 'All Risk Classifications' },
    { value: 'NORMAL', label: 'Normal Risk' },
    { value: 'MEDIUM', label: 'Medium Risk' },
    { value: 'HIGH', label: 'High Risk' },
    { value: 'CRITICAL', label: 'Critical Risk' },
  ];

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-center">
        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search QTN#, Customer, Request..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={filters.status || 'ALL'}
          onChange={handleSelectChange('status')}
          options={statusOptions}
          className="text-xs"
        />

        {/* Approval Level Filter */}
        <Select
          value={filters.approvalLevel || 'ALL'}
          onChange={handleSelectChange('approvalLevel')}
          options={approvalLevelOptions}
          className="text-xs"
        />

        {/* Risk Level Filter */}
        <Select
          value={filters.riskLevel || 'ALL'}
          onChange={handleSelectChange('riskLevel')}
          options={riskLevelOptions}
          className="text-xs"
        />
      </div>
    </div>
  );
};
