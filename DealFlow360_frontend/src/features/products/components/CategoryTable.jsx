import React from 'react';
import { Edit3, Power, Tag } from 'lucide-react';
import { DataTable } from '../../../components/tables/DataTable/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge/StatusBadge';

/**
 * CategoryTable Component
 * Refined category list table rendering category names, descriptions, status, and smooth action buttons.
 */
export const CategoryTable = ({
  categories = [],
  loading = false,
  error = null,
  onRetry,
  onEditCategory,
  onToggleStatus,
  emptyTitle = 'No categories configured yet',
  emptyDescription = 'Create product categories to organize your catalogue.',
  emptyAction,
}) => {
  const columns = [
    {
      key: 'name',
      label: 'Category Name',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-2 py-0.5">
          <Tag className="w-4 h-4 text-[#714B67] shrink-0" />
          <span className="font-bold text-slate-900 text-sm tracking-tight">{row.name || 'Unnamed Category'}</span>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      sortable: false,
      render: (val) => (
        <span className="text-slate-600 text-xs line-clamp-1 max-w-sm font-normal">
          {val || <span className="text-slate-400 italic">No description</span>}
        </span>
      ),
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
            onClick={() => onEditCategory && onEditCategory(row)}
            className="p-1.5 text-slate-400 hover:text-[#714B67] hover:bg-[#F7F2F5] rounded-lg transition-colors cursor-pointer"
            title="Edit Category"
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
            title={row.status === 'ACTIVE' ? 'Deactivate Category' : 'Activate Category'}
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
      data={categories}
      isLoading={loading}
      error={error ? (typeof error === 'string' ? { message: error } : error) : null}
      onRetry={onRetry}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      emptyAction={emptyAction}
    />
  );
};

export default CategoryTable;
