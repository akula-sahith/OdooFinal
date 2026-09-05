import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Card } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import { ConfirmationDialog } from '../../../components/dialogs/ConfirmationDialog/ConfirmationDialog';
import { useToast } from '../../../components/feedback/Toast';
import { RoleForm } from '../components/RoleForm';
import { useRole } from '../hooks/useRole';

export const RoleCreatePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { createRole } = useRole();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setServerErrors(null);

    const result = await createRole(formData);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(`Security role "${formData.name}" created successfully.`);
      navigate(`/company/roles/${result.data.id}`);
    } else {
      if (result.fieldErrors) {
        setServerErrors(result.fieldErrors);
      } else if (result.error) {
        setServerErrors(result.error);
      }
      toast.error(result.error || 'Failed to create security role.');
    }
  };

  const handleBackClick = () => {
    if (isFormDirty) {
      setShowDiscardModal(true);
    } else {
      navigate('/company/roles');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-left">
      <PageHeader
        title="Create Security Role"
        description="Define a new RBAC security role, access description, and capability permissions matrix."
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              leadingIcon={ArrowLeft}
              onClick={handleBackClick}
            >
              Back to Roles
            </Button>
          </div>
        }
      />

      <Card variant="default" padding="lg">
        <RoleForm
          onSubmit={handleSubmit}
          onCancel={handleBackClick}
          isSubmitting={isSubmitting}
          serverErrors={serverErrors}
          onDirtyChange={setIsFormDirty}
          submitLabel="Create Security Role"
        />
      </Card>

      <ConfirmationDialog
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={() => {
          setShowDiscardModal(false);
          navigate('/company/roles');
        }}
        title="Discard Unsaved Changes?"
        description="You have unsaved changes in this security role form. If you leave now, your permission matrix settings will be lost."
        confirmLabel="Discard & Leave"
        confirmVariant="danger"
      />
    </div>
  );
};

export default RoleCreatePage;
