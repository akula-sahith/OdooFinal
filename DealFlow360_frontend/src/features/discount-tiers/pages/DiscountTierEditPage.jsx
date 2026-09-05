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
import { DiscountTierForm } from '../components/DiscountTierForm';
import { useDiscountTier } from '../hooks/useDiscountTier';

export const DiscountTierEditPage = () => {
  const { discountTierId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const {
    discountTier,
    isLoading,
    error,
    updateDiscountTier,
  } = useDiscountTier(discountTierId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setServerErrors(null);

    const result = await updateDiscountTier(formData);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(`Discount tier "${formData.name}" updated successfully.`);
      navigate(`/company/discount-tiers/${discountTierId}`);
    } else {
      if (result.fieldErrors) {
        setServerErrors(result.fieldErrors);
      } else if (result.error) {
        setServerErrors(result.error);
      }
      toast.error(result.error || 'Failed to update discount tier.');
    }
  };

  const handleBackClick = () => {
    if (isFormDirty) {
      setShowDiscardModal(true);
    } else {
      navigate(`/company/discount-tiers/${discountTierId}`);
    }
  };

  const handleConfirmDiscard = () => {
    setShowDiscardModal(false);
    navigate(`/company/discount-tiers/${discountTierId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <PageHeader title="Edit Discount Tier" description="Loading tier configuration..." />
        <Card padding="lg">
          <TableSkeleton rows={4} columns={2} />
        </Card>
      </div>
    );
  }

  if (error || !discountTier) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <PageHeader title="Edit Discount Tier" description="Error loading tier" />
        <Card padding="lg">
          <ErrorState
            title="Discount Tier Not Found"
            description={error || 'The specified discount tier rule could not be loaded.'}
            actionLabel="Back to Discount Tiers"
            onAction={() => navigate('/company/discount-tiers')}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title={`Edit ${discountTier.name}`}
        description={`Modify governance thresholds, approval level, or active dates for code ${discountTier.code}.`}
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

      {/* Main Form Card */}
      <Card variant="default" padding="lg">
        <DiscountTierForm
          initialValues={discountTier}
          onSubmit={handleSubmit}
          onCancel={handleBackClick}
          isSaving={isSubmitting}
          serverErrors={serverErrors}
          isEditMode
          onDirtyChange={setIsFormDirty}
          submitLabel="Save Rule Changes"
        />
      </Card>

      {/* Discard Unsaved Changes Dialog */}
      <ConfirmationDialog
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={handleConfirmDiscard}
        title="Discard Unsaved Changes?"
        description="You have unsaved changes in this discount tier form. If you leave now, your modified governance settings will be lost."
        confirmLabel="Discard & Leave"
        confirmVariant="danger"
      />
    </div>
  );
};

export default DiscountTierEditPage;
