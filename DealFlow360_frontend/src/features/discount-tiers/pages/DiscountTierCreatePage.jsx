import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Card } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import { ConfirmationDialog } from '../../../components/dialogs/ConfirmationDialog/ConfirmationDialog';
import { useToast } from '../../../components/feedback/Toast';
import { DiscountTierForm } from '../components/DiscountTierForm';
import { useDiscountTier } from '../hooks/useDiscountTier';

export const DiscountTierCreatePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { createDiscountTier } = useDiscountTier();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setServerErrors(null);

    const result = await createDiscountTier(formData);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(`Discount tier "${formData.name}" created successfully.`);
      navigate(`/company/discount-tiers/${result.data.id}`);
    } else {
      if (result.fieldErrors) {
        setServerErrors(result.fieldErrors);
      } else if (result.error) {
        setServerErrors(result.error);
      }
      toast.error(result.error || 'Failed to create discount tier.');
    }
  };

  const handleBackClick = () => {
    if (isFormDirty) {
      setShowDiscardModal(true);
    } else {
      navigate('/company/discount-tiers');
    }
  };

  const handleConfirmDiscard = () => {
    setShowDiscardModal(false);
    navigate('/company/discount-tiers');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Create Discount Tier"
        description="Define a new discount threshold rule, permitted percentage bounds, and required approval role."
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              leadingIcon={ArrowLeft}
              onClick={handleBackClick}
            >
              Back to Discount Tiers
            </Button>
          </div>
        }
      />

      {/* Main Form Card */}
      <Card variant="default" padding="lg">
        <DiscountTierForm
          onSubmit={handleSubmit}
          onCancel={handleBackClick}
          isSubmitting={isSubmitting}
          serverErrors={serverErrors}
          onDirtyChange={setIsFormDirty}
          submitLabel="Create Discount Tier"
        />
      </Card>

      {/* Discard Unsaved Changes Dialog */}
      <ConfirmationDialog
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={handleConfirmDiscard}
        title="Discard Unsaved Changes?"
        description="You have unsaved changes in this discount tier configuration form. If you leave now, all entered rule settings will be lost."
        confirmLabel="Discard & Leave"
        confirmVariant="danger"
      />
    </div>
  );
};

export default DiscountTierCreatePage;
