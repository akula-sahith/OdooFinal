import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderTree, Package, RefreshCw } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useProduct } from '../hooks/useProduct';
import { ProductTable } from '../components/ProductTable';
import { ProductFilters } from '../components/ProductFilters';
import { Pagination } from '../../../components/tables/Pagination/Pagination';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Button } from '../../../components/ui/Button/Button';
import { ConfirmationDialog } from '../../../components/dialogs/ConfirmationDialog/ConfirmationDialog';
import { useToast } from '../../../components/feedback';

/**
 * ProductListPage Component
 * Main Admin Product Catalogue page (/company/products).
 * Displays backend products, search bar, status & category filters, pagination, and status confirmation modal.
 */
export const ProductListPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const {
    products,
    loading,
    error,
    pagination,
    filters,
    actions,
  } = useProducts();

  // Selected product state for status confirmation modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);

  const { actions: productActions } = useProduct(selectedProduct?.id);

  const handleCreateProduct = () => {
    navigate('/company/products/new');
  };

  const handleManageCategories = () => {
    navigate('/company/products/categories');
  };

  const handleViewProduct = (product) => {
    navigate(`/company/products/${product.id}`);
  };

  const handleEditProduct = (product) => {
    navigate(`/company/products/${product.id}/edit`);
  };

  const handleOpenStatusModal = (product) => {
    setSelectedProduct(product);
    setStatusModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedProduct) return;
    setIsStatusUpdating(true);

    const newStatus = selectedProduct.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const result = await productActions.updateStatus(newStatus);

    setIsStatusUpdating(false);
    setStatusModalOpen(false);

    if (result.success) {
      addToast({
        variant: 'success',
        title: 'Status Updated',
        message: `Product "${selectedProduct.name}" is now ${newStatus}.`,
      });
      actions.refetch();
    } else {
      addToast({
        variant: 'danger',
        title: 'Update Failed',
        message: result.error || 'Unable to update product status.',
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* PAGE HEADER */}
      <PageHeader
        title="Product Catalogue"
        description="Manage foundational product items consumed by quotation & commercial pricing modules."
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              leadingIcon={FolderTree}
              onClick={handleManageCategories}
              className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-[#714B67] hover:border-[#714B67]/30 shadow-2xs"
            >
              Category Management
            </Button>

            <Button
              leadingIcon={Plus}
              onClick={handleCreateProduct}
              className="bg-[#714B67] hover:bg-[#5A3B52] text-white shadow-xs"
            >
              Add Product
            </Button>
          </div>
        }
      />

      {/* PRODUCT FILTERS BAR */}
      <ProductFilters
        filters={filters}
        onSearchChange={actions.setSearch}
        onCategoryChange={actions.setCategoryId}
        onStatusChange={actions.setStatus}
        onClearFilters={actions.clearFilters}
      />

      {/* PRODUCT DATA TABLE */}
      <div className="space-y-4">
        <ProductTable
          products={products}
          loading={loading}
          error={error}
          onRetry={actions.refetch}
          onViewProduct={handleViewProduct}
          onEditProduct={handleEditProduct}
          onToggleStatus={handleOpenStatusModal}
          sortColumn={filters.sortBy}
          sortDirection={filters.sortOrder}
          onSort={(col) => actions.setSortBy(col)}
          emptyTitle={filters.search || filters.categoryId || filters.status ? "No matching products" : "No products found"}
          emptyDescription={
            filters.search || filters.categoryId || filters.status
              ? "No product records matched your search parameters. Try adjusting your search or filters."
              : "No products configured in the system catalogue yet."
          }
          emptyAction={
            filters.search || filters.categoryId || filters.status ? (
              <Button variant="outline" size="sm" onClick={actions.clearFilters}>
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Clear Filters
              </Button>
            ) : (
              <Button size="sm" onClick={handleCreateProduct} className="bg-[#714B67] text-white">
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Add First Product
              </Button>
            )
          }
        />

        {/* PAGINATION */}
        {!loading && !error && pagination.totalCount > 0 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
            totalItems={pagination.totalCount}
            onPageChange={actions.setPage}
            onPageSizeChange={actions.setPageSize}
          />
        )}
      </div>

      {/* DEACTIVATION / ACTIVATION CONFIRMATION DIALOG */}
      <ConfirmationDialog
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        onConfirm={handleConfirmStatusChange}
        isLoading={isStatusUpdating}
        variant={selectedProduct?.status === 'ACTIVE' ? 'danger' : 'success'}
        title={`${selectedProduct?.status === 'ACTIVE' ? 'Deactivate' : 'Activate'} Product?`}
        description={
          selectedProduct?.status === 'ACTIVE'
            ? `Deactivating "${selectedProduct?.name}" will prevent sales reps from selecting it for new quotations. Existing quotations and historical data will remain unaffected.`
            : `Activating "${selectedProduct?.name}" will make it available for new quotation creation and price listing.`
        }
        confirmText={selectedProduct?.status === 'ACTIVE' ? 'Deactivate Product' : 'Activate Product'}
        cancelText="Cancel"
      />
    </div>
  );
};

export default ProductListPage;
