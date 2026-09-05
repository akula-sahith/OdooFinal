import React, { useState } from 'react';
import { Lock, KeyRound, CheckCircle2 } from 'lucide-react';
import { Input } from '../../../components/ui/Input/Input';
import { Button } from '../../../components/ui/Button/Button';
import { validateResetPassword } from '../validation/customerAuthValidation';

/**
 * ResetPasswordForm Component
 * Form for submitting new password credentials with token validation.
 */
export const ResetPasswordForm = ({
  onSubmit,
  onNavigateLogin,
  isSubmitting = false,
  apiError = null,
}) => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = validateResetPassword(formData);
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }
    const success = await onSubmit(formData.password);
    if (success) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="space-y-4 text-center py-2">
        <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Password Updated</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Your Customer Portal account password has been reset successfully. You can now sign in with your new credentials.
        </p>
        <div className="pt-4 border-t border-slate-100">
          <Button variant="primary" onClick={onNavigateLogin} className="w-full bg-[#714B67] hover:bg-[#5a3b52] text-white">
            Proceed to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      {apiError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
          {apiError}
        </div>
      )}

      <Input
        label="New Password"
        type="password"
        required
        leadingIcon={Lock}
        value={formData.password}
        onChange={(e) => handleChange('password', e.target.value)}
        error={errors.password}
        placeholder="Minimum 8 characters"
      />

      <Input
        label="Confirm New Password"
        type="password"
        required
        leadingIcon={Lock}
        value={formData.confirmPassword}
        onChange={(e) => handleChange('confirmPassword', e.target.value)}
        error={errors.confirmPassword}
        placeholder="Re-enter password"
      />

      <Button
        type="submit"
        isLoading={isSubmitting}
        leftIcon={KeyRound}
        className="w-full bg-[#714B67] hover:bg-[#5a3b52] text-white py-2.5"
      >
        {isSubmitting ? 'Updating Password...' : 'Reset Password'}
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
