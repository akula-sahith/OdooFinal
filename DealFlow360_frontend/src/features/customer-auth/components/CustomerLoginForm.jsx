import React, { useState } from 'react';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { Input } from '../../../components/ui/Input/Input';
import { Button } from '../../../components/ui/Button/Button';
import { validateCustomerLogin } from '../validation/customerAuthValidation';

/**
 * CustomerLoginForm Component
 * Renders email/password credentials input for B2B Client Portal authentication.
 */
export const CustomerLoginForm = ({
  onSubmit,
  onNavigateSignup,
  onNavigateForgotPassword,
  isSubmitting = false,
  apiError = null,
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
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
    const result = validateCustomerLogin(formData);
    if (result.errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: result.errors[field] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = validateCustomerLogin(formData);
    if (!result.isValid) {
      setErrors(result.errors);
      setTouched({ email: true, password: true });
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      {apiError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
          {apiError}
        </div>
      )}

      <Input
        label="Work Email Address"
        type="email"
        required
        leadingIcon={Mail}
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        onBlur={() => handleBlur('email')}
        error={touched.email && errors.email}
        placeholder="e.g. procurement@acmecorp.com"
        autoComplete="email"
      />

      <Input
        label="Password"
        type="password"
        required
        leadingIcon={Lock}
        value={formData.password}
        onChange={(e) => handleChange('password', e.target.value)}
        onBlur={() => handleBlur('password')}
        error={touched.password && errors.password}
        placeholder="••••••••••••"
        autoComplete="current-password"
      />

      <div className="flex items-center justify-between text-xs pt-1">
        <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium select-none">
          <input
            type="checkbox"
            checked={formData.rememberMe}
            onChange={(e) => handleChange('rememberMe', e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-[#714B67] focus:ring-[#714B67]/20"
          />
          Remember this device
        </label>

        {onNavigateForgotPassword && (
          <button
            type="button"
            onClick={onNavigateForgotPassword}
            className="text-[#714B67] hover:underline font-semibold cursor-pointer"
          >
            Forgot password?
          </button>
        )}
      </div>

      <Button
        type="submit"
        isLoading={isSubmitting}
        leftIcon={LogIn}
        className="w-full bg-[#714B67] hover:bg-[#5a3b52] text-white py-2.5"
      >
        {isSubmitting ? 'Signing in...' : 'Sign In to Customer Portal'}
      </Button>

      {onNavigateSignup && (
        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Don't have a B2B procurement account?{' '}
          <button
            type="button"
            onClick={onNavigateSignup}
            className="text-[#714B67] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            Create Account <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </form>
  );
};

export default CustomerLoginForm;
