import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { SecondaryButton } from '../../components/ui/SecondaryButton';
import { useAuth } from '../../hooks/auth/useAuth';

export const PermissionDenied = () => {
  const { role } = useAuth();

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-6 text-center my-auto">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-6 shadow-sm">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-md mb-6">
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
          403 — Access Restricted
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
          Your account role (<span className="font-bold text-[#714B67]">{role || 'Company User'}</span>) does not have authorization to view this area or perform this action.
        </p>
      </div>

      <div className="p-3.5 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-500 text-xs font-semibold max-w-sm mb-6">
        <span>Backend RBAC Policy Enforced</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link to="/company/dashboard">
          <PrimaryButton portal="company" fullWidth={false} icon={<Home className="w-4 h-4" />}>
            Return to Dashboard
          </PrimaryButton>
        </Link>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="w-full sm:w-auto"
        >
          <SecondaryButton portal="company" fullWidth={false} icon={<ArrowLeft className="w-4 h-4" />}>
            Go Back
          </SecondaryButton>
        </button>
      </div>
    </div>
  );
};
