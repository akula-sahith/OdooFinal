import React from 'react';
import { Eye, Edit3, Power, Calendar, Layers } from 'lucide-react';
import { DataTable } from '../../../components/tables/DataTable/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge/StatusBadge';

/**
 * PriceListTable Component
 * Renders master price list records with code badges, currency badges, effective date ranges, and actions.
 */
export const PriceListTable = ({
  priceLists = [],
  loading = false,
  error = null,
  onRetry,
  onViewPriceList,
  onEditPriceList,
  onToggleStatus,
  sortColumn = 'name',
  sortDirection = 'asc',
  onSort,
  emptyTitle = 'No price lists found',
  emptyDescription = 'No master price lists have been configured in the system yet.',
  emptyAction,
}) => {
  const columns = [
    {
      key: 'name',
      label: 'Price List Name',
      sortable: true,
      render: (val, row) => (
        <div className="py-0.5">
          <span
            onClick={(e) => {
              e.stopPropagation();
              onViewPriceList && onViewPriceList(row);
            }}
            className="font-bold text-slate-900 text-sm tracking-tight hover:text-[#714B67] transition-colors cursor-pointer block"
          >
            {row.name || 'Unnamed Price List'}
          </span>
          {row.description && (
            <p className="text-xs text-slate-500 font-normal line-clamp-1 max-w-sm mt-0.5 leading-relaxed">
              {row.description}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'code',
      label: 'Code',
      sortable: true,
      render: (val) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100/90 border border-slate-200 text-slate-700 text-xs font-mono font-bold rounded-lg tracking-wider select-all">
          <span className="w-1.5 h-1.5 rounded-full bg-[#714B67]/80 shrink-0" />
          {val || 'N/A'}
        </span>
      ),
    },
    {
      key: 'currency',
      label: 'Currency',
      sortable: true,
      render: (val) => (
        <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold text-slate-800 bg-slate-100 border border-slate-200/80 rounded-lg">
          {val ? String(val).toUpperCase() : 'USD'}
        </span>
      ),
    },
    {
      key: 'effective_period',
      label: 'Effective Period',
      sortable: false,
      render: (_, row) => {
        if (!row.effective_from && !row.effective_to) {
          return <span className="text-xs text-slate-400 font-medium">Always Effective</span>;
        }
        const fromStr = row.effective_from ? new Date(row.effective_from).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Indefinite';
        const toStr = row.effective_to ? new Date(row.effective_to).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Open';
        
        return (
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium whitespace-nowrap">
            <Calendar className="w-3.5 h-3.5 text-[#714B67] shrink-0" />
            <span>{fromStr}</span>
            <span className="text-slate-400">→</span>
            <span>{toStr}</span>
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => <StatusBadge status={val || 'INACTIVE'} size="sm" />,
    },
    {
      key: 'product_count',
      label: 'Products',
      sortable: true,
      render: (val, row) => {
        const count = val !== undefined ? val : (row.items?.length ?? 0);
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100/70 px-2 py-0.5 rounded-md">
            <Layers className="w-3 h-3 text-slate-400 shrink-0" />
            {count} items
          </span>
        );
      },
    },
    {
      key: 'updated_at',
      label: 'Updated',
      sortable: true,
      render: (val, row) => {
        const dateStr = val || row.created_at;
        if (!dateStr) return <span className="text-slate-400 text-xs">-</span>;
        try {
          return (
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
              {new Date(dateStr).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          );
        } catch {
          return <span className="text-xs text-slate-400">{String(dateStr)}</span>;
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
          <button
            type="button"
            onClick={() => onViewPriceList && onViewPriceList(row)}
            className="p-1.5 text-slate-400 hover:text-[#714B67] hover:bg-[#F7F2F5] rounded-lg transition-colors cursor-pointer"
            title="View Details & Price Items"
            aria-label={`View ${row.name}`}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onEditPriceList && onEditPriceList(row)}
            className="p-1.5 text-slate-400 hover:text-[#714B67] hover:bg-[#F7F2F5] rounded-lg transition-colors cursor-pointer"
            title="Edit Price List"
            aria-label={`Edit ${row.name}`}
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onToggleStatus && onToggleStatus(row)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              row.status === 'ACTIVE'
                ? 'text-emerald-600 hover:text-rose-600 hover:bg-rose-50'
                : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
            title={row.status === 'ACTIVE' ? 'Deactivate Price List' : 'Activate Price List'}
            aria-label={`${row.status === 'ACTIVE' ? 'Deactivate' : 'Activate'} ${row.name}`}
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={priceLists}
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

export default PriceListTable;
