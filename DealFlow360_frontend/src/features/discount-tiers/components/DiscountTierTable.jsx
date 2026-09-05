import React from 'react';
import { Eye, Edit3, Power, Percent, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { DataTable } from '../../../components/tables/DataTable/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge/StatusBadge';

/**
 * DiscountTierTable Component
 * Renders master discount tier governance configuration records.
 */
export const DiscountTierTable = ({
  discountTiers = [],
  loading = false,
  error = null,
  onRetry,
  onView,
  onEdit,
  onToggleStatus,
  sortColumn = 'priority',
  sortDirection = 'asc',
  onSort,
  emptyTitle = 'No discount tiers found',
  emptyDescription = 'No discount governance tiers have been configured yet.',
  emptyAction,
}) => {
  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (val, row) => (
        <div className="py-0.5">
          <span
            onClick={(e) => {
              e.stopPropagation();
              onView && onView(row.id || row);
            }}
            className="font-bold text-slate-900 text-sm tracking-tight hover:text-[#714B67] transition-colors cursor-pointer block"
          >
            {row.name || 'Unnamed Tier'}
          </span>
          {row.description && (
            <p className="text-xs text-slate-500 font-normal line-clamp-1 max-w-xs mt-0.5 leading-relaxed">
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
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100/90 border border-slate-200 text-slate-700 text-xs font-mono font-bold rounded-lg tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#714B67]/80 shrink-0" />
          {val || 'N/A'}
        </span>
      ),
    },
    {
      key: 'discount_range',
      label: 'Discount Range',
      sortable: false,
      render: (_, row) => {
        const min = row.minimumDiscount !== undefined ? row.minimumDiscount : row.minimum_discount ?? 0;
        const max = row.maximumDiscount !== undefined ? row.maximumDiscount : row.maximum_discount ?? 0;
        return (
          <span className="inline-flex items-center gap-1 font-extrabold text-slate-900 text-xs font-mono bg-purple-50/70 border border-purple-200/80 px-2.5 py-1 rounded-lg text-[#714B67]">
            <Percent className="w-3 h-3 text-[#714B67] shrink-0" />
            {min}% – {max}%
          </span>
        );
      },
    },
    {
      key: 'approval_level',
      label: 'Approval Level',
      sortable: true,
      render: (_, row) => {
        const lvl = row.approvalLevel !== undefined ? row.approvalLevel : row.approval_level ?? 0;
        const isSelf = lvl === 0;
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
              isSelf
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                : 'bg-amber-50 text-amber-800 border border-amber-200/80'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            Level {lvl} {isSelf ? '(Auto)' : ''}
          </span>
        );
      },
    },
    {
      key: 'approval_role',
      label: 'Approval Role',
      sortable: true,
      render: (_, row) => {
        const role = row.approvalRole || row.approval_role || 'Salesperson';
        return <span className="text-xs font-medium text-slate-700">{role}</span>;
      },
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (val) => (
        <span className="inline-flex items-center justify-center w-6 h-6 bg-slate-100 border border-slate-200 rounded-full text-xs font-bold text-slate-800 font-mono">
          #{val ?? 1}
        </span>
      ),
    },
    {
      key: 'effective_period',
      label: 'Effective Period',
      sortable: false,
      render: (_, row) => {
        const fromStr = row.effectiveFrom || row.effective_from;
        const toStr = row.effectiveTo || row.effective_to;
        if (!fromStr && !toStr) {
          return <span className="text-xs text-slate-400 font-medium">Indefinite</span>;
        }
        const fDate = fromStr ? new Date(fromStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Indefinite';
        const tDate = toStr ? new Date(toStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Open';

        return (
          <span className="text-xs text-slate-600 font-medium whitespace-nowrap">
            {fDate} → {tDate}
          </span>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => <StatusBadge status={val || 'ACTIVE'} size="sm" />,
    },
    {
      key: 'updated_at',
      label: 'Updated',
      sortable: true,
      render: (val, row) => {
        const dateStr = val || row.updatedAt || row.created_at;
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
          {onView && (
            <button
              type="button"
              onClick={() => onView(row.id || row)}
              className="p-1.5 text-slate-400 hover:text-[#714B67] hover:bg-[#F7F2F5] rounded-lg transition-colors cursor-pointer"
              title="View Details"
              aria-label={`View ${row.name}`}
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(row.id || row)}
              className="p-1.5 text-slate-400 hover:text-[#714B67] hover:bg-[#F7F2F5] rounded-lg transition-colors cursor-pointer"
              title="Edit Discount Tier"
              aria-label={`Edit ${row.name}`}
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
          {onToggleStatus && (
            <button
              type="button"
              onClick={() => onToggleStatus(row)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                row.status === 'ACTIVE'
                  ? 'text-emerald-600 hover:text-rose-600 hover:bg-rose-50'
                  : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
              title={row.status === 'ACTIVE' ? 'Deactivate Tier' : 'Activate Tier'}
              aria-label={`${row.status === 'ACTIVE' ? 'Deactivate' : 'Activate'} ${row.name}`}
            >
              <Power className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={discountTiers}
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

export default DiscountTierTable;
