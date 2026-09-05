import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Plus, Calendar, Tag, Info } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Card } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge/StatusBadge';
import { ConfirmationDialog } from '../../../components/dialogs/ConfirmationDialog/ConfirmationDialog';
import { TableSkeleton } from '../../../components/feedback/Skeleton/TableSkeleton';
import { ErrorState } from '../../../components/feedback/ErrorState/ErrorState';
import { useToast } from '../../../components/feedback/Toast';
import { usePermissions } from '../../../hooks/auth/usePermissions';
import { usePriceList } from '../hooks/usePriceList';
import { usePriceListItems } from '../hooks/usePriceListItems';
import { PriceListItemTable } from '../components/PriceListItemTable';
import { AddProductToPriceListModal } from '../components/AddProductToPriceListModal';
import { PriceItemEditModal } from '../components/PriceItemEditModal';
import { priceListService } from '../services/priceListService';
import { formatCurrency } from '../../../constants/currency';

export const PriceListDetailPage = () => {
  const { priceListId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { hasPermission } = usePermissions();

  const canCreate = hasPermission('pricing.create');
  const canUpdate = hasPermission('pricing.update');
  const canManageStatus = hasPermission('pricing.manage_status');

  // Price List Header & Metadata state
  const {
    priceList,
    isLoading: isHeaderLoading,
    error: headerError,
    refetch: refetchHeader,
  } = usePriceList(priceListId);

  // Price List Items state
  const {
    items,
    isLoading: isItemsLoading,
    error: itemsError,
    refetch: refetchItems,
    addItem,
    updateItemPrice,
    removeItem,
  } = usePriceListItems(priceListId);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Status toggle confirmation
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Item deletion confirmation
  const [deletingItem, setDeletingItem] = useState(null);
  const [isRemovingItem, setIsRemovingItem] = useState(false);

  // Toggle Price List Status (Activate / Deactivate)
  const handleToggleStatus = async () => {
    if (!priceList) return;
    const targetStatus = priceList.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    setIsUpdatingStatus(true);
    try {
      await priceListService.updatePriceListStatus(priceList.id, targetStatus);
      toast.success(
        `Price List "${priceList.name}" set to ${targetStatus}.`
      );
      setStatusModalOpen(false);
      refetchHeader();
    } catch (err) {
      toast.error(err.message || 'Failed to update status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Add Product Item Submit
  const handleAddProductSubmit = async ({ productId, basePrice }) => {
    const result = await addItem({ productId, basePrice });
    if (result.success) {
      toast.success('Product added to price list successfully.');
      setIsAddModalOpen(false);
      refetchItems();
      refetchHeader();
    } else {
      toast.error(result.error || 'Failed to add product.');
    }
    return result;
  };

  // Edit Product Base Price Submit
  const handleEditPriceSubmit = async ({ itemId, basePrice }) => {
    const result = await updateItemPrice({ itemId, basePrice });
    if (result.success) {
      toast.success('Base price updated successfully.');
      setEditingItem(null);
      refetchItems();
    } else {
      toast.error(result.error || 'Failed to update base price.');
    }
    return result;
  };

  // Confirm Item Deletion Submit
  const handleConfirmRemoveItem = async () => {
    if (!deletingItem) return;
    setIsRemovingItem(true);

    const result = await removeItem(deletingItem.id);
    setIsRemovingItem(false);

    if (result.success) {
      toast.success(`Removed "${deletingItem.productName}" from price list.`);
      setDeletingItem(null);
      refetchItems();
      refetchHeader();
    } else {
      toast.error(result.error || 'Failed to remove item.');
    }
  };

  // Format Date range helper
  const formatDateDisplay = (dateString) => {
    if (!dateString) return 'Indefinite';
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  if (isHeaderLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Price List Details" description="Loading price list info..." />
        <Card padding="lg">
          <TableSkeleton rows={4} columns={2} />
        </Card>
      </div>
    );
  }

  if (headerError || !priceList) {
    return (
      <div className="space-y-6">
        <PageHeader title="Price List Details" description="Error loading price list" />
        <Card padding="lg">
          <ErrorState
            title="Price List Not Found"
            description={headerError || 'The specified price list could not be loaded.'}
            actionLabel="Back to Price Lists"
            onAction={() => navigate('/company/price-lists')}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <PageHeader
        title={priceList.name}
        description={`Code: ${priceList.code} | Currency: ${priceList.currency}`}
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              variant="outline"
              leadingIcon={ArrowLeft}
              onClick={() => navigate('/company/price-lists')}
            >
              Back
            </Button>

            {canManageStatus && (
              <Button
                variant={priceList.status === 'ACTIVE' ? 'outline' : 'secondary'}
                onClick={() => setStatusModalOpen(true)}
              >
                {priceList.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
              </Button>
            )}

            {canUpdate && (
              <Button
                variant="outline"
                leadingIcon={Edit}
                onClick={() => navigate(`/company/price-lists/${priceListId}/edit`)}
              >
                Edit Header
              </Button>
            )}

            {canUpdate && (
              <Button
                variant="primary"
                leadingIcon={Plus}
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Product
              </Button>
            )}
          </div>
        }
      />

      {/* Overview Metadata Card */}
      <Card variant="default" padding="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Status & Code */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Status & Identification
            </span>
            <div className="flex items-center gap-2">
              <StatusBadge status={priceList.status} />
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {priceList.code}
              </span>
            </div>
          </div>

          {/* Currency */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Base Currency
            </span>
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Tag className="w-4 h-4 text-[#714B67]" />
              <span>{priceList.currency}</span>
            </div>
          </div>

          {/* Effective Window */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Effective Window
            </span>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                {formatDateDisplay(priceList.effectiveFrom)} — {formatDateDisplay(priceList.effectiveTo)}
              </span>
            </div>
          </div>

          {/* Product Items Count */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Configured Items
            </span>
            <div className="text-slate-900 font-extrabold text-lg">
              {items.length}{' '}
              <span className="text-xs font-semibold text-slate-500">
                Products
              </span>
            </div>
          </div>
        </div>

        {/* Optional Description */}
        {priceList.description && (
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-start gap-2.5 text-slate-600 text-sm">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p>{priceList.description}</p>
          </div>
        )}
      </Card>

      {/* Items Section Table */}
      <Card variant="default" padding="none" className="overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="font-heading font-extrabold text-base text-slate-900">
              Base Product Prices
            </h3>
            <p className="text-xs text-slate-500">
              Define standard base prices for products associated with this price list catalog.
            </p>
          </div>

          {canUpdate && (
            <Button
              variant="outline"
              size="sm"
              leadingIcon={Plus}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Product Item
            </Button>
          )}
        </div>

        <PriceListItemTable
          items={items}
          currency={priceList.currency}
          isLoading={isItemsLoading}
          error={itemsError}
          onRetry={refetchItems}
          onEditPrice={canUpdate ? (item) => setEditingItem(item) : undefined}
          onRemoveItem={canUpdate ? (item) => setDeletingItem(item) : undefined}
        />
      </Card>

      {/* Modal: Add Product to Price List */}
      <AddProductToPriceListModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddProductSubmit}
        currency={priceList.currency}
        existingItems={items}
      />

      {/* Modal: Edit Item Base Price */}
      {editingItem && (
        <PriceItemEditModal
          isOpen={Boolean(editingItem)}
          onClose={() => setEditingItem(null)}
          onSubmit={handleEditPriceSubmit}
          item={editingItem}
          currency={priceList.currency}
        />
      )}

      {/* Modal: Confirm Status Toggle */}
      <ConfirmationDialog
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        onConfirm={handleToggleStatus}
        title={
          priceList.status === 'ACTIVE'
            ? 'Deactivate Price List'
            : 'Activate Price List'
        }
        description={`Are you sure you want to ${
          priceList.status === 'ACTIVE' ? 'deactivate' : 'activate'
        } "${priceList.name}"?`}
        confirmLabel={
          priceList.status === 'ACTIVE' ? 'Deactivate' : 'Activate'
        }
        confirmVariant={priceList.status === 'ACTIVE' ? 'danger' : 'primary'}
        isLoading={isUpdatingStatus}
      />

      {/* Modal: Confirm Product Item Removal */}
      <ConfirmationDialog
        isOpen={Boolean(deletingItem)}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleConfirmRemoveItem}
        title="Remove Product from Price List?"
        description={`Are you sure you want to remove product "${deletingItem?.productName}" (${deletingItem?.productSku || ''}) from price list "${priceList.name}"? Base price mapping for this product will be deleted.`}
        confirmLabel="Remove Product"
        confirmVariant="danger"
        isLoading={isRemovingItem}
      />
    </div>
  );
};

export default PriceListDetailPage;
