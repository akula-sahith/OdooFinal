import React, { useState, useEffect } from 'react';
import { FileText, Package, Hash, AlertOctagon, Send, Save, Check } from 'lucide-react';
import { Input } from '../../../components/ui/Input/Input';
import { Textarea } from '../../../components/ui/Textarea/Textarea';
import { Select } from '../../../components/ui/Select/Select';
import { Button } from '../../../components/ui/Button/Button';
import { validateCustomerRequestForm } from '../validation/customerRequestValidation';
import { REQUEST_PRIORITY_OPTIONS } from '../types/customerRequestTypes';

/**
 * CustomerRequestForm Component
 * Form for drafting and submitting B2B requirement requests to the sales workflow.
 */
export const CustomerRequestForm = ({
  initialValues = {},
  products = [],
  onSubmit,
  isSubmitting = false,
  isEdit = false,
  onCancel,
  onDirtyChange,
}) => {
  const [formData, setFormData] = useState({
    title: initialValues.title || '',
    description: initialValues.description || '',
    productId: initialValues.productId || '',
    quantity: initialValues.quantity || '',
    priority: initialValues.priority || 'NORMAL',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setFormData({
        title: initialValues.title || '',
        description: initialValues.description || '',
        productId: initialValues.productId || '',
        quantity: initialValues.quantity || '',
        priority: initialValues.priority || 'NORMAL',
      });
    }
  }, [initialValues]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (onDirtyChange) {
        const isDirty = JSON.stringify(updated) !== JSON.stringify({
          title: initialValues.title || '',
          description: initialValues.description || '',
          productId: initialValues.productId || '',
          quantity: initialValues.quantity || '',
          priority: initialValues.priority || 'NORMAL',
        });
        onDirtyChange(isDirty);
      }
      return updated;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const result = validateCustomerRequestForm(formData);
    if (result.errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: result.errors[field] }));
    }
  };

  const handleActionSubmit = (e, isSubmit = false) => {
    e.preventDefault();
    const result = validateCustomerRequestForm(formData);
    if (!result.isValid) {
      setErrors(result.errors);
      setTouched({ title: true, description: true, quantity: true, priority: true });
      return;
    }

    const selectedProduct = products.find((p) => p.id === formData.productId);
    const payload = {
      ...formData,
      productName: selectedProduct ? selectedProduct.name : null,
      isSubmit,
    };

    onSubmit(payload);
  };

  const productOptions = [
    { value: '', label: 'None (Custom Specification / Service Request)' },
    ...products.map((p) => ({ value: p.id, label: `${p.name} (${p.sku})` })),
  ];

  const priorityOptions = REQUEST_PRIORITY_OPTIONS.filter((p) => p.value !== 'ALL');

  return (
    <form className="space-y-6 bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm text-left">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-base font-bold text-slate-900">
          {isEdit ? 'Modify Requirement Request' : 'Submit Commercial Requirement'}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Specify your procurement requirements for review by DealFlow360 commercial sales engineers.
        </p>
      </div>

      {/* Request Title */}
      <Input
        label="Request Title"
        required
        leadingIcon={FileText}
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        onBlur={() => handleBlur('title')}
        error={touched.title && errors.title}
        placeholder="e.g. Enterprise Server Rack 42U Procurement Requirement"
        helperText="Brief descriptive title for this requirement proposal."
      />

      {/* Requirement Details */}
      <Textarea
        label="Requirement Specifications & Details"
        required
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        onBlur={() => handleBlur('description')}
        error={touched.description && errors.description}
        placeholder="Describe product attributes, target delivery timelines, site specifications, or custom requirements..."
        rows={4}
      />

      {/* Product & Quantity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Product Catalogue Reference (Optional)"
          leadingIcon={Package}
          value={formData.productId}
          onChange={(e) => handleChange('productId', e.target.value)}
          options={productOptions}
          helperText="Select a master product SKU if referencing a catalog item."
        />

        <Input
          label="Estimated Units / Quantity (Optional)"
          type="number"
          min="1"
          leadingIcon={Hash}
          value={formData.quantity}
          onChange={(e) => handleChange('quantity', e.target.value)}
          onBlur={() => handleBlur('quantity')}
          error={touched.quantity && errors.quantity}
          placeholder="e.g. 50"
        />
      </div>

      {/* Priority Selection */}
      <div className="w-full md:w-1/2">
        <Select
          label="Procurement Urgency / Priority"
          required
          leadingIcon={AlertOctagon}
          value={formData.priority}
          onChange={(e) => handleChange('priority', e.target.value)}
          options={priorityOptions}
        />
      </div>

      {/* Form Action Controls */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {!isEdit && (
            <Button
              type="button"
              variant="outline"
              isLoading={isSubmitting}
              leftIcon={Save}
              onClick={(e) => handleActionSubmit(e, false)}
            >
              Save Draft
            </Button>
          )}

          <Button
            type="button"
            isLoading={isSubmitting}
            leftIcon={Send}
            onClick={(e) => handleActionSubmit(e, true)}
            className="bg-[#714B67] hover:bg-[#5a3b52] text-white"
          >
            {isEdit ? 'Update Request' : 'Submit to Sales Workflow'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CustomerRequestForm;
