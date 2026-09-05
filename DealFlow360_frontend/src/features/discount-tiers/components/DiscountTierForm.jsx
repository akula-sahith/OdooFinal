import React, { useState, useEffect } from 'react';
import { Tag, Hash, Percent, Layers, Shield, Calendar, Save, X, AlertCircle, Award } from 'lucide-react';
import { Input } from '../../../components/ui/Input/Input';
import { Textarea } from '../../../components/ui/Textarea/Textarea';
import { Select } from '../../../components/ui/Select/Select';
import { Button } from '../../../components/ui/Button/Button';
import { Alert } from '../../../components/ui/Alert/Alert';
import { APPROVAL_ROLES, APPROVAL_LEVELS, DISCOUNT_TIER_STATUS } from '../types/discountTierTypes';
import { validateDiscountTier } from '../validation/discountTierValidation';

/**
 * DiscountTierForm Component
 * Form component for creating or editing Admin Discount Governance Tiers.
 */
export const DiscountTierForm = ({
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
    minimumDiscount: initialValues.minimumDiscount !== undefined ? String(initialValues.minimumDiscount) : (initialValues.minimum_discount !== undefined ? String(initialValues.minimum_discount) : '0'),
    maximumDiscount: initialValues.maximumDiscount !== undefined ? String(initialValues.maximumDiscount) : (initialValues.maximum_discount !== undefined ? String(initialValues.maximum_discount) : '5'),
    approvalLevel: initialValues.approvalLevel !== undefined ? String(initialValues.approvalLevel) : (initialValues.approval_level !== undefined ? String(initialValues.approval_level) : '0'),
    approvalRole: initialValues.approvalRole || initialValues.approval_role || 'Salesperson',
    priority: initialValues.priority !== undefined ? String(initialValues.priority) : '1',
    status: initialValues.status || DISCOUNT_TIER_STATUS.ACTIVE,
    effectiveFrom: initialValues.effectiveFrom ? initialValues.effectiveFrom.split('T')[0] : (initialValues.effective_from ? initialValues.effective_from.split('T')[0] : new Date().toISOString().split('T')[0]),
    effectiveTo: initialValues.effectiveTo ? initialValues.effectiveTo.split('T')[0] : (initialValues.effective_to ? initialValues.effective_to.split('T')[0] : ''),
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setFormData({
        name: initialValues.name || '',
        code: initialValues.code || '',
        description: initialValues.description || '',
        minimumDiscount: initialValues.minimumDiscount !== undefined ? String(initialValues.minimumDiscount) : (initialValues.minimum_discount !== undefined ? String(initialValues.minimum_discount) : '0'),
        maximumDiscount: initialValues.maximumDiscount !== undefined ? String(initialValues.maximumDiscount) : (initialValues.maximum_discount !== undefined ? String(initialValues.maximum_discount) : '5'),
        approvalLevel: initialValues.approvalLevel !== undefined ? String(initialValues.approvalLevel) : (initialValues.approval_level !== undefined ? String(initialValues.approval_level) : '0'),
        approvalRole: initialValues.approvalRole || initialValues.approval_role || 'Salesperson',
        priority: initialValues.priority !== undefined ? String(initialValues.priority) : '1',
        status: initialValues.status || DISCOUNT_TIER_STATUS.ACTIVE,
        effectiveFrom: initialValues.effectiveFrom ? initialValues.effectiveFrom.split('T')[0] : (initialValues.effective_from ? initialValues.effective_from.split('T')[0] : ''),
        effectiveTo: initialValues.effectiveTo ? initialValues.effectiveTo.split('T')[0] : (initialValues.effective_to ? initialValues.effective_to.split('T')[0] : ''),
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

    // Auto update approval role when level 0 is selected
    if (field === 'approvalLevel' && value === '0') {
      updated.approvalRole = 'Salesperson';
    }

    setFormData(updated);

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    if (onDirtyChange) {
      const isDirty =
        updated.name !== (initialValues.name || '') ||
        updated.code !== (initialValues.code || '') ||
        updated.description !== (initialValues.description || '') ||
        updated.minimumDiscount !== String(initialValues.minimumDiscount ?? 0) ||
        updated.maximumDiscount !== String(initialValues.maximumDiscount ?? 5) ||
        updated.approvalLevel !== String(initialValues.approvalLevel ?? 0) ||
        updated.approvalRole !== (initialValues.approvalRole || 'Salesperson') ||
        updated.priority !== String(initialValues.priority ?? 1) ||
        updated.status !== (initialValues.status || 'ACTIVE') ||
        updated.effectiveFrom !== (initialValues.effectiveFrom ? initialValues.effectiveFrom.split('T')[0] : '') ||
        updated.effectiveTo !== (initialValues.effectiveTo ? initialValues.effectiveTo.split('T')[0] : '');
      onDirtyChange(isDirty);
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const { errors: valErrors } = validateDiscountTier(formData);
    if (valErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: valErrors[field] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      code: true,
      description: true,
      minimumDiscount: true,
      maximumDiscount: true,
      approvalLevel: true,
      approvalRole: true,
      priority: true,
      status: true,
      effectiveFrom: true,
      effectiveTo: true,
    });

    const { isValid, errors: valErrors } = validateDiscountTier(formData);
    if (!isValid) {
      setErrors(valErrors);
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const statusOptions = [
    { value: DISCOUNT_TIER_STATUS.ACTIVE, label: 'ACTIVE (Governance Rule Enforced)' },
    { value: DISCOUNT_TIER_STATUS.INACTIVE, label: 'INACTIVE (Disabled from Evaluation)' },
  ];

  const levelSelectOptions = APPROVAL_LEVELS.map((lvl) => ({
    value: String(lvl.value),
    label: lvl.label,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left" noValidate>
      {activeServerError && (
        <Alert variant="danger" icon={AlertCircle} title="Discount Governance Save Failed">
          {activeServerError}
        </Alert>
      )}

      {/* Row 1: Name & Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        <Input
          label="Discount Tier Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          error={touched.name ? errors.name : undefined}
          required
          placeholder="e.g. Salesperson Standard Tier"
          leadingIcon={Tag}
          helperText="Human-readable title describing the discount policy band."
          disabled={savingState}
        />

        <Input
          label="Discount Tier Code"
          value={formData.code}
          onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
          onBlur={() => handleBlur('code')}
          error={touched.code ? errors.code : undefined}
          required
          placeholder="e.g. DT-SLS-01"
          leadingIcon={Hash}
          helperText="Unique commercial identifier code."
          disabled={savingState}
        />
      </div>

      {/* Row 2: Minimum & Maximum Discount */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        <Input
          type="number"
          step="0.01"
          min="0"
          max="100"
          label="Minimum Discount (%)"
          value={formData.minimumDiscount}
          onChange={(e) => handleChange('minimumDiscount', e.target.value)}
          onBlur={() => handleBlur('minimumDiscount')}
          error={touched.minimumDiscount ? errors.minimumDiscount : undefined}
          required
          placeholder="0.00"
          leadingIcon={Percent}
          helperText="The lowest discount percentage threshold covered by this rule."
          disabled={savingState}
        />

        <Input
          type="number"
          step="0.01"
          min="0"
          max="100"
          label="Maximum Discount (%)"
          value={formData.maximumDiscount}
          onChange={(e) => handleChange('maximumDiscount', e.target.value)}
          onBlur={() => handleBlur('maximumDiscount')}
          error={touched.maximumDiscount ? errors.maximumDiscount : undefined}
          required
          placeholder="5.00"
          leadingIcon={Percent}
          helperText="The highest discount covered by this rule."
          disabled={savingState}
        />
      </div>

      {/* Row 3: Approval Level & Role */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        <Select
          label="Approval Level"
          value={formData.approvalLevel}
          onChange={(e) => handleChange('approvalLevel', e.target.value)}
          options={levelSelectOptions}
          error={touched.approvalLevel ? errors.approvalLevel : undefined}
          required
          leadingIcon={Shield}
          disabled={savingState}
          helperText="Escalation severity level assigned when discount threshold is breached."
        />

        <Select
          label="Required Approval Role"
          value={formData.approvalRole}
          onChange={(e) => handleChange('approvalRole', e.target.value)}
          options={APPROVAL_ROLES}
          error={touched.approvalRole ? errors.approvalRole : undefined}
          required
          leadingIcon={Award}
          disabled={savingState || formData.approvalLevel === '0'}
          helperText="Authorized company role required to approve an exception in this tier."
        />
      </div>

      {/* Row 4: Priority & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        <Input
          type="number"
          min="1"
          step="1"
          label="Priority / Rule Order"
          value={formData.priority}
          onChange={(e) => handleChange('priority', e.target.value)}
          onBlur={() => handleBlur('priority')}
          error={touched.priority ? errors.priority : undefined}
          required
          placeholder="1"
          leadingIcon={Layers}
          helperText="Evaluation order (1 = highest priority check)."
          disabled={savingState}
        />

        <Select
          label="Rule Status"
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
          options={statusOptions}
          error={touched.status ? errors.status : undefined}
          required
          disabled={savingState}
        />
      </div>

      {/* Row 5: Effective Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        <Input
          type="date"
          label="Effective From"
          value={formData.effectiveFrom}
          onChange={(e) => handleChange('effectiveFrom', e.target.value)}
          onBlur={() => handleBlur('effectiveFrom')}
          error={touched.effectiveFrom ? errors.effectiveFrom : undefined}
          leadingIcon={Calendar}
          helperText="Start date for discount rule validity."
          disabled={savingState}
        />

        <Input
          type="date"
          label="Effective To"
          value={formData.effectiveTo}
          onChange={(e) => handleChange('effectiveTo', e.target.value)}
          onBlur={() => handleBlur('effectiveTo')}
          error={touched.effectiveTo ? errors.effectiveTo : undefined}
          leadingIcon={Calendar}
          helperText="Expiration date for rule (leave blank for indefinite)."
          disabled={savingState}
        />
      </div>

      {/* Description */}
      <Textarea
        label="Description & Escalation Context"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        onBlur={() => handleBlur('description')}
        error={touched.description ? errors.description : undefined}
        placeholder="Describe business rationale, market segment applicability, or specific approval conditions..."
        rows={3}
        maxLength={500}
        disabled={savingState}
      />

      {/* Actions Bar */}
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
          {submitLabel || (savingState ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Discount Tier')}
        </Button>
      </div>
    </form>
  );
};

export default DiscountTierForm;
