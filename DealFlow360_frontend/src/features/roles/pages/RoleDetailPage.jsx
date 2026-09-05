import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Shield, Users, Info } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Card } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge/StatusBadge';
import { ConfirmationDialog } from '../../../components/dialogs/ConfirmationDialog/ConfirmationDialog';
import { TableSkeleton } from '../../../components/feedback/Skeleton/TableSkeleton';
import { ErrorState } from '../../../components/feedback/ErrorState/ErrorState';
import { useToast } from '../../../components/feedback/Toast';
import { usePermissions } from '../../../hooks/auth/usePermissions';
import { useRole } from '../hooks/useRole';
import { RolePermissionSummary } from '../components/RolePermissionSummary';

export const RoleDetailPage = () => {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { hasPermission } = usePermissions();

  const canUpdate = hasPermission('roles.update');

  const {
    role,
    isLoading,
    error,
    refetch,
    toggleStatus,
  } = useRole(roleId);

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleToggleStatus = async () => {
    setIsUpdatingStatus(true);
    const result = await toggleStatus();
    setIsUpdatingStatus(false);

    if (result.success) {
      toast.success(`Role "${role.name}" set to ${result.newStatus}.`);
      setStatusModalOpen(false);
      refetch();
    } else {
      toast.error(result.error || 'Failed to update status.');
    }
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto text-left">
        <PageHeader title="Role Specifications" description="Loading security role details..." />
        <Card padding="lg">
          <TableSkeleton rows={4} columns={2} />
        </Card>
      </div>
    );
  }

  if (error || !role) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto text-left">
        <PageHeader title="Role Specifications" description="Error loading role" />
        <Card padding="lg">
          <ErrorState
            title="Security Role Not Found"
            description={error || 'The specified security role specification could not be loaded.'}
            actionLabel="Back to Roles"
            onAction={() => navigate('/company/roles')}
          />
        </Card>
      </div>
    );
  }

  const permissionsList = Array.isArray(role.permissions) ? role.permissions : [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-left">
      {/* Header */}
      <PageHeader
        title={role.name}
        description={`Code: ${role.code} | User Assignments: ${role.userCount || role.user_count || 0}`}
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              variant="outline"
              leadingIcon={ArrowLeft}
              onClick={() => navigate('/company/roles')}
            >
              Back
            </Button>

            {canUpdate && !role.isSystem && (
              <Button
                variant={role.status === 'ACTIVE' ? 'outline' : 'secondary'}
                onClick={() => setStatusModalOpen(true)}
              >
                {role.status === 'ACTIVE' ? 'Deactivate Role' : 'Activate Role'}
              </Button>
            )}

            {canUpdate && (
              <Button
                variant="primary"
                leadingIcon={Edit}
                onClick={() => navigate(`/company/roles/${roleId}/edit`)}
              >
                Edit Role & Permissions
              </Button>
            )}
          </div>
        }
      />

      {/* Main Metadata Overview Card */}
      <Card variant="default" padding="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Status & Identification */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Status & Code
            </span>
            <div className="flex items-center gap-2">
              <StatusBadge status={role.status} />
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {role.code}
              </span>
            </div>
          </div>

          {/* User Count */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Assigned Personnel
            </span>
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Users className="w-4 h-4 text-[#714B67]" />
              <span>{role.userCount || role.user_count || 0} Staff Members</span>
            </div>
          </div>

          {/* Creation Date */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Created Date
            </span>
            <div className="text-xs font-medium text-slate-700">
              {formatDateDisplay(role.createdAt || role.created_at)}
            </div>
          </div>

          {/* Last Updated */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Last Updated
            </span>
            <div className="text-xs font-medium text-slate-700">
              {formatDateDisplay(role.updatedAt || role.updated_at)}
            </div>
          </div>
        </div>

        {/* Description */}
        {role.description && (
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-start gap-2.5 text-slate-600 text-sm">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800 block text-xs uppercase tracking-wider mb-0.5">
                Role Description & Access Boundaries
              </span>
              <p className="leading-relaxed">{role.description}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Permissions Breakdown Summary */}
      <Card variant="default" padding="lg">
        <RolePermissionSummary permissions={permissionsList} showUnassigned={false} />
      </Card>

      {/* Confirmation Modal */}
      <ConfirmationDialog
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        onConfirm={handleToggleStatus}
        title={role.status === 'ACTIVE' ? 'Deactivate Security Role' : 'Activate Security Role'}
        description={`Are you sure you want to ${role.status === 'ACTIVE' ? 'deactivate' : 'activate'} role "${role.name}"?`}
        confirmLabel={role.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
        confirmVariant={role.status === 'ACTIVE' ? 'danger' : 'primary'}
        isLoading={isUpdatingStatus}
      />
    </div>
  );
};

export default RoleDetailPage;
