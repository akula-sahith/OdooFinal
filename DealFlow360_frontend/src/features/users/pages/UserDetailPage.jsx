import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit3,
  Power,
  Shield,
  Mail,
  User as UserIcon,
  Building,
  Hash,
  Phone,
  Clock,
  Calendar,
} from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Card } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge/StatusBadge';
import { ConfirmationDialog } from '../../../components/dialogs/ConfirmationDialog/ConfirmationDialog';
import { useToast } from '../../../components/feedback/Toast';
import { usePermissions } from '../../../hooks/auth/usePermissions';
import { PERMISSIONS } from '../../permissions/types/permissionTypes';
import { useUser } from '../hooks/useUser';
import { UserPermissionSummary } from '../components/UserPermissionSummary';

export const UserDetailPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { hasPermission } = usePermissions();
  const { user, loading, error, updateStatus, saving } = useUser(userId);

  const canEdit = hasPermission(PERMISSIONS.USERS_UPDATE);
  const canManageStatus = hasPermission(PERMISSIONS.USERS_MANAGE_STATUS);

  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    isSubmitting: false,
  });

  const handleToggleStatusClick = () => {
    setStatusModal({ isOpen: true, isSubmitting: false });
  };

  const handleConfirmStatusToggle = async () => {
    if (!user) return;
    const targetStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    setStatusModal((prev) => ({ ...prev, isSubmitting: true }));
    const result = await updateStatus(targetStatus);
    if (result.success) {
      toast.success(
        `Staff account "${user.name || user.email}" ${
          targetStatus === 'ACTIVE' ? 'activated' : 'deactivated'
        } successfully.`
      );
      setStatusModal({ isOpen: false, isSubmitting: false });
    } else {
      toast.error(result.error || 'Failed to update user status.');
      setStatusModal({ isOpen: false, isSubmitting: false });
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-white border border-slate-200/80 rounded-xl text-center text-slate-500 text-sm max-w-5xl mx-auto">
        Loading staff profile details...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-6 text-left max-w-5xl mx-auto">
        <PageHeader
          title="Staff Profile Not Found"
          actions={
            <Button variant="outline" leftIcon={ArrowLeft} onClick={() => navigate('/company/users')}>
              Back to Staff Users
            </Button>
          }
        />
        <div className="p-8 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm">
          {error || 'The requested staff user record does not exist or has been removed.'}
        </div>
      </div>
    );
  }

  const isPrimaryAdmin = user.id === 'usr_admin_01';
  const targetStatusLabel = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      {/* Header */}
      <PageHeader
        title={user.name || `${user.firstName || ''} ${user.lastName || ''}`}
        description="Internal staff user identity, department details, role assignment, and active RBAC capabilities."
        actions={
          <div className="flex items-center gap-2.5">
            <Button variant="outline" leftIcon={ArrowLeft} onClick={() => navigate('/company/users')}>
              Back to List
            </Button>

            {canEdit && (
              <Button
                variant="outline"
                leftIcon={Edit3}
                onClick={() => navigate(`/company/users/${userId}/edit`)}
              >
                Edit Profile
              </Button>
            )}

            {canManageStatus && !isPrimaryAdmin && (
              <Button
                variant={user.status === 'ACTIVE' ? 'danger' : 'secondary'}
                leftIcon={Power}
                onClick={handleToggleStatusClick}
              >
                {user.status === 'ACTIVE' ? 'Deactivate Account' : 'Activate Account'}
              </Button>
            )}
          </div>
        }
      />

      {/* Main Profile Info Card */}
      <Card variant="default" padding="lg">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 border-b border-slate-100 pb-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 border border-purple-200 text-[#714B67] flex items-center justify-center font-bold text-xl uppercase shrink-0">
              {user.firstName ? user.firstName[0] : user.name ? user.name[0] : 'U'}
              {user.lastName ? user.lastName[0] : ''}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                <StatusBadge status={user.status} />
              </div>
              <p className="text-sm font-medium text-slate-500 flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4 text-slate-400" />
                {user.email}
              </p>
            </div>
          </div>

          <div className="px-4 py-2.5 rounded-xl bg-purple-50/80 border border-purple-200/80 flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-[#714B67]" />
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Role</div>
              <div className="text-sm font-bold text-[#714B67]">{user.roleName || 'Staff Member'}</div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70">
            <span className="text-slate-400 font-semibold block mb-1 flex items-center gap-1">
              <Building className="w-3.5 h-3.5" /> Department
            </span>
            <span className="font-bold text-slate-800">{user.department || 'Unassigned'}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70">
            <span className="text-slate-400 font-semibold block mb-1 flex items-center gap-1">
              <Hash className="w-3.5 h-3.5" /> Employee Code
            </span>
            <span className="font-bold text-slate-800 font-mono">{user.employeeCode || 'N/A'}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70">
            <span className="text-slate-400 font-semibold block mb-1 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> Contact Phone
            </span>
            <span className="font-bold text-slate-800">{user.phone || 'N/A'}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70">
            <span className="text-slate-400 font-semibold block mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Last Login
            </span>
            <span className="font-bold text-slate-800">
              {user.lastLoginAt
                ? new Date(user.lastLoginAt).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Never'}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Created:{' '}
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Last Updated:{' '}
            {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      </Card>

      {/* Effective Permissions Matrix */}
      <UserPermissionSummary
        roleName={user.roleName || 'Assigned Role'}
        effectivePermissions={user.effectivePermissions || []}
      />

      {/* Confirmation Modal */}
      <ConfirmationDialog
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ isOpen: false, isSubmitting: false })}
        onConfirm={handleConfirmStatusToggle}
        title={targetStatusLabel === 'ACTIVE' ? 'Activate Staff Account' : 'Deactivate Staff Account'}
        description={`Are you sure you want to ${targetStatusLabel === 'ACTIVE' ? 'activate' : 'deactivate'} staff account "${user.name || user.email}"?`}
        confirmLabel={targetStatusLabel === 'ACTIVE' ? 'Activate Account' : 'Deactivate Account'}
        confirmVariant={targetStatusLabel === 'ACTIVE' ? 'primary' : 'danger'}
        isLoading={statusModal.isSubmitting}
      />
    </div>
  );
};

export default UserDetailPage;
