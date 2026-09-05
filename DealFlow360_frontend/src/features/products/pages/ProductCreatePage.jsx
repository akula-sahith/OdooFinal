import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowLeft } from 'lucide-react';
import { useProduct } from '../hooks/useProduct';
import { ProductForm } from '../components/ProductForm';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Card } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import { ConfirmationDialog } from '../../../components/dialogs/ConfirmationDialog/ConfirmationDialog';
import { useToast } from '../../../components/feedback';

/**
 * ProductCreatePage Component
 * Route: /company/products/new
 * Renders product creation form with unsaved changes protection and duplicate SKU handling.
 */
export const ProductCreatePage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { saving, error, fieldErrors, actions } = useProduct('new');

  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  const handleBack = () => {
    if (isFormDirty) {
      setPendingNavigation('/company/products');
      setShowUnsavedModal(true);
    } else {
      navigate('/company/products');
    }
  };

  const handleConfirmLeave = () => {
    setShowUnsavedModal(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
    } else {
      navigate('/company/products');
    }
  };

  const handleSubmit = async (formData) => {
    const result = await actions.saveProduct(formData);
    if (result.success) {
      setIsFormDirty(false);
      addToast({
        variant: 'success',
        title: 'Product Created',
        message: `Product "${result.data?.name || formData.name}" created successfully.`,
      });
      navigate('/company/products');
    } else {
      addToast({
        variant: 'danger',
        title: 'Creation Failed',
        message: result.error || 'Failed to create product.',
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* PAGE HEADER */}
      <PageHeader
        title="Create Product"
        description="Add a new product record to the central catalogue."
        actions={
          <Button
            variant="outline"
            leadingIcon={ArrowLeft}
            onClick={handleBack}
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Back to Products
          </Button>
        }
      />

      {/* FORM CARD */}
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
          <ProductForm
            onSubmit={handleSubmit}
            onCancel={handleBack}
            isSaving={saving}
            serverError={error}
            serverFieldErrors={fieldErrors}
            isEditMode={false}
            onDirtyChange={setIsFormDirty}
          />
        </Card>
      </div>

      {/* UNSAVED CHANGES MODAL */}
      <ConfirmationDialog
        isOpen={showUnsavedModal}
        onClose={() => setShowUnsavedModal(false)}
        onConfirm={handleConfirmLeave}
        variant="danger"
        title="Unsaved Changes"
        description="You have unsaved changes in this form. Leaving now will discard your input."
        confirmText="Leave Without Saving"
        cancelText="Stay on Page"
      />
    </div>
  );
};

export default ProductCreatePage;
