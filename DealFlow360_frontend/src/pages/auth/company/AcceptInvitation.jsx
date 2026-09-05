import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { UserCheck, Lock, AlertOctagon, CheckCircle2, ArrowRight } from 'lucide-react';
import { AuthLayout } from '../../../layouts/AuthLayout';
import { PasswordField } from '../../../components/ui/PasswordField';
import { PasswordStrength } from '../../../components/ui/PasswordStrength';
import { PrimaryButton } from '../../../components/ui/PrimaryButton';
import { SecondaryButton } from '../../../components/ui/SecondaryButton';
import { AlertMessage } from '../../../components/ui/AlertMessage';
import { authService } from '../../../services/auth/authService';
import { useAuth } from '../../../hooks/auth/useAuth';
import { usePasswordValidation } from '../../../hooks/auth/usePasswordValidation';

export const AcceptInvitation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || 'valid_invite';
  const { acceptInvitation } = useAuth();

  const [inviteData, setInviteData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isActivated, setIsActivated] = useState(false);

  const { isValid: isPasswordValid } = usePasswordValidation(password);

  useEffect(() => {
    async function loadInvite() {
      setIsLoading(true);
      try {
        const details = await authService.getInvitationDetails(token);
        setInviteData(details);
      } catch (err) {
        setErrorMessage('Failed to load invitation details.');
      } finally {
        setIsLoading(false);
      }
    }
    loadInvite();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isPasswordValid) {
      setErrorMessage('Password must satisfy all security rules below.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await acceptInvitation(token, password);
      if (success) {
        setIsActivated(true);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Invitation acceptance failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout portal="company" title="Complete Account Setup">
      {isLoading && (
        <div className="py-8 text-center text-sm text-slate-500 font-medium">
          Loading secure invitation details...
        </div>
      )}

      {!isLoading && inviteData && !inviteData.isValid && (
        <div className="text-center space-y-5">
          <div className="mx-auto w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <AlertOctagon className="w-8 h-8" />
          </div>

          <AlertMessage
            variant="error"
            title="Invitation Invalid or Expired"
            message={
              inviteData.isExpired
                ? 'This staff invitation link has expired. Please contact your administrator for a new invite.'
                : inviteData.isUsed
                ? 'This invitation link has already been used. Please sign in instead.'
                : 'The invitation link is invalid or corrupted.'
            }
          />

          <Link to="/m-entry-z7829a/login" className="block pt-2">
            <SecondaryButton portal="company">Return to Company Login</SecondaryButton>
          </Link>
        </div>
      )}

      {!isLoading && inviteData && inviteData.isValid && !isActivated && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMessage && (
            <AlertMessage
              variant="error"
              message={errorMessage}
              onDismiss={() => setErrorMessage(null)}
            />
          )}

          {/* Assigned Role Display — READ ONLY */}
          <div className="p-4 sm:p-5 rounded-2xl bg-purple-50 border border-purple-200 space-y-3 text-left">
            <h4 className="text-xs text-[#714B67] font-bold uppercase tracking-wider">
              Staff Account Invitation
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm pt-2 border-t border-purple-200">
              <div>
                <span className="text-slate-500 block">Full Name:</span>
                <span className="text-slate-900 font-bold">{inviteData.fullName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Work Email:</span>
                <span className="text-slate-900 font-mono font-bold">{inviteData.workEmail}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 block">Assigned Role:</span>
                <span className="text-[#714B67] font-extrabold flex items-center gap-1 mt-0.5">
                  <Lock className="w-3.5 h-3.5" />
                  {inviteData.assignedRole} (Read Only - Assigned by Admin)
                </span>
              </div>
            </div>
          </div>

          <PasswordField
            label="Create Password"
            required
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            portal="company"
          />

          <PasswordStrength password={password} />

          <PasswordField
            label="Confirm Password"
            required
            placeholder="••••••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            portal="company"
          />

          <PrimaryButton
            type="submit"
            portal="company"
            isLoading={isSubmitting}
            loadingText="Activating Account..."
            icon={<UserCheck className="w-4 h-4" />}
          >
            Activate Account
          </PrimaryButton>
        </form>
      )}

      {isActivated && (
        <div className="text-center space-y-5">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold font-heading text-slate-900">Account Activated</h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Your account has been activated with the role of{' '}
              <strong className="text-[#714B67] font-mono">{inviteData?.assignedRole}</strong>.
            </p>
          </div>

          <PrimaryButton
            portal="company"
            onClick={() => navigate('/company/dashboard')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Enter Internal Workspace
          </PrimaryButton>
        </div>
      )}
    </AuthLayout>
  );
};
