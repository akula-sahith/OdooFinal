import React from 'react';
import { Eye, Edit3, Tag, Building2, FileText } from 'lucide-react';
import { DataTable } from '../../../components/tables/DataTable/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge/StatusBadge';
import { formatCurrency } from '../../../constants/currency';
import { QUOTATION_STATUS_DEFINITIONS } from '../../../constants/quotationStatus';

/**
 * QuotationTable Component
 * Displays commercial quotations, status badges, totals, customer links, and action controls.
 */
export const QuotationTable = ({
  quotations = [],
  loading = false,
  error = null,
  onRetry,
  onView,
  onEdit,
  sortColumn = 'updatedAt',
  sortDirection = 'desc',
  onSort,
  emptyTitle = 'No sales quotations found',
  emptyDescription = 'No commercial quotations match your search or filter parameters.',
  emptyAction,
}) => {
  const columns = [
    {
      key: 'quotationNumber',
      label: 'Quotation Number & Title',
      sortable: true,
      render: (val, row) => (
        <div className="py-0.5 text-left">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-extrabold text-[#714B67] bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              {row.quotationNumber || row.quotationId}
            </span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                onView && onView(row.quotationId || row.quotationNumber);
              }}
              className="font-bold text-slate-900 text-sm tracking-tight hover:text-[#714B67] transition-colors cursor-pointer block line-clamp-1"
            >
              {row.title}
            </span>
          </div>
          {row.requestId && (
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Ref Request: <span className="font-mono text-[#714B67]">{row.requestId}</span>
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
        <div className="py-0.5 text-left">
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
      key: 'priceListName',
      label: 'Price List Catalog',
      sortable: true,
      render: (val) => (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-700">
          <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {val || 'Standard Catalog'}
        </span>
      ),
    },
    {
      key: 'grandTotal',
      label: 'Grand Total',
      sortable: true,
      render: (val, row) => (
        <span className="font-extrabold text-slate-900 text-xs font-mono">
          {formatCurrency(val || 0, row.currency || 'INR')}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Governance Status',
      sortable: true,
      render: (val) => {
        const def = QUOTATION_STATUS_DEFINITIONS[val] || {};
        return (
          <StatusBadge
            status={val || 'DRAFT'}
            customLabel={def.label || val}
            size="sm"
          />
        );
      },
    },
    {
      key: 'updatedAt',
      label: 'Updated Date',
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
              onClick={() => onView(row.quotationId || row.quotationNumber)}
              className="p-1.5 text-slate-500 hover:text-[#714B67] hover:bg-[#F7F2F5] rounded-lg transition-colors cursor-pointer"
              title="Inspect Quotation Specifications"
              aria-label={`View ${row.quotationNumber}`}
            >
              <Eye className="w-4 h-4" />
            </button>
          )}

          {row.status === 'DRAFT' && onEdit && (
            <button
              type="button"
              onClick={() => onEdit(row.quotationId || row.quotationNumber)}
              className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              title="Edit Draft Proposal"
              aria-label={`Edit ${row.quotationNumber}`}
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={quotations}
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

export default QuotationTable;
