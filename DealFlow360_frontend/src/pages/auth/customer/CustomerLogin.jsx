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

export const CustomerLogin = () => {
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
      setErrorMessage('Please enter your business email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password, 'customer');
      if (success) {
        navigate('/c-entry-x9283f/workspace');
      }
    } catch (err) {
      if (err.code === 'MFA_REQUIRED') {
        navigate('/c-entry-x9283f/mfa');
      } else {
        setErrorMessage(err.message || 'Invalid email or password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSSO = (method) => {
    alert(`Initiating enterprise ${method} Single Sign-On flow...`);
  };

  return (
    <AuthLayout portal="customer" title="Customer Portal Access">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <AlertMessage
            variant="error"
            message={errorMessage}
            onDismiss={() => setErrorMessage(null)}
          />
        )}

        <FormField
          label="Business Email"
          type="email"
          required
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-4 h-4" />}
          portal="customer"
          autoComplete="email"
        />

        <div className="space-y-1">
          <PasswordField
            label="Password"
            required
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            portal="customer"
            autoComplete="current-password"
          />
          <div className="flex justify-end pt-0.5">
            <Link
              to="/c-entry-x9283f/forgot-password"
              className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-bold transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <PrimaryButton
          type="submit"
          portal="customer"
          isLoading={isLoading}
          loadingText="Authenticating..."
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Sign In
        </PrimaryButton>

        <SocialLoginButtons portal="customer" onSelectMethod={handleSocialSSO} />

        <div className="pt-3 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-600 font-medium">
            New account required?{' '}
            <Link
              to="/c-entry-x9283f/signup"
              className="text-blue-600 hover:text-blue-700 font-bold hover:underline transition-colors"
            >
              Create Business Account
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};
