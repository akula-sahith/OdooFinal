import React from 'react';
import { Eye, CheckCircle, MessageSquare, Play, UserCheck, Building2 } from 'lucide-react';
import { DataTable } from '../../../components/tables/DataTable/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge/StatusBadge';
import { SALESPERSON_REQUEST_STATUS_LABELS } from '../types/salespersonTypes';

/**
 * SalespersonRequestTable Component
 * Renders requirement requests queue, customer information, status badges, and quick review controls.
 */
export const SalespersonRequestTable = ({
  requests = [],
  loading = false,
  error = null,
  onRetry,
  onView,
  onStartReview,
  onConfirmRequirement,
  onClaimRequest,
  sortColumn = 'updatedAt',
  sortDirection = 'desc',
  onSort,
  emptyTitle = 'No customer requirement requests found',
  emptyDescription = 'There are currently no requirement requests matching your selected filter criteria.',
  emptyAction,
}) => {
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'LOW':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-purple-50 text-[#714B67] border-purple-200';
    }
  };

  const columns = [
    {
      key: 'requestId',
      label: 'Request ID & Title',
      sortable: true,
      render: (val, row) => (
        <div className="py-0.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#714B67] bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              {row.requestId || row.id}
            </span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                onView && onView(row.id || row.requestId);
              }}
              className="font-bold text-slate-900 text-sm tracking-tight hover:text-[#714B67] transition-colors cursor-pointer block line-clamp-1"
            >
              {row.title}
            </span>
          </div>
          {row.productName && (
            <p className="text-xs text-slate-500 font-medium line-clamp-1 max-w-sm mt-0.5">
              Ref: {row.productName} {row.quantity ? `(${row.quantity} units)` : ''}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'customerName',
      label: 'Customer Account',
      sortable: true,
      render: (_, row) => (
        <div className="py-0.5">
          <div className="flex items-center gap-1.5 font-semibold text-slate-900 text-xs">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{row.companyName || row.customerName || 'B2B Client'}</span>
          </div>
          {row.customerEmail && (
            <p className="text-[11px] text-slate-500 font-normal truncate max-w-xs mt-0.5">
              {row.customerEmail}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (val) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold border ${getPriorityBadgeClass(val)}`}>
          {val || 'NORMAL'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-1.5">
          <StatusBadge
            status={val || 'SUBMITTED'}
            customLabel={SALESPERSON_REQUEST_STATUS_LABELS[val]}
            size="sm"
          />
          {row.unreadMessageCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 animate-pulse" title="Unread messages from customer" />
          )}
        </div>
      ),
    },
    {
      key: 'assignedSalespersonName',
      label: 'Assigned Lead',
      sortable: true,
      render: (val, row) => (
        <div className="py-0.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
            <UserCheck className="w-3.5 h-3.5 text-[#714B67] shrink-0" />
            {val || 'Unassigned'}
          </span>
          {!val && onClaimRequest && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClaimRequest(row);
              }}
              className="text-[11px] font-bold text-[#714B67] hover:underline block mt-0.5"
            >
              Claim Request
            </button>
          )}
        </div>
      ),
    },
    {
      key: 'updatedAt',
      label: 'Last Updated',
      sortable: true,
      render: (val) => {
        if (!val) return <span className="text-slate-400 text-xs">-</span>;
        try {
          return (
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
              {new Date(val).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          );
        } catch {
          return <span className="text-xs text-slate-400">{String(val)}</span>;
        }
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      headerClassName: 'text-right',
      className: 'text-right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1 select-none" onClick={(e) => e.stopPropagation()}>
          {onView && (
            <button
              type="button"
              onClick={() => onView(row.id || row.requestId)}
              className="p-1.5 text-slate-500 hover:text-[#714B67] hover:bg-[#F7F2F5] rounded-lg transition-colors cursor-pointer"
              title="Inspect Request & Message History"
              aria-label={`View ${row.title}`}
            >
              <Eye className="w-4 h-4" />
            </button>
          )}

          {row.status === 'SUBMITTED' && onStartReview && (
            <button
              type="button"
              onClick={() => onStartReview(row)}
              className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
              title="Start Reviewing Requirement"
              aria-label={`Start review for ${row.title}`}
            >
              <Play className="w-4 h-4" />
            </button>
          )}

          {(row.status === 'UNDER_REVIEW' || row.status === 'REQUIREMENT_CLARIFICATION') && onConfirmRequirement && (
            <button
              type="button"
              onClick={() => onConfirmRequirement(row)}
              className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
              title="Confirm Customer Requirement"
              aria-label={`Confirm requirement for ${row.title}`}
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={requests}
      isLoading={loading}
      error={error ? (typeof error === 'string' ? { message: error } : error) : null}
      onRetry={onRetry}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      emptyAction={emptyAction}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSort={onSort}
    />
  );
};

export default SalespersonRequestTable;
