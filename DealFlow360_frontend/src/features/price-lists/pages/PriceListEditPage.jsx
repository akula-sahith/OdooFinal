import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Card } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import { ConfirmationDialog } from '../../../components/dialogs/ConfirmationDialog/ConfirmationDialog';
import { useToast } from '../../../components/feedback/Toast';
import { PriceListForm } from '../components/PriceListForm';
import { usePriceList } from '../hooks/usePriceList';
import { TableSkeleton } from '../../../components/feedback/Skeleton/TableSkeleton';
import { ErrorState } from '../../../components/feedback/ErrorState/ErrorState';

export const PriceListEditPage = () => {
  const { priceListId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { priceList, isLoading, error, refetch, updatePriceList } = usePriceList(priceListId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setServerErrors({});

    const result = await updatePriceList(formData);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(`Price list "${formData.name}" updated successfully.`);
      navigate(`/company/price-lists/${priceListId}`);
    } else {
      if (result.fieldErrors) {
        setServerErrors(result.fieldErrors);
      }
      toast.error(result.error || 'Failed to update price list.');
    }
  };

  const handleBackClick = () => {
    if (isFormDirty) {
      setShowDiscardModal(true);
    } else {
      navigate(`/company/price-lists/${priceListId}`);
    }
  };

  const handleConfirmDiscard = () => {
    setShowDiscardModal(false);
    navigate(`/company/price-lists/${priceListId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <PageHeader title="Edit Price List" description="Loading price list details..." />
        <Card variant="default" padding="lg">
          <TableSkeleton rows={6} columns={2} />
        </Card>
      </div>
    );
  }

  if (error || !priceList) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <PageHeader title="Edit Price List" description="Error loading price list" />
        <Card variant="default" padding="lg">
          <ErrorState
            title="Failed to load Price List"
            description={error || 'The requested price list could not be found.'}
            actionLabel="Try Again"
            onAction={refetch}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title={`Edit: ${priceList.name}`}
        description={`Update configuration, effective dates, or currency for price list code [${priceList.code}].`}
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

      {/* Main Card */}
      <Card variant="default" padding="lg">
        <PriceListForm
          initialValues={priceList}
          onSubmit={handleSubmit}
          onCancel={handleBackClick}
          isSubmitting={isSubmitting}
          serverErrors={serverErrors}
          onDirtyChange={setIsFormDirty}
          submitLabel="Save Changes"
        />
      </Card>

      {/* Discard Unsaved Changes Dialog */}
      <ConfirmationDialog
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={handleConfirmDiscard}
        title="Discard Unsaved Changes?"
        description="You have modified price list properties. Leaving will revert all unsaved edits."
        confirmLabel="Discard & Leave"
        confirmVariant="danger"
      />
    </div>
  );
};

export default PriceListEditPage;
