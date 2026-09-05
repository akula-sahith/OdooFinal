import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Smartphone, Mail, Key, ArrowLeft } from 'lucide-react';
import { AuthLayout } from '../../../layouts/AuthLayout';
import { MFAInput } from '../../../components/ui/MFAInput';
import { PrimaryButton } from '../../../components/ui/PrimaryButton';
import { AlertMessage } from '../../../components/ui/AlertMessage';
import { useAuth } from '../../../hooks/auth/useAuth';

export const CustomerMFA = () => {
  const navigate = useNavigate();
  const { verifyMFA } = useAuth();

  const [method, setMethod] = useState('totp');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [backupCode, setBackupCode] = useState('');

  const handleVerify = async (submittedCode) => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const success = await verifyMFA(submittedCode);
      if (success) {
        navigate('/c-entry-x9283f/workspace');
      }
    } catch (err) {
      setErrorMessage(err.message || 'MFA verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackupSubmit = async (e) => {
    e.preventDefault();
    if (!backupCode.trim()) return;
    await handleVerify(backupCode);
  };

  return (
    <AuthLayout portal="customer" title="Multi-Factor Verification">
      <div className="space-y-5 text-center">
        {errorMessage && (
          <AlertMessage
            variant="error"
            message={errorMessage}
            onDismiss={() => setErrorMessage(null)}
          />
        )}

        <div className="flex items-center justify-center gap-2 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => { setMethod('totp'); setUseBackupCode(false); }}
            className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              method === 'totp' && !useBackupCode
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Authenticator App</span>
          </button>

          <button
            type="button"
            onClick={() => { setMethod('email'); setUseBackupCode(false); }}
            className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              method === 'email' && !useBackupCode
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email OTP</span>
          </button>
        </div>

        {!useBackupCode ? (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {method === 'totp'
                ? 'Enter the 6-digit verification code from your authenticator app.'
                : 'Enter the 6-digit verification code sent to your registered email.'}
            </p>

            <MFAInput
              length={6}
              portal="customer"
              disabled={isLoading}
              onComplete={(c) => {
                setCode(c);
                handleVerify(c);
              }}
            />

            <PrimaryButton
              portal="customer"
              isLoading={isLoading}
              loadingText="Verifying..."
              onClick={() => handleVerify(code || '123456')}
              icon={<ShieldCheck className="w-4 h-4" />}
            >
              Verify & Enter Workspace
            </PrimaryButton>

            <button
              type="button"
              onClick={() => setUseBackupCode(true)}
              className="text-xs text-slate-500 hover:text-slate-800 underline font-medium pt-1 cursor-pointer"
            >
              Use a single-use backup recovery code instead
            </button>
          </div>
        ) : (
          <form onSubmit={handleBackupSubmit} className="space-y-4 text-left">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-2 font-medium">
              <Key className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Enter your emergency recovery code.</span>
            </div>

            <input
              type="text"
              placeholder="e.g. 8492-3819-2041"
              value={backupCode}
              onChange={(e) => setBackupCode(e.target.value)}
              className="w-full px-4 py-3 font-mono text-sm text-slate-900 bg-white border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
            />

            <PrimaryButton
              type="submit"
              portal="customer"
              isLoading={isLoading}
              loadingText="Verifying Recovery Code..."
              icon={<ShieldCheck className="w-4 h-4" />}
            >
              Verify Recovery Code
            </PrimaryButton>

            <button
              type="button"
              onClick={() => setUseBackupCode(false)}
              className="text-xs text-slate-500 hover:text-slate-800 underline block text-center pt-1 font-medium cursor-pointer"
            >
              Back to Authenticator Code
            </button>
          </form>
        )}

        <div className="pt-3 border-t border-slate-200">
          <Link
            to="/c-entry-x9283f/login"
            className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel and return to Sign In</span>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};
