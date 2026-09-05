import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderTree, Plus, ArrowLeft, RefreshCw } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { CategoryTable } from '../components/CategoryTable';
import { CategoryForm } from '../components/CategoryForm';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Button } from '../../../components/ui/Button/Button';
import { SearchInput } from '../../../components/ui/SearchInput/SearchInput';
import { Select } from '../../../components/ui/Select/Select';
import { Modal } from '../../../components/dialogs/Modal/Modal';
import { ConfirmationDialog } from '../../../components/dialogs/ConfirmationDialog/ConfirmationDialog';
import { useToast } from '../../../components/feedback';

/**
 * CategoryListPage Component
 * Route: /company/products/categories
 * Manages product category listing, modal creation, editing, and status governance.
 */
export const CategoryListPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const {
    categories,
    loading,
    saving,
    error,
    fieldErrors,
    filters,
    actions,
  } = useCategories();

  // Create / Edit Modal state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Status toggle confirmation modal state
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    actions.clearErrors();
    setFormModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setEditingCategory(category);
    actions.clearErrors();
    setFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setFormModalOpen(false);
    setEditingCategory(null);
    actions.clearErrors();
  };

  const handleSaveCategory = async (formData) => {
    const result = await actions.saveCategory(formData, editingCategory?.id);
    if (result.success) {
      addToast({
        variant: 'success',
        title: editingCategory ? 'Category Updated' : 'Category Created',
        message: `Category "${result.data?.name || formData.name}" saved successfully.`,
      });
      handleCloseFormModal();
      actions.refetch();
    } else {
      addToast({
        variant: 'danger',
        title: 'Operation Failed',
        message: result.error || 'Failed to save category.',
      });
    }
  };

  const handleOpenStatusModal = (category) => {
    setSelectedCategory(category);
    setStatusModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedCategory) return;
    const newStatus = selectedCategory.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const result = await actions.updateCategoryStatus(selectedCategory.id, newStatus);

    setStatusModalOpen(false);

    if (result.success) {
      addToast({
        variant: 'success',
        title: 'Category Status Updated',
        message: `Category "${selectedCategory.name}" is now ${newStatus}.`,
      });
      actions.refetch();
    } else {
      addToast({
        variant: 'danger',
        title: 'Status Update Failed',
        message: result.error || 'Unable to update category status.',
      });
    }
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* PAGE HEADER */}
      <PageHeader
        title="Category Management"
        description="Organize product classifications across your company catalogue."
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              leadingIcon={ArrowLeft}
              onClick={() => navigate('/company/products')}
              className="border-slate-300 text-slate-700 hover:bg-slate-50 shadow-2xs"
            >
              Back to Products
            </Button>

            <Button
              leadingIcon={Plus}
              onClick={handleOpenCreateModal}
              className="bg-[#714B67] hover:bg-[#5A3B52] text-white shadow-xs"
            >
              Add Category
            </Button>
          </div>
        }
      />

      {/* SEARCH AND FILTERS BAR */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full">
          <SearchInput
            value={filters.search}
            onSearch={actions.setSearch}
            placeholder="Search category name..."
          />
        </div>

        <div className="w-full sm:w-48">
          <Select
            value={filters.status}
            onChange={(e) => actions.setStatus(e.target.value)}
            options={statusOptions}
            placeholder="All Statuses"
          />
        </div>
      </div>

      {/* CATEGORY TABLE */}
      <CategoryTable
        categories={categories}
        loading={loading}
        error={error}
        onRetry={actions.refetch}
        onEditCategory={handleOpenEditModal}
        onToggleStatus={handleOpenStatusModal}
        emptyTitle={filters.search || filters.status ? "No matching categories" : "No categories configured yet"}
        emptyDescription={
          filters.search || filters.status
            ? "No categories matched your search criteria."
            : "Get started by adding your first product category."
        }
        emptyAction={
          filters.search || filters.status ? (
            <Button variant="outline" size="sm" onClick={() => { actions.setSearch(''); actions.setStatus(''); }}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Clear Filters
            </Button>
          ) : (
            <Button size="sm" onClick={handleOpenCreateModal} className="bg-[#714B67] text-white">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add First Category
            </Button>
          )
        }
      />

      {/* CREATE / EDIT CATEGORY MODAL */}
      <Modal
        isOpen={formModalOpen}
        onClose={handleCloseFormModal}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
        description={
          editingCategory
            ? `Modify category details for "${editingCategory.name}".`
            : 'Add a new product category to structure your product catalogue.'
        }
        size="md"
      >
        <CategoryForm
          initialValues={editingCategory || {}}
          onSubmit={handleSaveCategory}
          onCancel={handleCloseFormModal}
          isSaving={saving}
          serverError={error}
          serverFieldErrors={fieldErrors}
          isEditMode={!!editingCategory}
        />
      </Modal>

      {/* STATUS CONFIRMATION DIALOG */}
      <ConfirmationDialog
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        onConfirm={handleConfirmStatusChange}
        isLoading={saving}
        variant={selectedCategory?.status === 'ACTIVE' ? 'danger' : 'success'}
        title={`${selectedCategory?.status === 'ACTIVE' ? 'Deactivate' : 'Activate'} Category?`}
        description={
          selectedCategory?.status === 'ACTIVE'
            ? `Deactivating category "${selectedCategory?.name}" will restrict it from being assigned to new products. Existing products with this category will maintain their reference.`
            : `Activating "${selectedCategory?.name}" will make it available for product assignment.`
        }
        confirmText={selectedCategory?.status === 'ACTIVE' ? 'Deactivate Category' : 'Activate Category'}
        cancelText="Cancel"
      />
    </div>
  );
};

export default CategoryListPage;
