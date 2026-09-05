import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';
import { AuthLayout } from '../../../layouts/AuthLayout';
import { FormField } from '../../../components/ui/FormField';
import { PasswordField } from '../../../components/ui/PasswordField';
import { PrimaryButton } from '../../../components/ui/PrimaryButton';
import { AlertMessage } from '../../../components/ui/AlertMessage';
import { SocialLoginButtons } from '../../../components/ui/SocialLoginButtons';
import { useAuth } from '../../../hooks/auth/useAuth';

export const CompanyLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter your work email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password, 'company');
      if (success) {
        navigate('/company/dashboard');
      }
    } catch (err) {
      if (err.code === 'MFA_REQUIRED') {
        navigate('/m-entry-z7829a/mfa');
      } else {
        setErrorMessage(
          err.message || 'Invalid credentials or unauthorized account access attempt.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSSO = (method) => {
    alert(`Initiating internal ${method} Single Sign-On flow...`);
  };

  return (
    <AuthLayout portal="company" title="Internal Company Portal">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <AlertMessage
            variant="error"
            message={errorMessage}
            onDismiss={() => setErrorMessage(null)}
          />
        )}

        <FormField
          label="Work Email"
          type="email"
          required
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-4 h-4" />}
          portal="company"
          autoComplete="email"
        />

        <div className="space-y-1">
          <PasswordField
            label="Password"
            required
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            portal="company"
            autoComplete="current-password"
          />
          <div className="flex justify-end pt-0.5">
            <Link
              to="/m-entry-z7829a/forgot-password"
              className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline font-bold transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Quick Staff Role Login Selectors */}
        <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/90 space-y-2 text-left">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            Quick Staff Role Prefill:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('admin@dealflow360.com');
                setPassword('Password123!');
              }}
              className="px-2.5 py-2 rounded-xl bg-white hover:bg-indigo-600 hover:text-white border border-slate-200 text-xs font-bold text-slate-800 transition-all cursor-pointer text-center shadow-2xs group"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('manager@dealflow360.com');
                setPassword('Password123!');
              }}
              className="px-2.5 py-2 rounded-xl bg-white hover:bg-indigo-600 hover:text-white border border-slate-200 text-xs font-bold text-slate-800 transition-all cursor-pointer text-center shadow-2xs group"
            >
              Manager
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('rahul@dealflow360.com');
                setPassword('Password123!');
              }}
              className="px-2.5 py-2 rounded-xl bg-white hover:bg-indigo-600 hover:text-white border border-slate-200 text-xs font-bold text-slate-800 transition-all cursor-pointer text-center shadow-2xs group"
            >
              Sales
            </button>
          </div>
        </div>

        <PrimaryButton
          type="submit"
          portal="company"
          isLoading={isLoading}
          loadingText="Authenticating Staff Access..."
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Sign In
        </PrimaryButton>

        <SocialLoginButtons portal="company" onSelectMethod={handleSocialSSO} />

        <div className="pt-3 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">
            Authorized company personnel only. Staff accounts are assigned via invitation.
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};
