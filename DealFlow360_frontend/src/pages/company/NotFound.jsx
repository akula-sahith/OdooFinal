import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';
import { PrimaryButton } from '../../components/ui/PrimaryButton';

export const NotFound = () => {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-6 text-center my-auto">
      <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-200 text-[#714B67] flex items-center justify-center mb-6 shadow-sm">
        <FileQuestion className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-md mb-6">
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
          404 — Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
          The requested page or route does not exist or may have been moved.
        </p>
      </div>

      <Link to="/company/dashboard">
        <PrimaryButton portal="company" fullWidth={false} icon={<Home className="w-4 h-4" />}>
          Return to Dashboard
        </PrimaryButton>
      </Link>
    </div>
  );
};
