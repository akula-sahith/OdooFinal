import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, Edit3, ArrowLeft, Power, Tag, Calendar, Clock, Info } from 'lucide-react';
import { useProduct } from '../hooks/useProduct';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Card } from '../../../components/ui/Card/Card';
import { StatusBadge } from '../../../components/ui/StatusBadge/StatusBadge';
import { Button } from '../../../components/ui/Button/Button';
import { Skeleton } from '../../../components/feedback/Skeleton/Skeleton';
import { ErrorState } from '../../../components/feedback/ErrorState/ErrorState';
import { ConfirmationDialog } from '../../../components/dialogs/ConfirmationDialog/ConfirmationDialog';
import { useToast } from '../../../components/feedback';

/**
 * ProductDetailPage Component
 * Route: /company/products/:productId
 * Displays complete product configuration specifications, metadata, and status toggling.
 */
export const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { product, loading, error, actions } = useProduct(productId);

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleEdit = () => {
    navigate(`/company/products/${productId}/edit`);
  };

  const handleBack = () => {
    navigate('/company/products');
  };

  const handleConfirmStatusChange = async () => {
    if (!product) return;
    setIsUpdatingStatus(true);
    const newStatus = product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const result = await actions.updateStatus(newStatus);
    setIsUpdatingStatus(false);
    setStatusModalOpen(false);

    if (result.success) {
      addToast({
        variant: 'success',
        title: 'Status Updated',
        message: `Product "${product.name}" is now ${newStatus}.`,
      });
      actions.refetch();
    } else {
      addToast({
        variant: 'danger',
        title: 'Update Failed',
        message: result.error || 'Failed to update product status.',
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-12">
        <Skeleton className="h-16 w-full rounded-2xl" />
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-12 text-center max-w-xl mx-auto space-y-4">
        <ErrorState
          title="Product Not Found"
          message={error || 'The requested product record could not be loaded from the database.'}
          onRetry={actions.refetch}
        />
        <Button variant="outline" onClick={handleBack} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Return to Product List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* PAGE HEADER */}
      <PageHeader
        title={product.name || 'Product Details'}
        description={`SKU: ${product.sku || 'N/A'}`}
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              leadingIcon={ArrowLeft}
              onClick={handleBack}
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Back
            </Button>

            <Button
              variant="outline"
              leadingIcon={Power}
              onClick={() => setStatusModalOpen(true)}
              className={
                product.status === 'ACTIVE'
                  ? 'border-rose-300 text-rose-700 hover:bg-rose-50'
                  : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
              }
            >
              {product.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
            </Button>

            <Button
              leadingIcon={Edit3}
              onClick={handleEdit}
              className="bg-[#714B67] hover:bg-[#5A3B52] text-white shadow-xs"
            >
              Edit Product
            </Button>
          </div>
        }
      />

      {/* DETAILS BODY */}
      <div className="max-w-4xl mx-auto space-y-6 text-left">
        <Card className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Product Status</span>
              <div className="mt-1 flex items-center gap-3">
                <StatusBadge status={product.status || 'INACTIVE'} size="md" />
                <code className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-800 text-xs font-mono font-bold rounded-lg">
                  SKU: {product.sku}
                </code>
              </div>
            </div>
            {product.category?.name && (
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</span>
                <p className="mt-1 font-semibold text-slate-800 text-sm flex items-center justify-end gap-1.5">
                  <Tag className="w-4 h-4 text-[#714B67]" />
                  {product.category.name}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Product Name</span>
              <p className="mt-1 text-base font-bold text-slate-900">{product.name}</p>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Category Reference ID</span>
              <p className="mt-1 text-sm font-medium text-slate-700 font-mono">
                {product.category_id || product.category?.id || 'N/A'}
              </p>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</span>
            <p className="mt-1.5 text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/60">
              {product.description || 'No description provided for this product.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>
                Created: {product.created_at ? new Date(product.created_at).toLocaleString() : 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:justify-end">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>
                Last Updated: {product.updated_at ? new Date(product.updated_at).toLocaleString() : 'N/A'}
              </span>
            </div>
          </div>
        </Card>

        {/* WORKFLOW INTEGRATION NOTICE */}
        <div className="p-4 bg-[#F7F2F5]/80 border border-[#714B67]/20 rounded-2xl flex items-start gap-3 text-xs text-[#5A3B52]">
          <Info className="w-5 h-5 text-[#714B67] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#714B67] block text-sm">Downstream Commercial Integration</span>
            Products defined here are foundational system records. Commercial pricing, volume tiers, and quotation line selection will reference this SKU in subsequent modules. Commercial price lists are configured separately in the Price List management phase.
          </div>
        </div>
      </div>

      {/* STATUS CONFIRMATION MODAL */}
      <ConfirmationDialog
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        onConfirm={handleConfirmStatusChange}
        isLoading={isUpdatingStatus}
        variant={product.status === 'ACTIVE' ? 'danger' : 'success'}
        title={`${product.status === 'ACTIVE' ? 'Deactivate' : 'Activate'} Product?`}
        description={
          product.status === 'ACTIVE'
            ? `Deactivating "${product.name}" will make it unavailable for new quotation building. Existing quotes will retain historical references.`
            : `Activating "${product.name}" will restore it for quotation line selection.`
        }
        confirmText={product.status === 'ACTIVE' ? 'Deactivate Product' : 'Activate Product'}
        cancelText="Cancel"
      />
    </div>
  );
};

export default ProductDetailPage;
