import React from 'react';
import { Edit3, Trash2, Tag } from 'lucide-react';
import { DataTable } from '../../../components/tables/DataTable/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge/StatusBadge';
import { formatCurrency } from '../../../constants/currency';

/**
 * PriceListItemTable Component
 * Displays product base price entries assigned to a master Price List.
 */
export const PriceListItemTable = ({
  items = [],
  currency = 'USD',
  loading = false,
  error = null,
  onRetry,
  onEditPrice,
  onRemoveItem,
  emptyTitle = 'No products added to this price list',
  emptyDescription = 'Add products from the master catalogue to assign base pricing.',
  emptyAction,
}) => {
  const columns = [
    {
      key: 'product_name',
      label: 'Product Name',
      sortable: true,
      render: (_, row) => {
        const prod = row.product || row;
        return (
          <div className="py-0.5">
            <span className="font-bold text-slate-900 text-sm tracking-tight block">
              {prod.name || 'Unnamed Product'}
            </span>
            {prod.description && (
              <p className="text-xs text-slate-500 font-normal line-clamp-1 max-w-sm mt-0.5">
                {prod.description}
              </p>
            )}
          </div>
        );
      },
    },
    {
      key: 'sku',
      label: 'Product Code / SKU',
      sortable: true,
      render: (_, row) => {
        const sku = row.product?.sku || row.sku || 'N/A';
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100/90 border border-slate-200 text-slate-700 text-xs font-mono font-bold rounded-lg tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#714B67]/80 shrink-0" />
            {sku}
          </span>
        );
      },
    },
    {
      key: 'category',
      label: 'Category',
      sortable: false,
      render: (_, row) => {
        const catName = row.product?.category?.name || row.category?.name || 'Uncategorized';
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100/80 border border-slate-200/70 rounded-lg">
            <Tag className="w-3 h-3 text-[#714B67] shrink-0" />
            {catName}
          </span>
        );
      },
    },
    {
      key: 'base_price',
      label: 'Base Price',
      sortable: true,
      render: (val) => (
        <span className="font-extrabold text-slate-900 text-sm font-mono bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/70">
          {formatCurrency(val, currency)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => <StatusBadge status={val || 'ACTIVE'} size="sm" />,
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
            onClick={() => onEditPrice && onEditPrice(row)}
            className="p-1.5 text-slate-400 hover:text-[#714B67] hover:bg-[#F7F2F5] rounded-lg transition-colors cursor-pointer"
            title="Edit Base Price"
            aria-label={`Edit price for ${row.product?.name || row.name}`}
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onRemoveItem && onRemoveItem(row)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Remove Product from Price List"
            aria-label={`Remove ${row.product?.name || row.name}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={items}
      isLoading={loading}
      error={error ? (typeof error === 'string' ? { message: error } : error) : null}
      onRetry={onRetry}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      emptyAction={emptyAction}
    />
  );
};

export default PriceListItemTable;
