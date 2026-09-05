import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, RotateCcw } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Card } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import { Pagination } from '../../../components/tables/Pagination/Pagination';
import { ConfirmationDialog } from '../../../components/dialogs/ConfirmationDialog/ConfirmationDialog';
import { useToast } from '../../../components/feedback/Toast';
import { usePermissions } from '../../../hooks/auth/usePermissions';
import { PERMISSIONS } from '../../permissions/types/permissionTypes';
import { useUsers } from '../hooks/useUsers';
import { UserTable } from '../components/UserTable';
import { UserFilters } from '../components/UserFilters';
import { roleService } from '../../roles/services/roleService';
import { userService } from '../services/userService';

export const UserPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { hasPermission } = usePermissions();

  const canCreate = hasPermission(PERMISSIONS.USERS_CREATE);
  const canUpdate = hasPermission(PERMISSIONS.USERS_UPDATE);
  const canManageStatus = hasPermission(PERMISSIONS.USERS_MANAGE_STATUS);

  const [roles, setRoles] = useState([]);
  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    user: null,
    targetStatus: '',
    isSubmitting: false,
  });

  const {
    users,
    loading,
    error,
    meta,
    search,
    roleIdFilter,
    statusFilter,
    page,
    pageSize,
    setSearch,
    setRoleIdFilter,
    setStatusFilter,
    setPage,
    setPageSize,
    refetch,
  } = useUsers();

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const response = await roleService.getRoles({ pageSize: 100 });
        setRoles(response.data || []);
      } catch (err) {
        console.warn('[UserPage] Failed to fetch security roles list for filtering.');
      }
    };
    loadRoles();
  }, []);

  const handleToggleStatusClick = (userRecord) => {
    const targetStatus = userRecord.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setStatusModal({
      isOpen: true,
      user: userRecord,
      targetStatus,
      isSubmitting: false,
    });
  };

  const handleConfirmStatusToggle = async () => {
    const { user: userRecord, targetStatus } = statusModal;
    if (!userRecord) return;

    setStatusModal((prev) => ({ ...prev, isSubmitting: true }));
    try {
      await userService.updateUserStatus(userRecord.id, targetStatus);
      toast.success(
        `Staff account "${userRecord.name || userRecord.email}" ${
          targetStatus === 'ACTIVE' ? 'activated' : 'deactivated'
        } successfully.`
      );
      setStatusModal({ isOpen: false, user: null, targetStatus: '', isSubmitting: false });
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to update staff user account status.');
      setStatusModal((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setRoleIdFilter('ALL');
    setStatusFilter('ALL');
    setPage(1);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <PageHeader
        title="Staff User Management"
        description="Manage company staff accounts, role identity assignments, and access governance status."
        actions={
          canCreate ? (
            <Button
              variant="primary"
              leftIcon={UserPlus}
              onClick={() => navigate('/company/users/new')}
              className="bg-[#714B67] hover:bg-[#5a3b52] text-white"
            >
              Provision Staff Account
            </Button>
          ) : null
        }
      />

      {/* Filter Controls */}
      <UserFilters
        search={search}
        onSearchChange={setSearch}
        roleIdFilter={roleIdFilter}
        onRoleFilterChange={setRoleIdFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        roles={roles}
        onReset={handleResetFilters}
      />

      {/* Main Table Card */}
      <Card variant="default" padding="none" className="overflow-hidden">
        <UserTable
          users={users}
          loading={loading}
          error={error}
          onRetry={refetch}
          onView={(id) => navigate(`/company/users/${id}`)}
          onEdit={canUpdate ? (id) => navigate(`/company/users/${id}/edit`) : undefined}
          onToggleStatus={canManageStatus ? handleToggleStatusClick : undefined}
        />

        {!loading && !error && meta.total > 0 && (
          <div className="px-6 py-4 border-t border-slate-200/80 bg-slate-50/30">
            <Pagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
              totalItems={meta.total}
              pageSize={meta.limit}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        )}
      </Card>

      {/* Deactivation / Activation Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ isOpen: false, user: null, targetStatus: '', isSubmitting: false })}
        onConfirm={handleConfirmStatusToggle}
        title={statusModal.targetStatus === 'ACTIVE' ? 'Activate Staff User Account' : 'Deactivate Staff User Account'}
        description={`Are you sure you want to ${statusModal.targetStatus === 'ACTIVE' ? 'activate' : 'deactivate'} staff user "${statusModal.user?.name || statusModal.user?.email}"? ${
          statusModal.targetStatus === 'INACTIVE'
            ? 'Deactivating an account blocks access to DealFlow360 without removing historical activity, quotations, or audit logs.'
            : 'Activating this account restores access capabilities based on their assigned security role.'
        }`}
        confirmLabel={statusModal.targetStatus === 'ACTIVE' ? 'Activate User' : 'Deactivate User'}
        confirmVariant={statusModal.targetStatus === 'ACTIVE' ? 'primary' : 'danger'}
        isLoading={statusModal.isSubmitting}
      />
    </div>
  );
};

export default UserPage;
