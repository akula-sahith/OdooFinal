import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';

export const ErrorState = ({
  title = 'Something went wrong',
  message = "We couldn't load this section. Please check your connection and try again.",
  onRetry,
  showHomeLink = true,
  portal = 'company',
}) => {
  return (
    <div className="w-full p-8 sm:p-12 text-center rounded-2xl bg-white border border-rose-200/80 shadow-2xs flex flex-col items-center justify-center my-6">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4 shadow-2xs">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto mb-6 leading-relaxed">
        {message}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        {onRetry && (
          <PrimaryButton
            portal={portal}
            onClick={onRetry}
            fullWidth={false}
            icon={<RotateCcw className="w-4 h-4" />}
          >
            Try Again
          </PrimaryButton>
        )}

        {showHomeLink && (
          <Link to="/company/dashboard">
            <SecondaryButton
              portal={portal}
              fullWidth={false}
              icon={<Home className="w-4 h-4" />}
            >
              Return to Dashboard
            </SecondaryButton>
          </Link>
        )}
      </div>
    </div>
  );
};
