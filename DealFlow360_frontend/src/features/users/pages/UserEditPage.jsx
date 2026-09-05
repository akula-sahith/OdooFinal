import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Button } from '../../../components/ui/Button/Button';
import { ConfirmationDialog } from '../../../components/dialogs/ConfirmationDialog/ConfirmationDialog';
import { useToast } from '../../../components/feedback/Toast';
import { UserForm } from '../components/UserForm';
import { useUser } from '../hooks/useUser';
import { roleService } from '../../roles/services/roleService';

export const UserEditPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, loading, error, updateUser, saving } = useUser(userId);

  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoadingRoles(true);
      try {
        const response = await roleService.getRoles({ pageSize: 100 });
        setRoles(response.data || []);
      } catch (err) {
        toast.error('Failed to load security roles.');
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, [toast]);

  const handleBackClick = () => {
    if (isDirty) {
      setShowDiscardModal(true);
    } else {
      navigate('/company/users');
    }
  };

  const handleSubmit = async (formData) => {
    const result = await updateUser(formData);
    if (result.success) {
      toast.success(`Staff user "${result.data.name || result.data.email}" updated successfully.`);
      setIsDirty(false);
      navigate(`/company/users/${userId}`);
    } else {
      toast.error(result.error || 'Failed to update staff user account.');
    }
  };

  if (loading || loadingRoles) {
    return (
      <div className="p-8 bg-white border border-slate-200/80 rounded-xl text-center text-slate-500 text-sm max-w-4xl mx-auto">
        Loading staff profile details...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-6 text-left max-w-4xl mx-auto">
        <PageHeader
          title="Staff User Not Found"
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

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Header */}
      <PageHeader
        title={`Edit Profile: ${user.name || user.email}`}
        description="Update staff profile details, role identity assignment, or access governance status."
        actions={
          <Button variant="outline" leftIcon={ArrowLeft} onClick={handleBackClick}>
            Back to Staff Users
          </Button>
        }
      />

      {/* Form */}
      <UserForm
        initialValues={user}
        roles={roles}
        onSubmit={handleSubmit}
        isSubmitting={saving}
        isEdit={true}
        onCancel={handleBackClick}
        onDirtyChange={setIsDirty}
      />

      {/* Discard Changes Dialog */}
      <ConfirmationDialog
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={() => {
          setShowDiscardModal(false);
          navigate('/company/users');
        }}
        title="Discard Unsaved Changes?"
        description="You have unsaved changes to this staff profile. If you leave now, your updates will be lost."
        confirmLabel="Discard Changes"
        confirmVariant="danger"
      />
    </div>
  );
};

export default UserEditPage;
