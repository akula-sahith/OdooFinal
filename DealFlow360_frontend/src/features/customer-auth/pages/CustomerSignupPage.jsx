import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserPlus } from 'lucide-react';
import { Card } from '../../../components/ui/Card/Card';
import { useCustomerAuth } from '../hooks/useCustomerAuth';
import { CustomerSignupForm } from '../components/CustomerSignupForm';

export const CustomerSignupPage = () => {
  const navigate = useNavigate();
  const { registerCustomer, submitting, error } = useCustomerAuth();

  const handleSignupSubmit = async (formData) => {
    const result = await registerCustomer(formData);
    if (result.success) {
      navigate('/customer/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-left bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#714B67] text-white flex items-center justify-center mx-auto shadow-lg shadow-purple-900/30 mb-4 font-black text-xl tracking-tighter">
          D360
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Register B2B Account
        </h2>
        <p className="mt-1.5 text-xs text-slate-400 max-w-md mx-auto">
          Set up your commercial enterprise procurement profile for DealFlow360 proposals.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <Card variant="default" padding="lg" className="bg-white shadow-2xl rounded-2xl">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
            <UserPlus className="w-5 h-5 text-[#714B67]" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Commercial Registration</h3>
              <p className="text-[11px] text-slate-500">All fields marked with * are required.</p>
            </div>
          </div>

          <CustomerSignupForm
            onSubmit={handleSignupSubmit}
            onNavigateLogin={() => navigate('/c-entry-x9283f/login')}
            isSubmitting={submitting}
            apiError={error}
          />
        </Card>

        <div className="mt-6 text-center flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Encrypted B2B Identity • Corporate Privacy Safeguards</span>
        </div>
      </div>
    </div>
  );
};

export default CustomerSignupPage;
