import React from 'react';
import { Eye, Edit3, Power, Shield, Users } from 'lucide-react';
import { DataTable } from '../../../components/tables/DataTable/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge/StatusBadge';

/**
 * RoleTable Component
 * Renders security roles, user counts, capability summaries, and action controls.
 */
export const RoleTable = ({
  roles = [],
  loading = false,
  error = null,
  onRetry,
  onView,
  onEdit,
  onToggleStatus,
  sortColumn = 'name',
  sortDirection = 'asc',
  onSort,
  emptyTitle = 'No security roles found',
  emptyDescription = 'No RBAC security roles have been created in the system yet.',
  emptyAction,
}) => {
  const columns = [
    {
      key: 'name',
      label: 'Role Name',
      sortable: true,
      render: (val, row) => (
        <div className="py-0.5">
          <div className="flex items-center gap-2">
            <span
              onClick={(e) => {
                e.stopPropagation();
                onView && onView(row.id || row);
              }}
              className="font-bold text-slate-900 text-sm tracking-tight hover:text-[#714B67] transition-colors cursor-pointer block"
            >
              {row.name || 'Unnamed Role'}
            </span>
            {row.isSystem && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-[#714B67] border border-purple-200">
                System Core
              </span>
            )}
          </div>
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
          <Shield className="w-3 h-3 text-[#714B67] shrink-0" />
          {val || 'N/A'}
        </span>
      ),
    },
    {
      key: 'userCount',
      label: 'Assigned Users',
      sortable: true,
      render: (val, row) => {
        const count = val !== undefined ? val : row.user_count ?? 0;
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {count} {count === 1 ? 'User' : 'Users'}
          </span>
        );
      },
    },
    {
      key: 'permissions_count',
      label: 'Capabilities',
      sortable: false,
      render: (_, row) => {
        const count = row.permissions ? row.permissions.length : 0;
        return (
          <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[#714B67] bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
            {count} Capabilities
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
      key: 'updatedAt',
      label: 'Updated',
      sortable: true,
      render: (val, row) => {
        const dateStr = val || row.updated_at || row.createdAt || row.created_at;
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
              title="View Role Details & Permissions"
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
              title="Edit Role & Permissions"
              aria-label={`Edit ${row.name}`}
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
          {onToggleStatus && !row.isSystem && (
            <button
              type="button"
              onClick={() => onToggleStatus(row)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                row.status === 'ACTIVE'
                  ? 'text-emerald-600 hover:text-rose-600 hover:bg-rose-50'
                  : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
              title={row.status === 'ACTIVE' ? 'Deactivate Role' : 'Activate Role'}
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
      data={roles}
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

export default RoleTable;
