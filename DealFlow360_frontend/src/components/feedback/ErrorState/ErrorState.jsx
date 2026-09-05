import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from '../../ui/Button';

/**
 * Reusable ErrorState Component
 * Never exposes database errors, stack traces, or technical secrets.
 */
export const ErrorState = ({
  title = 'Something went wrong',
  description = "We couldn't load this information. Please try refreshing or check back later.",
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center max-w-md mx-auto ${className}`}>
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-100 shadow-xs">
        <AlertCircle className="w-7 h-7 stroke-[1.5]" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading mb-1">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed mb-6">
        {message || description}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="md"
          leadingIcon={RefreshCw}
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
