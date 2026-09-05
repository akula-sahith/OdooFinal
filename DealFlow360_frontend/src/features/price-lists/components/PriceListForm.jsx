import React, { useState, useEffect } from 'react';
import { Tag, Hash, Calendar, Save, X, AlertCircle, DollarSign } from 'lucide-react';
import { Input } from '../../../components/ui/Input/Input';
import { Textarea } from '../../../components/ui/Textarea/Textarea';
import { Select } from '../../../components/ui/Select/Select';
import { Button } from '../../../components/ui/Button/Button';
import { Alert } from '../../../components/ui/Alert/Alert';
import { SUPPORTED_CURRENCIES } from '../../../constants/currency';
import { validatePriceList } from '../validation/priceListValidation';

/**
 * PriceListForm Component
 * Form component for creating or editing master Price Lists.
 * Enforces date relationship (Effective To >= Effective From), currency selection from SUPPORTED_CURRENCIES,
 * and 409 duplicate name/code error handling.
 */
export const PriceListForm = ({
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
    code: initialValues.code || '',
    currency: initialValues.currency || 'USD',
    status: initialValues.status || 'ACTIVE',
    effective_from: initialValues.effective_from ? initialValues.effective_from.split('T')[0] : '',
    effective_to: initialValues.effective_to ? initialValues.effective_to.split('T')[0] : '',
    description: initialValues.description || '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setFormData({
        name: initialValues.name || '',
        code: initialValues.code || '',
        currency: initialValues.currency || 'USD',
        status: initialValues.status || 'ACTIVE',
        effective_from: initialValues.effective_from ? initialValues.effective_from.split('T')[0] : '',
        effective_to: initialValues.effective_to ? initialValues.effective_to.split('T')[0] : '',
        description: initialValues.description || '',
      });
    }
  }, [initialValues]);

  useEffect(() => {
    if (serverFieldErrors && Object.keys(serverFieldErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...serverFieldErrors }));
    }
  }, [serverFieldErrors]);

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
        updated.currency !== (initialValues.currency || 'USD') ||
        updated.status !== (initialValues.status || 'ACTIVE') ||
        updated.effective_from !== (initialValues.effective_from ? initialValues.effective_from.split('T')[0] : '') ||
        updated.effective_to !== (initialValues.effective_to ? initialValues.effective_to.split('T')[0] : '') ||
        updated.description !== (initialValues.description || '');
      onDirtyChange(isDirty);
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const { errors: valErrors } = validatePriceList(formData);
    if (valErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: valErrors[field] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      code: true,
      currency: true,
      status: true,
      effective_from: true,
      effective_to: true,
      description: true,
    });

    const { isValid, errors: valErrors } = validatePriceList(formData);
    if (!isValid) {
      setErrors(valErrors);
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const currencyOptions = SUPPORTED_CURRENCIES.map((c) => ({
    value: c.code,
    label: `${c.code} (${c.symbol}) - ${c.name}`,
  }));

  const statusOptions = [
    { value: 'ACTIVE', label: 'ACTIVE (Available for sales quotation selection)' },
    { value: 'INACTIVE', label: 'INACTIVE (Hidden from new quotes, preserved historically)' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left" noValidate>
      {serverError && (
        <Alert variant="danger" icon={AlertCircle} title="Price List Save Failed">
          {serverError}
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <Input
          label="Price List Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          error={touched.name ? errors.name : undefined}
          required
          placeholder="e.g. Standard Commercial Price List 2026"
          leadingIcon={Tag}
          disabled={isSaving}
        />

        {/* Code */}
        <Input
          label="Price List Code"
          value={formData.code}
          onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
          onBlur={() => handleBlur('code')}
          error={touched.code ? errors.code : undefined}
          required
          placeholder="e.g. PL-STD-2026"
          leadingIcon={Hash}
          helperText="Unique commercial identifier code."
          disabled={isSaving}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Currency Selector */}
        <Select
          label="Currency"
          value={formData.currency}
          onChange={(e) => handleChange('currency', e.target.value)}
          options={currencyOptions}
          error={touched.currency ? errors.currency : undefined}
          required
          leadingIcon={DollarSign}
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

      {/* Date Range: Effective From & Effective To */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          type="date"
          label="Effective From"
          value={formData.effective_from}
          onChange={(e) => handleChange('effective_from', e.target.value)}
          onBlur={() => handleBlur('effective_from')}
          error={touched.effective_from ? errors.effective_from : undefined}
          leadingIcon={Calendar}
          helperText="Start date for pricing validity (optional)."
          disabled={isSaving}
        />

        <Input
          type="date"
          label="Effective To"
          value={formData.effective_to}
          onChange={(e) => handleChange('effective_to', e.target.value)}
          onBlur={() => handleBlur('effective_to')}
          error={touched.effective_to ? errors.effective_to : undefined}
          leadingIcon={Calendar}
          helperText="End date for pricing validity (Effective To >= Effective From)."
          disabled={isSaving}
        />
      </div>

      {/* Description */}
      <Textarea
        label="Description"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        onBlur={() => handleBlur('description')}
        error={touched.description ? errors.description : undefined}
        placeholder="Provide notes regarding target market segments, contract terms, or commercial scope..."
        rows={3}
        maxLength={500}
        disabled={isSaving}
      />

      {/* Action Controls */}
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
          {isSaving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Price List'}
        </Button>
      </div>
    </form>
  );
};

export default PriceListForm;
