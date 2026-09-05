import React from 'react';
import { Eye, Send, XCircle, FileText, UserCheck } from 'lucide-react';
import { DataTable } from '../../../components/tables/DataTable/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge/StatusBadge';

/**
 * CustomerRequestTable Component
 * Renders client requirement requests, priority tags, status indicators, and action controls.
 */
export const CustomerRequestTable = ({
  requests = [],
  loading = false,
  error = null,
  onRetry,
  onView,
  onSubmitRequest,
  onCancelRequest,
  sortColumn = 'createdAt',
  sortDirection = 'desc',
  onSort,
  emptyTitle = 'No requirement requests found',
  emptyDescription = 'You have not created any commercial requirement requests yet.',
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
      label: 'Request Details',
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
          {row.description && (
            <p className="text-xs text-slate-500 font-normal line-clamp-1 max-w-sm mt-0.5">
              {row.description}
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
      label: 'Lifecycle Status',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-1.5">
          <StatusBadge status={val || 'SUBMITTED'} size="sm" />
          {(row.unreadMessageCount > 0 || row.status === 'REQUIREMENT_CLARIFICATION') && (
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 animate-pulse" title="Requires customer reply" />
          )}
        </div>
      ),
    },
    {
      key: 'assignedSalespersonName',
      label: 'Sales Engineer',
      sortable: true,
      render: (val) => (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
          <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {val || 'Unassigned'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created Date',
      sortable: true,
      render: (val) => {
        if (!val) return <span className="text-slate-400 text-xs">-</span>;
        try {
          return (
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
              {new Date(val).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
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
              className="p-1.5 text-slate-400 hover:text-[#714B67] hover:bg-[#F7F2F5] rounded-lg transition-colors cursor-pointer"
              title="View Requirement Details & Conversation"
              aria-label={`View ${row.title}`}
            >
              <Eye className="w-4 h-4" />
            </button>
          )}

          {row.status === 'DRAFT' && onSubmitRequest && (
            <button
              type="button"
              onClick={() => onSubmitRequest(row)}
              className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
              title="Submit Request to Sales Workflow"
              aria-label={`Submit ${row.title}`}
            >
              <Send className="w-4 h-4" />
            </button>
          )}

          {(row.status === 'DRAFT' || row.status === 'SUBMITTED') && onCancelRequest && (
            <button
              type="button"
              onClick={() => onCancelRequest(row)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Cancel Request"
              aria-label={`Cancel ${row.title}`}
            >
              <XCircle className="w-4 h-4" />
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

export default CustomerRequestTable;
