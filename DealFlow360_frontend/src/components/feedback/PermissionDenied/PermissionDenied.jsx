import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../ui/Button';

/**
 * Reusable PermissionDenied (403) Component
 * Distinct from 401 unauthenticated.
 */
export const PermissionDenied = ({
  title = 'Access Restricted',
  description = "You don't have permission to access this module or resource. Please contact your company administrator if you believe this is an error.",
  onReturn,
  className = '',
}) => {
  const navigate = useNavigate();

  const handleReturn = () => {
    if (onReturn) {
      onReturn();
    } else {
      navigate('/company/dashboard');
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-16 text-center max-w-lg mx-auto ${className}`}>
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-amber-50 text-amber-700 flex items-center justify-center mb-6 border border-amber-200/80 shadow-sm">
        <ShieldAlert className="w-9 h-9 stroke-[1.5]" />
      </div>
      <span className="px-3 py-1 bg-amber-100/70 text-amber-900 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
        Error 403 • Forbidden
      </span>
      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading mb-2">
        {title}
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed mb-8">
        {description}
      </p>
      <Button
        variant="primary"
        size="md"
        leadingIcon={ArrowLeft}
        onClick={handleReturn}
      >
        Return to Dashboard
      </Button>
    </div>
  );
};

export default PermissionDenied;
