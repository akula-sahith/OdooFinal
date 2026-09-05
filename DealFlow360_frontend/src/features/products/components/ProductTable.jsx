import React from 'react';
import { Eye, Edit3, Power, Tag } from 'lucide-react';
import { DataTable } from '../../../components/tables/DataTable/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge/StatusBadge';

/**
 * ProductTable Component
 * Refined, high-craft table rendering products list with precise alignment, custom SKU badges, and smooth action triggers.
 */
export const ProductTable = ({
  products = [],
  loading = false,
  error = null,
  onRetry,
  onViewProduct,
  onEditProduct,
  onToggleStatus,
  sortColumn = 'name',
  sortDirection = 'asc',
  onSort,
  emptyTitle = 'No products found',
  emptyDescription = 'No product records exist in the catalogue yet.',
  emptyAction,
}) => {
  const columns = [
    {
      key: 'name',
      label: 'Product',
      sortable: true,
      render: (val, row) => (
        <div className="py-0.5">
          <span
            onClick={(e) => {
              e.stopPropagation();
              onViewProduct && onViewProduct(row);
            }}
            className="font-bold text-slate-900 text-sm tracking-tight hover:text-[#714B67] transition-colors cursor-pointer block"
          >
            {row.name || 'Unnamed Product'}
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
      key: 'sku',
      label: 'Product Code / SKU',
      sortable: true,
      render: (val) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100/90 border border-slate-200 text-slate-700 text-xs font-mono font-bold rounded-lg tracking-wider select-all">
          <span className="w-1.5 h-1.5 rounded-full bg-[#714B67]/80 shrink-0" />
          {val || 'N/A'}
        </span>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      sortable: false,
      render: (val, row) => {
        const catName = row.category?.name || (typeof val === 'string' ? val : null) || 'Uncategorized';
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100/80 border border-slate-200/70 rounded-lg whitespace-nowrap">
            <Tag className="w-3 h-3 text-[#714B67] shrink-0" />
            {catName}
          </span>
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
            onClick={() => onViewProduct && onViewProduct(row)}
            className="p-1.5 text-slate-400 hover:text-[#714B67] hover:bg-[#F7F2F5] rounded-lg transition-colors cursor-pointer"
            title="View Details"
            aria-label={`View ${row.name}`}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onEditProduct && onEditProduct(row)}
            className="p-1.5 text-slate-400 hover:text-[#714B67] hover:bg-[#F7F2F5] rounded-lg transition-colors cursor-pointer"
            title="Edit Product"
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
            title={row.status === 'ACTIVE' ? 'Deactivate Product' : 'Activate Product'}
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
      data={products}
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

export default ProductTable;
