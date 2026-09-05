import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { MailCheck, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { AuthLayout } from '../../../layouts/AuthLayout';
import { PrimaryButton } from '../../../components/ui/PrimaryButton';
import { SecondaryButton } from '../../../components/ui/SecondaryButton';
import { AlertMessage } from '../../../components/ui/AlertMessage';
import { authService } from '../../../services/auth/authService';

export const CustomerVerify = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || 'verification_token';

  const [status, setStatus] = useState('verifying');
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    async function runVerification() {
      try {
        await authService.verifyEmail(token);
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setErrorMessage(
          err.message || 'Verification link is invalid or has expired.'
        );
      }
    }
    const timer = setTimeout(runVerification, 800);
    return () => clearTimeout(timer);
  }, [token]);

  return (
    <AuthLayout portal="customer" title="Email Verification">
      {status === 'verifying' && (
        <div className="py-8 text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
          <p className="text-sm text-slate-700 font-medium">Validating security token...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="text-center space-y-5">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <MailCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold font-heading text-slate-900">Email Verified Successfully</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Your business email address has been authenticated. You can now sign in.
            </p>
          </div>

          <PrimaryButton
            portal="customer"
            onClick={() => navigate('/c-entry-x9283f/login')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In to Customer Portal
          </PrimaryButton>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-5 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <AlertCircle className="w-8 h-8" />
          </div>

          <AlertMessage variant="error" message={errorMessage || 'Verification failed'} />

          <div className="space-y-3">
            <SecondaryButton
              portal="customer"
              onClick={() => alert('Verification link sent.')}
            >
              Resend Verification Link
            </SecondaryButton>

            <Link
              to="/c-entry-x9283f/login"
              className="block text-xs text-blue-600 hover:text-blue-700 font-bold pt-2"
            >
              Return to Customer Sign In
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};
