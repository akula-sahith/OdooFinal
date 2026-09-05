import React, { useState, useEffect } from 'react';
import { Package, Hash, Save, X, AlertCircle } from 'lucide-react';
import { Input } from '../../../components/ui/Input/Input';
import { Textarea } from '../../../components/ui/Textarea/Textarea';
import { Select } from '../../../components/ui/Select/Select';
import { Button } from '../../../components/ui/Button/Button';
import { Alert } from '../../../components/ui/Alert/Alert';
import { CategorySelector } from './CategorySelector';
import { validateProduct } from '../validation/productValidation';

/**
 * ProductForm Component
 * Form component for creating or editing product records.
 * Integrates client validation, server error handling, duplicate SKU detection, and dirty form tracking.
 */
export const ProductForm = ({
  initialValues = {},
  onSubmit,
  onCancel,
  isSaving = false,
  serverError = null,
  serverFieldErrors = {},
  isEditMode = false,
  onDirtyChange,
}) => {
  const [formData, setFormData] = useState({
    name: initialValues.name || '',
    sku: initialValues.sku || '',
    category_id: initialValues.category_id || initialValues.category?.id || '',
    status: initialValues.status || 'ACTIVE',
    description: initialValues.description || '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Sync initial values when edit record loads asynchronously
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setFormData({
        name: initialValues.name || '',
        sku: initialValues.sku || '',
        category_id: initialValues.category_id || initialValues.category?.id || '',
        status: initialValues.status || 'ACTIVE',
        description: initialValues.description || '',
      });
    }
  }, [initialValues]);

  // Sync server field errors (e.g., 409 duplicate SKU)
  useEffect(() => {
    if (serverFieldErrors && Object.keys(serverFieldErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...serverFieldErrors }));
    }
  }, [serverFieldErrors]);

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    // Clear specific field error when user modifies field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Check if form is dirty
    if (onDirtyChange) {
      const isDirty =
        updated.name !== (initialValues.name || '') ||
        updated.sku !== (initialValues.sku || '') ||
        updated.category_id !== (initialValues.category_id || initialValues.category?.id || '') ||
        updated.status !== (initialValues.status || 'ACTIVE') ||
        updated.description !== (initialValues.description || '');
      onDirtyChange(isDirty);
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const { errors: valErrors } = validateProduct(formData);
    if (valErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: valErrors[field] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      sku: true,
      category_id: true,
      status: true,
      description: true,
    });

    const { isValid, errors: valErrors } = validateProduct(formData);
    if (!isValid) {
      setErrors(valErrors);
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const statusOptions = [
    { value: 'ACTIVE', label: 'ACTIVE (Available for quotation configuration)' },
    { value: 'INACTIVE', label: 'INACTIVE (Hidden from new quotes, preserved historically)' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left" noValidate>
      {serverError && (
        <Alert variant="danger" icon={AlertCircle} title="Product Save Failed">
          {serverError}
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Name */}
        <Input
          label="Product Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          error={touched.name ? errors.name : undefined}
          required
          placeholder="e.g. Industrial Server Rack X-500"
          leadingIcon={Package}
          disabled={isSaving}
        />

        {/* Product Code / SKU */}
        <Input
          label="Product Code / SKU"
          value={formData.sku}
          onChange={(e) => handleChange('sku', e.target.value.toUpperCase())}
          onBlur={() => handleBlur('sku')}
          error={touched.sku ? errors.sku : undefined}
          required
          placeholder="e.g. PRD-SRV-500"
          leadingIcon={Hash}
          helperText="Unique product identifier code."
          disabled={isSaving}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Selector */}
        <CategorySelector
          value={formData.category_id}
          onChange={(e) => handleChange('category_id', e.target.value)}
          error={touched.category_id ? errors.category_id : undefined}
          required
          disabled={isSaving}
        />

        {/* Status Selector */}
        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
          options={statusOptions}
          error={touched.status ? errors.status : undefined}
          required
          disabled={isSaving}
        />
      </div>

      {/* Description */}
      <Textarea
        label="Product Description"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        onBlur={() => handleBlur('description')}
        error={touched.description ? errors.description : undefined}
        placeholder="Provide a summary of product specs and commercial description..."
        rows={4}
        maxLength={500}
        disabled={isSaving}
      />

      {/* Form Action Controls */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
          className="border-slate-300 text-slate-700 hover:bg-slate-50"
        >
          <X className="w-4 h-4 mr-1.5" />
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSaving}
          isLoading={isSaving}
          className="bg-[#714B67] hover:bg-[#5A3B52] text-white shadow-xs"
        >
          <Save className="w-4 h-4 mr-1.5" />
          {isSaving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
