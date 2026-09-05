import React, { useState, useEffect } from 'react';
import { Shield, Hash, Save, X, AlertCircle } from 'lucide-react';
import { Input } from '../../../components/ui/Input/Input';
import { Textarea } from '../../../components/ui/Textarea/Textarea';
import { Select } from '../../../components/ui/Select/Select';
import { Button } from '../../../components/ui/Button/Button';
import { Alert } from '../../../components/ui/Alert/Alert';
import { ROLE_STATUS } from '../types/roleTypes';
import { validateRole } from '../validation/roleValidation';
import { PermissionMatrix } from './PermissionMatrix';

/**
 * RoleForm Component
 * Form component for creating or editing security roles and assigning permission capability matrices.
 */
export const RoleForm = ({
  initialValues = {},
  onSubmit,
  onCancel,
  isSaving = false,
  isSubmitting = false,
  serverError = null,
  serverErrors = null,
  serverFieldErrors = {},
  isEditMode = false,
  onDirtyChange,
  submitLabel,
}) => {
  const savingState = isSaving || isSubmitting;
  const activeServerError = serverError || (typeof serverErrors === 'string' ? serverErrors : null);
  const activeFieldErrors = serverFieldErrors || (typeof serverErrors === 'object' ? serverErrors : {});

  const [formData, setFormData] = useState({
    name: initialValues.name || '',
    code: initialValues.code || '',
    description: initialValues.description || '',
    status: initialValues.status || ROLE_STATUS.ACTIVE,
    permissions: Array.isArray(initialValues.permissions) ? initialValues.permissions : [],
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setFormData({
        name: initialValues.name || '',
        code: initialValues.code || '',
        description: initialValues.description || '',
        status: initialValues.status || ROLE_STATUS.ACTIVE,
        permissions: Array.isArray(initialValues.permissions) ? initialValues.permissions : [],
      });
    }
  }, [initialValues]);

  useEffect(() => {
    if (activeFieldErrors && Object.keys(activeFieldErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...activeFieldErrors }));
    }
  }, [activeFieldErrors]);

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    if (onDirtyChange) {
      const isDirty =
        updated.name !== (initialValues.name || '') ||
        updated.code !== (initialValues.code || '') ||
        updated.description !== (initialValues.description || '') ||
        updated.status !== (initialValues.status || 'ACTIVE') ||
        JSON.stringify(updated.permissions) !== JSON.stringify(initialValues.permissions || []);
      onDirtyChange(isDirty);
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const { errors: valErrors } = validateRole(formData);
    if (valErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: valErrors[field] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, code: true, description: true });

    const { isValid, errors: valErrors } = validateRole(formData);
    if (!isValid) {
      setErrors(valErrors);
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const statusOptions = [
    { value: ROLE_STATUS.ACTIVE, label: 'ACTIVE (Assignable to Staff Users)' },
    { value: ROLE_STATUS.INACTIVE, label: 'INACTIVE (Disabled from Assignment)' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left" noValidate>
      {activeServerError && (
        <Alert variant="danger" icon={AlertCircle} title="Role Configuration Save Failed">
          {activeServerError}
        </Alert>
      )}

      {/* Row 1: Name, Code & Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        <Input
          label="Role Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          error={touched.name ? errors.name : undefined}
          required
          placeholder="e.g. Sales Manager"
          leadingIcon={Shield}
          disabled={savingState || initialValues.isSystem}
          helperText="Human-readable title describing the job security role."
        />

        <Input
          label="Role Code"
          value={formData.code}
          onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
          onBlur={() => handleBlur('code')}
          error={touched.code ? errors.code : undefined}
          required
          placeholder="e.g. ROLE-MGR"
          leadingIcon={Hash}
          disabled={savingState || initialValues.isSystem || isEditMode}
          helperText="Unique system identifier code."
        />

        <Select
          label="Role Status"
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
          options={statusOptions}
          error={touched.status ? errors.status : undefined}
          required
          disabled={savingState || initialValues.isSystem}
        />
      </div>

      {/* Description */}
      <Textarea
        label="Description & Access Scope"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        onBlur={() => handleBlur('description')}
        error={touched.description ? errors.description : undefined}
        placeholder="Describe job responsibilities and authorization boundaries..."
        rows={2}
        maxLength={300}
        disabled={savingState}
      />

      {/* Embedded Permission Matrix */}
      <div className="pt-2">
        <PermissionMatrix
          selectedPermissions={formData.permissions}
          onChange={(perms) => handleChange('permissions', perms)}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-200/80">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={savingState}
          className="border-slate-300 text-slate-700 hover:bg-slate-50"
        >
          <X className="w-4 h-4 mr-1.5" />
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={savingState}
          isLoading={savingState}
          className="bg-[#714B67] hover:bg-[#5A3B52] text-white shadow-xs"
        >
          <Save className="w-4 h-4 mr-1.5" />
          {submitLabel || (savingState ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Role')}
        </Button>
      </div>
    </form>
  );
};

export default RoleForm;
