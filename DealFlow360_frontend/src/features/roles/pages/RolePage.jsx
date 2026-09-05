import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Shield, RotateCcw } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Card } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import { SearchInput } from '../../../components/ui/SearchInput/SearchInput';
import { Select } from '../../../components/ui/Select/Select';
import { Pagination } from '../../../components/tables/Pagination/Pagination';
import { ConfirmationDialog } from '../../../components/dialogs/ConfirmationDialog/ConfirmationDialog';
import { useToast } from '../../../components/feedback/Toast';
import { usePermissions } from '../../../hooks/auth/usePermissions';
import { useRoles } from '../hooks/useRoles';
import { RoleTable } from '../components/RoleTable';
import { roleService } from '../services/roleService';

export const RolePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { hasPermission } = usePermissions();

  const canCreate = hasPermission('roles.create');
  const canUpdate = hasPermission('roles.update');

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [statusModalState, setStatusModalState] = useState({
    isOpen: false,
    role: null,
    targetStatus: '',
    isSubmitting: false,
  });

  const {
    roles,
    total,
    totalPages,
    isLoading,
    error,
    refetch,
  } = useRoles({
    search,
    status,
    page,
    pageSize,
  });

  const handleToggleStatusClick = (roleRecord) => {
    const targetStatus = roleRecord.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setStatusModalState({
      isOpen: true,
      role: roleRecord,
      targetStatus,
      isSubmitting: false,
    });
  };

  const handleConfirmStatusToggle = async () => {
    const { role: roleRecord, targetStatus } = statusModalState;
    if (!roleRecord) return;

    setStatusModalState((prev) => ({ ...prev, isSubmitting: true }));
    try {
      await roleService.updateRoleStatus(roleRecord.id, targetStatus);
      toast.success(`Role "${roleRecord.name}" ${targetStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully.`);
      setStatusModalState({ isOpen: false, role: null, targetStatus: '', isSubmitting: false });
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to update role status.');
      setStatusModalState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const statusOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'ACTIVE', label: 'Active Roles' },
    { value: 'INACTIVE', label: 'Inactive Roles' },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <PageHeader
        title="Roles & Access Control"
        description="Configure role-based access control (RBAC) security roles and capability matrices."
        actions={
          canCreate ? (
            <div className="flex items-center gap-2.5">
              <Button
                variant="primary"
                leadingIcon={Plus}
                onClick={() => navigate('/company/roles/new')}
              >
                Create Security Role
              </Button>
            </div>
          ) : null
        }
      />

      {/* Main Table Card */}
      <Card variant="default" padding="none" className="overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="w-full sm:w-80 shrink-0">
            <SearchInput
              value={search}
              onSearch={(val) => {
                setSearch(val);
                setPage(1);
              }}
              placeholder="Search role name or code..."
            />
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-40 shrink-0">
              <Select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                options={statusOptions}
              />
            </div>

            {(search || status !== 'ALL') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setStatus('ALL');
                  setPage(1);
                }}
                className="text-slate-500 hover:text-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>

        <RoleTable
          roles={roles}
          loading={isLoading}
          error={error}
          onRetry={refetch}
          onView={(id) => navigate(`/company/roles/${id}`)}
          onEdit={canUpdate ? (id) => navigate(`/company/roles/${id}/edit`) : undefined}
          onToggleStatus={canUpdate ? handleToggleStatusClick : undefined}
        />

        {!isLoading && !error && total > 0 && (
          <div className="px-6 py-4 border-t border-slate-200/80 bg-slate-50/30">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={total}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPage(1);
              }}
            />
          </div>
        )}
      </Card>

      {/* Confirmation Modal */}
      <ConfirmationDialog
        isOpen={statusModalState.isOpen}
        onClose={() => setStatusModalState({ isOpen: false, role: null, targetStatus: '', isSubmitting: false })}
        onConfirm={handleConfirmStatusToggle}
        title={statusModalState.targetStatus === 'ACTIVE' ? 'Activate Security Role' : 'Deactivate Security Role'}
        description={`Are you sure you want to ${statusModalState.targetStatus === 'ACTIVE' ? 'activate' : 'deactivate'} role "${statusModalState.role?.name}"? Assigned users will inherit updated permissions upon their next session.`}
        confirmLabel={statusModalState.targetStatus === 'ACTIVE' ? 'Activate Role' : 'Deactivate Role'}
        confirmVariant={statusModalState.targetStatus === 'ACTIVE' ? 'primary' : 'danger'}
        isLoading={statusModalState.isSubmitting}
      />
    </div>
  );
};

export default RolePage;
