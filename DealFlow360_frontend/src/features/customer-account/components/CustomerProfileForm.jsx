import React, { useState, useEffect } from 'react';
import { User, Mail, Building, Phone, Save, Check } from 'lucide-react';
import { Input } from '../../../components/ui/Input/Input';
import { Button } from '../../../components/ui/Button/Button';
import { validateCustomerProfile } from '../validation/customerAccountValidation';

/**
 * CustomerProfileForm Component
 * Form for updating client contact details and company metadata.
 */
export const CustomerProfileForm = ({
  initialValues = {},
  onSubmit,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState({
    firstName: initialValues.firstName || '',
    lastName: initialValues.lastName || '',
    email: initialValues.email || '',
    phone: initialValues.phone || '',
    companyName: initialValues.companyName || '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setFormData({
        firstName: initialValues.firstName || '',
        lastName: initialValues.lastName || '',
        email: initialValues.email || '',
        phone: initialValues.phone || '',
        companyName: initialValues.companyName || '',
      });
    }
  }, [initialValues]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = validateCustomerProfile(formData);
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm text-left">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-base font-bold text-slate-900">Commercial Contact Profile</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Official contact representative details for commercial proposals and procurement orders.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          required
          leadingIcon={User}
          value={formData.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
          error={errors.firstName}
        />

        <Input
          label="Last Name"
          required
          leadingIcon={User}
          value={formData.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
          error={errors.lastName}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Work Email Address"
          type="email"
          required
          leadingIcon={Mail}
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          helperText="Email used for procurement notifications."
        />

        <Input
          label="Phone Number"
          leadingIcon={Phone}
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="+1 (555) 000-0000"
        />
      </div>

      <Input
        label="Company / Enterprise Name"
        required
        leadingIcon={Building}
        value={formData.companyName}
        onChange={(e) => handleChange('companyName', e.target.value)}
        error={errors.companyName}
      />

      <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
        <Button
          type="submit"
          isLoading={isSubmitting}
          leftIcon={Save}
          className="bg-[#714B67] hover:bg-[#5a3b52] text-white"
        >
          Save Profile Updates
        </Button>
      </div>
    </form>
  );
};

export default CustomerProfileForm;
