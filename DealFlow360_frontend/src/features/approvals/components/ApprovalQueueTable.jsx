import React from 'react';
import { Eye, ShieldAlert, ArrowRight, Clock, FileCheck } from 'lucide-react';
import { DataTable } from '../../../components/tables/DataTable/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge/StatusBadge';
import { formatCurrency } from '../../../constants/currency';
import { QUOTATION_STATUS_DEFINITIONS } from '../../../constants/quotationStatus';

/**
 * ApprovalQueueTable Component
 * Displays commercial proposals awaiting Sales Manager or Finance/Ops authorization.
 */
export const ApprovalQueueTable = ({
  queue = [],
  loading = false,
  error = null,
  onRetry,
  onViewDetails,
  sortColumn = 'submittedAt',
  sortDirection = 'desc',
  onSort,
  emptyTitle = 'No pending approvals',
  emptyDescription = 'No commercial quotations currently require your approval sign-off.',
}) => {
  const riskBadgeStyles = {
    NORMAL: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    MEDIUM: 'bg-amber-50 text-amber-800 border-amber-200',
    HIGH: 'bg-purple-50 text-[#714B67] border-purple-200',
    CRITICAL: 'bg-rose-50 text-rose-800 border-rose-200',
  };

  const columns = [
    {
      key: 'quotationNumber',
      header: 'Quotation Number',
      sortable: true,
      render: (row) => (
        <div className="space-y-0.5 text-left">
          <span className="font-mono font-extrabold text-[#714B67] bg-purple-50 px-2 py-0.5 rounded border border-purple-200 text-xs">
            {row.quotationNumber || row.quotationId}
          </span>
          <div className="text-[10px] text-slate-400 font-mono">Ver {row.version || 1}</div>
        </div>
      ),
    },
    {
      key: 'companyName',
      header: 'Customer Account',
      sortable: true,
      render: (row) => (
        <div className="text-left">
          <div className="font-bold text-slate-900 text-xs">{row.companyName || row.customerName}</div>
          <div className="text-[11px] text-slate-500">{row.customerEmail || 'Client Account'}</div>
        </div>
      ),
    },
    {
      key: 'salespersonName',
      header: 'Sales Rep',
      sortable: true,
      render: (row) => (
        <span className="font-medium text-slate-800 text-xs text-left block">
          {row.salespersonName || 'Sarah Jenkins'}
        </span>
      ),
    },
    {
      key: 'requestId',
      header: 'Source Request',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-left inline-flex items-center gap-1">
          <FileCheck size={11} /> {row.requestId}
        </span>
      ),
    },
    {
      key: 'discountPercentage',
      header: 'Discount %',
      sortable: true,
      render: (row) => {
        const pct = row.discountPercentage || 0;
        return (
          <div className="text-center">
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              {pct}%
            </span>
          </div>
        );
      },
    },
    {
      key: 'riskLevel',
      header: 'Risk Level',
      sortable: true,
      render: (row) => {
        const risk = row.riskLevel || 'NORMAL';
        return (
          <div className="text-center">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                riskBadgeStyles[risk] || riskBadgeStyles.NORMAL
              }`}
            >
              {risk}
            </span>
          </div>
        );
      },
    },
    {
      key: 'approvalLevel',
      header: 'Sign-off Level',
      sortable: true,
      render: (row) => {
        const lvl = row.approvalLevel || 'MANAGER';
        return (
          <span className="font-semibold text-slate-700 text-xs text-center block">
            {lvl}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Governance Status',
      sortable: true,
      render: (row) => {
        const statusDef = QUOTATION_STATUS_DEFINITIONS[row.status] || {};
        return (
          <StatusBadge
            status={row.status || 'PENDING_MANAGER_APPROVAL'}
            customLabel={statusDef.label}
            size="sm"
          />
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (row) => (
        <div className="text-center">
          <button
            type="button"
            onClick={() => onViewDetails(row.quotationId || row.quotationNumber)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#714B67] hover:bg-[#5a3b52] text-white text-xs font-bold shadow-2xs transition-colors"
          >
            Review Proposal <ArrowRight size={13} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={queue}
      loading={loading}
      error={error}
      onRetry={onRetry}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSort={onSort}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
    />
  );
};
