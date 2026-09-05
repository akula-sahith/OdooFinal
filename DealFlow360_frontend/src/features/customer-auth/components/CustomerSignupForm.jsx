import React, { useState } from 'react';
import { User, Mail, Building, Phone, Lock, UserPlus, ArrowLeft } from 'lucide-react';
import { Input } from '../../../components/ui/Input/Input';
import { Button } from '../../../components/ui/Button/Button';
import { validateCustomerSignup } from '../validation/customerAuthValidation';

/**
 * CustomerSignupForm Component
 * Renders self-service registration form for new B2B Client Account creation.
 */
export const CustomerSignupForm = ({
  onSubmit,
  onNavigateLogin,
  isSubmitting = false,
  apiError = null,
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const result = validateCustomerSignup(formData);
    if (result.errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: result.errors[field] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = validateCustomerSignup(formData);
    if (!result.isValid) {
      setErrors(result.errors);
      setTouched({
        firstName: true,
        lastName: true,
        email: true,
        companyName: true,
        password: true,
        confirmPassword: true,
        termsAccepted: true,
      });
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      {apiError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
          {apiError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First Name"
          required
          leadingIcon={User}
          value={formData.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
          onBlur={() => handleBlur('firstName')}
          error={touched.firstName && errors.firstName}
          placeholder="e.g. John"
        />

        <Input
          label="Last Name"
          required
          leadingIcon={User}
          value={formData.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
          onBlur={() => handleBlur('lastName')}
          error={touched.lastName && errors.lastName}
          placeholder="e.g. Smith"
        />
      </div>

      <Input
        label="Work Email Address"
        type="email"
        required
        leadingIcon={Mail}
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        onBlur={() => handleBlur('email')}
        error={touched.email && errors.email}
        placeholder="e.g. john.smith@company.com"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Company / Enterprise Name"
          required
          leadingIcon={Building}
          value={formData.companyName}
          onChange={(e) => handleChange('companyName', e.target.value)}
          onBlur={() => handleBlur('companyName')}
          error={touched.companyName && errors.companyName}
          placeholder="e.g. Acme Enterprises Inc."
        />

        <Input
          label="Phone Number"
          leadingIcon={Phone}
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="e.g. +1 (555) 019-2831"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Password"
          type="password"
          required
          leadingIcon={Lock}
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          onBlur={() => handleBlur('password')}
          error={touched.password && errors.password}
          placeholder="Minimum 8 characters"
        />

        <Input
          label="Confirm Password"
          type="password"
          required
          leadingIcon={Lock}
          value={formData.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          onBlur={() => handleBlur('confirmPassword')}
          error={touched.confirmPassword && errors.confirmPassword}
          placeholder="Re-enter password"
        />
      </div>

      <div className="pt-1">
        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 font-medium select-none">
          <input
            type="checkbox"
            checked={formData.termsAccepted}
            onChange={(e) => handleChange('termsAccepted', e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#714B67] focus:ring-[#714B67]/20"
          />
          <span>
            I agree to the Terms of Service and Privacy Policy for DealFlow360 B2B Portal.
          </span>
        </label>
        {touched.termsAccepted && errors.termsAccepted && (
          <p className="text-xs text-rose-600 font-medium mt-1">{errors.termsAccepted}</p>
        )}
      </div>

      <Button
        type="submit"
        isLoading={isSubmitting}
        leftIcon={UserPlus}
        className="w-full bg-[#714B67] hover:bg-[#5a3b52] text-white py-2.5 mt-2"
      >
        {isSubmitting ? 'Registering Account...' : 'Create Customer Account'}
      </Button>

      {onNavigateLogin && (
        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Already registered?{' '}
          <button
            type="button"
            onClick={onNavigateLogin}
            className="text-[#714B67] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Sign In
          </button>
        </div>
      )}
    </form>
  );
};

export default CustomerSignupForm;
