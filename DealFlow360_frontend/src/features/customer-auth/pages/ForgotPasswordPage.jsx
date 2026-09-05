import React from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { Card } from '../../../components/ui/Card/Card';
import { useCustomerAuth } from '../hooks/useCustomerAuth';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { requestReset, submitting } = useCustomerAuth();

  const handleRequestSubmit = async (email) => {
    return await requestReset(email);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-left bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#714B67] text-white flex items-center justify-center mx-auto shadow-lg shadow-purple-900/30 mb-4 font-black text-xl tracking-tighter">
          D360
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Password Recovery
        </h2>
        <p className="mt-1.5 text-xs text-slate-400 max-w-sm mx-auto">
          Enter your registered work email to receive password reset instructions.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card variant="default" padding="lg" className="bg-white shadow-2xl rounded-2xl">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
            <KeyRound className="w-5 h-5 text-[#714B67]" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Reset Credentials</h3>
              <p className="text-[11px] text-slate-500">Privacy-safe password assistance.</p>
            </div>
          </div>

          <ForgotPasswordForm
            onSubmit={handleRequestSubmit}
            onNavigateLogin={() => navigate('/c-entry-x9283f/login')}
            isSubmitting={submitting}
          />
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
