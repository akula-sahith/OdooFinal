import React, { useState } from 'react';
import { Mail, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Input } from '../../../components/ui/Input/Input';
import { Button } from '../../../components/ui/Button/Button';
import { validateForgotPassword } from '../validation/customerAuthValidation';

/**
 * ForgotPasswordForm Component
 * Renders privacy-safe password reset request interface.
 */
export const ForgotPasswordForm = ({
  onSubmit,
  onNavigateLogin,
  isSubmitting = false,
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = validateForgotPassword({ email });
    if (!result.isValid) {
      setError(result.errors.email);
      return;
    }
    setError(null);
    await onSubmit(email);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="space-y-4 text-center py-2">
        <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Request Dispatched</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          If a B2B Customer Portal account exists for <span className="font-semibold text-slate-800">{email}</span>, password recovery instructions have been sent.
        </p>
        <div className="pt-4 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onNavigateLogin} className="w-full">
            Back to Customer Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <Input
        label="Work Email Address"
        type="email"
        required
        leadingIcon={Mail}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (error) setError(null);
        }}
        error={error}
        placeholder="e.g. procurement@acmecorp.com"
      />

      <Button
        type="submit"
        isLoading={isSubmitting}
        leftIcon={KeyRound}
        className="w-full bg-[#714B67] hover:bg-[#5a3b52] text-white py-2.5"
      >
        {isSubmitting ? 'Sending Request...' : 'Send Password Reset Instructions'}
      </Button>

      {onNavigateLogin && (
        <div className="pt-4 border-t border-slate-100 text-center text-xs">
          <button
            type="button"
            onClick={onNavigateLogin}
            className="text-slate-600 font-semibold hover:text-[#714B67] inline-flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </button>
        </div>
      )}
    </form>
  );
};

export default ForgotPasswordForm;
