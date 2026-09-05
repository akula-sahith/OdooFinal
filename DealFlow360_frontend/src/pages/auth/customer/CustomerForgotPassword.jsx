import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { AuthLayout } from '../../../layouts/AuthLayout';
import { FormField } from '../../../components/ui/FormField';
import { PrimaryButton } from '../../../components/ui/PrimaryButton';
import { AlertMessage } from '../../../components/ui/AlertMessage';
import { useAuth } from '../../../hooks/auth/useAuth';

export const CustomerForgotPassword = () => {
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const result = await forgotPassword(email, 'customer');
      setSubmittedMessage(result.message);
    } catch (err) {
      setSubmittedMessage("If an account exists for this email, you'll receive instructions to reset your password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout portal="customer" title="Reset Password">
      {!submittedMessage ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField
            label="Business Email"
            type="email"
            required
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
            portal="customer"
            helperText="Enter the corporate email address associated with your account"
          />

          <PrimaryButton
            type="submit"
            portal="customer"
            isLoading={isLoading}
            loadingText="Sending Instructions..."
            icon={<Send className="w-4 h-4" />}
          >
            Send Reset Instructions
          </PrimaryButton>

          <div className="pt-3 border-t border-slate-200 text-center">
            <Link
              to="/c-entry-x9283f/login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Customer Sign In</span>
            </Link>
          </div>
        </form>
      ) : (
        <div className="space-y-5 text-center">
          <AlertMessage
            variant="info"
            title="Request Received"
            message={submittedMessage}
          />

          <div className="pt-2">
            <Link
              to="/c-entry-x9283f/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Customer Sign In</span>
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};
