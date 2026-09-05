import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { KeyRound, CheckCircle2, ArrowRight } from 'lucide-react';
import { AuthLayout } from '../../../layouts/AuthLayout';
import { PasswordField } from '../../../components/ui/PasswordField';
import { PasswordStrength } from '../../../components/ui/PasswordStrength';
import { PrimaryButton } from '../../../components/ui/PrimaryButton';
import { AlertMessage } from '../../../components/ui/AlertMessage';
import { useAuth } from '../../../hooks/auth/useAuth';
import { usePasswordValidation } from '../../../hooks/auth/usePasswordValidation';

export const CustomerResetPassword = () => {
  const navigate = useNavigate();
  const { token = 'token' } = useParams();
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { isValid: isPasswordValid } = usePasswordValidation(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isPasswordValid) {
      setErrorMessage('Password must satisfy all security requirements listed below.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(token, password, 'customer');
      setIsSuccess(true);
    } catch (err) {
      setErrorMessage(
        err.message || 'Password reset failed. The link may be expired or invalid.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout portal="customer" title="Set New Password">
      {!isSuccess ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMessage && (
            <AlertMessage
              variant="error"
              message={errorMessage}
              onDismiss={() => setErrorMessage(null)}
            />
          )}

          <PasswordField
            label="New Password"
            required
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            portal="customer"
          />

          <PasswordStrength password={password} />

          <PasswordField
            label="Confirm New Password"
            required
            placeholder="••••••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            portal="customer"
          />

          <PrimaryButton
            type="submit"
            portal="customer"
            isLoading={isLoading}
            loadingText="Resetting Password..."
            icon={<KeyRound className="w-4 h-4" />}
          >
            Update & Save Password
          </PrimaryButton>
        </form>
      ) : (
        <div className="text-center space-y-5">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold font-heading text-slate-900">Password Updated</h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Your password has been reset successfully. You can now log in with your new credentials.
            </p>
          </div>

          <PrimaryButton
            portal="customer"
            onClick={() => navigate('/c-entry-x9283f/login')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Continue to Customer Sign In
          </PrimaryButton>
        </div>
      )}
    </AuthLayout>
  );
};
