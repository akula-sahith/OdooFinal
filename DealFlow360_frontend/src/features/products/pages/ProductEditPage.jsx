import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, ArrowLeft } from 'lucide-react';
import { useProduct } from '../hooks/useProduct';
import { ProductForm } from '../components/ProductForm';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Card } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import { Skeleton } from '../../../components/feedback/Skeleton/Skeleton';
import { ErrorState } from '../../../components/feedback/ErrorState/ErrorState';
import { ConfirmationDialog } from '../../../components/dialogs/ConfirmationDialog/ConfirmationDialog';
import { useToast } from '../../../components/feedback';

/**
 * ProductEditPage Component
 * Route: /company/products/:productId/edit
 * Renders product edit form pre-populated with existing product record.
 */
export const ProductEditPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { product, loading, saving, error, fieldErrors, actions } = useProduct(productId);

  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  const handleBack = () => {
    const targetUrl = `/company/products/${productId}`;
    if (isFormDirty) {
      setPendingNavigation(targetUrl);
      setShowUnsavedModal(true);
    } else {
      navigate(targetUrl);
    }
  };

  const handleConfirmLeave = () => {
    setShowUnsavedModal(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
    } else {
      navigate(`/company/products/${productId}`);
    }
  };

  const handleSubmit = async (formData) => {
    const result = await actions.saveProduct(formData);
    if (result.success) {
      setIsFormDirty(false);
      addToast({
        variant: 'success',
        title: 'Product Updated',
        message: `Product "${result.data?.name || formData.name}" updated successfully.`,
      });
      navigate(`/company/products/${productId}`);
    } else {
      addToast({
        variant: 'danger',
        title: 'Update Failed',
        message: result.error || 'Failed to update product.',
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-12">
        <Skeleton className="h-16 w-full rounded-2xl" />
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="py-12 text-center max-w-xl mx-auto space-y-4">
        <ErrorState
          title="Unable to Load Product"
          message={error}
          onRetry={actions.refetch}
        />
        <Button variant="outline" onClick={() => navigate('/company/products')} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* PAGE HEADER */}
      <PageHeader
        title={`Edit Product: ${product?.name || ''}`}
        description={`Modify catalogue specification for SKU ${product?.sku || ''}`}
        actions={
          <Button
            variant="outline"
            leadingIcon={ArrowLeft}
            onClick={handleBack}
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Cancel Edit
          </Button>
        }
      />

      {/* EDIT FORM CARD */}
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
          <ProductForm
            initialValues={product}
            onSubmit={handleSubmit}
            onCancel={handleBack}
            isSaving={saving}
            serverError={error}
            serverFieldErrors={fieldErrors}
            isEditMode={true}
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
        description="You have unsaved changes in this edit form. Leaving now will discard your modifications."
        confirmText="Leave Without Saving"
        cancelText="Stay on Page"
      />
    </div>
  );
};

export default ProductEditPage;
