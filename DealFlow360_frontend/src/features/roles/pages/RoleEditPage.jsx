import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Card } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import { ConfirmationDialog } from '../../../components/dialogs/ConfirmationDialog/ConfirmationDialog';
import { TableSkeleton } from '../../../components/feedback/Skeleton/TableSkeleton';
import { ErrorState } from '../../../components/feedback/ErrorState/ErrorState';
import { useToast } from '../../../components/feedback/Toast';
import { RoleForm } from '../components/RoleForm';
import { useRole } from '../hooks/useRole';

export const RoleEditPage = () => {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const {
    role,
    isLoading,
    error,
    updateRole,
  } = useRole(roleId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setServerErrors(null);

    const result = await updateRole(formData);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(`Security role "${formData.name}" updated successfully.`);
      navigate(`/company/roles/${roleId}`);
    } else {
      if (result.fieldErrors) {
        setServerErrors(result.fieldErrors);
      } else if (result.error) {
        setServerErrors(result.error);
      }
      toast.error(result.error || 'Failed to update security role.');
    }
  };

  const handleBackClick = () => {
    if (isFormDirty) {
      setShowDiscardModal(true);
    } else {
      navigate(`/company/roles/${roleId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto text-left">
        <PageHeader title="Edit Security Role" description="Loading role data..." />
        <Card padding="lg">
          <TableSkeleton rows={4} columns={2} />
        </Card>
      </div>
    );
  }

  if (error || !role) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto text-left">
        <PageHeader title="Edit Security Role" description="Error loading role" />
        <Card padding="lg">
          <ErrorState
            title="Security Role Not Found"
            description={error || 'The specified security role could not be loaded.'}
            actionLabel="Back to Roles"
            onAction={() => navigate('/company/roles')}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-left">
      <PageHeader
        title={`Edit ${role.name}`}
        description={`Modify name, description, or capability matrix for role code ${role.code}.`}
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              leadingIcon={ArrowLeft}
              onClick={handleBackClick}
            >
              Back to Details
            </Button>
          </div>
        }
      />

      <Card variant="default" padding="lg">
        <RoleForm
          initialValues={role}
          onSubmit={handleSubmit}
          onCancel={handleBackClick}
          isSaving={isSubmitting}
          serverErrors={serverErrors}
          isEditMode
          onDirtyChange={setIsFormDirty}
          submitLabel="Save Role Changes"
        />
      </Card>

      <ConfirmationDialog
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={() => {
          setShowDiscardModal(false);
          navigate(`/company/roles/${roleId}`);
        }}
        title="Discard Unsaved Changes?"
        description="You have unsaved changes in this role form. If you leave now, your modified capability assignments will be lost."
        confirmLabel="Discard & Leave"
        confirmVariant="danger"
      />
    </div>
  );
};

export default RoleEditPage;
