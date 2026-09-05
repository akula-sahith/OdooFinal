import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Card } from '../../../components/ui/Card/Card';
import { useCustomerAuth } from '../hooks/useCustomerAuth';
import { ResetPasswordForm } from '../components/ResetPasswordForm';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const { performReset, submitting, error } = useCustomerAuth();

  const handleResetSubmit = async (newPassword) => {
    const result = await performReset(token || 'dummy_token', newPassword);
    return result.success;
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-left bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#714B67] text-white flex items-center justify-center mx-auto shadow-lg shadow-purple-900/30 mb-4 font-black text-xl tracking-tighter">
          D360
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Set New Password
        </h2>
        <p className="mt-1.5 text-xs text-slate-400 max-w-sm mx-auto">
          Please enter your new customer account password below.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card variant="default" padding="lg" className="bg-white shadow-2xl rounded-2xl">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
            <Lock className="w-5 h-5 text-[#714B67]" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Update Credentials</h3>
              <p className="text-[11px] text-slate-500">Enter minimum 8 characters.</p>
            </div>
          </div>

          <ResetPasswordForm
            onSubmit={handleResetSubmit}
            onNavigateLogin={() => navigate('/c-entry-x9283f/login')}
            isSubmitting={submitting}
            apiError={error}
          />
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
