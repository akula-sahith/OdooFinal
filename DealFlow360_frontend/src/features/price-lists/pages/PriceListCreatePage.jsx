import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Card } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import { ConfirmationDialog } from '../../../components/dialogs/ConfirmationDialog/ConfirmationDialog';
import { useToast } from '../../../components/feedback/Toast';
import { PriceListForm } from '../components/PriceListForm';
import { usePriceList } from '../hooks/usePriceList';

export const PriceListCreatePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { createPriceList } = usePriceList();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setServerErrors({});

    const result = await createPriceList(formData);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(`Price list "${formData.name}" created successfully.`);
      navigate(`/company/price-lists/${result.data.id}`);
    } else {
      if (result.fieldErrors) {
        setServerErrors(result.fieldErrors);
      }
      toast.error(result.error || 'Failed to create price list.');
    }
  };

  const handleBackClick = () => {
    if (isFormDirty) {
      setShowDiscardModal(true);
    } else {
      navigate('/company/price-lists');
    }
  };

  const handleConfirmDiscard = () => {
    setShowDiscardModal(false);
    navigate('/company/price-lists');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Create Price List"
        description="Define a new base price list catalog with currency and effective dates."
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              leadingIcon={ArrowLeft}
              onClick={handleBackClick}
            >
              Back to Price Lists
            </Button>
          </div>
        }
      />

      {/* Main Card */}
      <Card variant="default" padding="lg">
        <PriceListForm
          onSubmit={handleSubmit}
          onCancel={handleBackClick}
          isSubmitting={isSubmitting}
          serverErrors={serverErrors}
          onDirtyChange={setIsFormDirty}
          submitLabel="Create Price List"
        />
      </Card>

      {/* Discard Unsaved Changes Dialog */}
      <ConfirmationDialog
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={handleConfirmDiscard}
        title="Discard Unsaved Changes?"
        description="You have unsaved changes in this form. If you leave now, all entered price list configuration details will be lost."
        confirmLabel="Discard & Leave"
        confirmVariant="danger"
      />
    </div>
  );
};

export default PriceListCreatePage;
