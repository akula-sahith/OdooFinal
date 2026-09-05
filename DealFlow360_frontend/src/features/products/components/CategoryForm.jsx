import React, { useState, useEffect } from 'react';
import { Tag, Save, X, AlertCircle } from 'lucide-react';
import { Input } from '../../../components/ui/Input/Input';
import { Textarea } from '../../../components/ui/Textarea/Textarea';
import { Select } from '../../../components/ui/Select/Select';
import { Button } from '../../../components/ui/Button/Button';
import { Alert } from '../../../components/ui/Alert/Alert';
import { validateCategory } from '../validation/categoryValidation';

/**
 * CategoryForm Component
 * Form component for creating or updating a category.
 */
export const CategoryForm = ({
  initialValues = {},
  onSubmit,
  onCancel,
  isSaving = false,
  serverError = null,
  serverFieldErrors = {},
  isEditMode = false,
}) => {
  const [formData, setFormData] = useState({
    name: initialValues.name || '',
    description: initialValues.description || '',
    status: initialValues.status || 'ACTIVE',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialValues) {
      setFormData({
        name: initialValues.name || '',
        description: initialValues.description || '',
        status: initialValues.status || 'ACTIVE',
      });
    }
  }, [initialValues]);

  useEffect(() => {
    if (serverFieldErrors && Object.keys(serverFieldErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...serverFieldErrors }));
    }
  }, [serverFieldErrors]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const { errors: valErrors } = validateCategory(formData);
    if (valErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: valErrors[field] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, description: true, status: true });

    const { isValid, errors: valErrors } = validateCategory(formData);
    if (!isValid) {
      setErrors(valErrors);
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const statusOptions = [
    { value: 'ACTIVE', label: 'ACTIVE' },
    { value: 'INACTIVE', label: 'INACTIVE' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left" noValidate>
      {serverError && (
        <Alert variant="danger" icon={AlertCircle} title="Category Action Failed">
          {serverError}
        </Alert>
      )}

      {/* Category Name */}
      <Input
        label="Category Name"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        onBlur={() => handleBlur('name')}
        error={touched.name ? errors.name : undefined}
        required
        placeholder="e.g. Hardware & Network Equipment"
        leadingIcon={Tag}
        disabled={isSaving}
      />

      {/* Status */}
      <Select
        label="Status"
        value={formData.status}
        onChange={(e) => handleChange('status', e.target.value)}
        options={statusOptions}
        error={touched.status ? errors.status : undefined}
        required
        disabled={isSaving}
      />

      {/* Description */}
      <Textarea
        label="Description"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        onBlur={() => handleBlur('description')}
        error={touched.description ? errors.description : undefined}
        placeholder="Describe the type of products grouped in this category..."
        rows={3}
        maxLength={250}
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
          {isSaving ? 'Saving...' : isEditMode ? 'Save Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
