import React from 'react';
import { Eye, Edit3, Power, Mail, Shield, User as UserIcon } from 'lucide-react';
import { DataTable } from '../../../components/tables/DataTable/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge/StatusBadge';
import { usePermissions } from '../../../hooks/auth/usePermissions';
import { PERMISSIONS } from '../../permissions/types/permissionTypes';

/**
 * UserTable Component
 * Renders staff user accounts, role identities, status badges, and permission-guarded actions.
 */
export const UserTable = ({
  users = [],
  loading = false,
  error = null,
  onRetry,
  onView,
  onEdit,
  onToggleStatus,
  sortColumn = 'name',
  sortDirection = 'asc',
  onSort,
  emptyTitle = 'No staff users found',
  emptyDescription = 'No staff user accounts match your search or filter criteria.',
  emptyAction,
}) => {
  const { hasPermission } = usePermissions();

  const canEditUsers = hasPermission(PERMISSIONS.USERS_UPDATE);
  const canManageStatus = hasPermission(PERMISSIONS.USERS_MANAGE_STATUS);

  const columns = [
    {
      key: 'name',
      label: 'Staff Member',
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
              {row.name || `${row.firstName || ''} ${row.lastName || ''}`}
            </span>
            {row.employeeCode && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 font-mono">
                {row.employeeCode}
              </span>
            )}
          </div>
          {row.department && (
            <p className="text-xs text-slate-500 font-normal line-clamp-1 max-w-xs mt-0.5">
              {row.department}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (val) => (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {val || 'N/A'}
        </span>
      ),
    },
    {
      key: 'roleName',
      label: 'Role Identity',
      sortable: true,
      render: (val, row) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 border border-purple-200 text-[#714B67] text-xs font-semibold rounded-lg">
          <Shield className="w-3 h-3 text-[#714B67] shrink-0" />
          {val || row.role_name || 'Staff User'}
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
      key: 'lastLoginAt',
      label: 'Last Login',
      sortable: true,
      render: (val) => {
        if (!val) return <span className="text-slate-400 text-xs italic">Never</span>;
        try {
          return (
            <span className="text-xs text-slate-600 font-medium whitespace-nowrap">
              {new Date(val).toLocaleString(undefined, {
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
      key: 'createdAt',
      label: 'Created',
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
      key: 'updatedAt',
      label: 'Updated',
      sortable: true,
      render: (val, row) => {
        const dateStr = val || row.updated_at || row.createdAt;
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
              title="View User Details & Effective Permissions"
              aria-label={`View ${row.name}`}
            >
              <Eye className="w-4 h-4" />
            </button>
          )}

          {canEditUsers && onEdit && (
            <button
              type="button"
              onClick={() => onEdit(row.id || row)}
              className="p-1.5 text-slate-400 hover:text-[#714B67] hover:bg-[#F7F2F5] rounded-lg transition-colors cursor-pointer"
              title="Edit Staff Account Profile"
              aria-label={`Edit ${row.name}`}
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}

          {canManageStatus && onToggleStatus && row.id !== 'usr_admin_01' && (
            <button
              type="button"
              onClick={() => onToggleStatus(row)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                row.status === 'ACTIVE'
                  ? 'text-emerald-600 hover:text-rose-600 hover:bg-rose-50'
                  : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
              title={row.status === 'ACTIVE' ? 'Deactivate User Account' : 'Activate User Account'}
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
      data={users}
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

export default UserTable;
