import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

/**
 * Reusable Inline Alert Component
 * Displays persistent page-level or section-level feedback banners.
 */
export const Alert = ({
  title,
  children,
  variant = 'info', // info | warning | error | success
  onDismiss,
  action,
  className = '',
}) => {
  const icons = {
    info: <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
  };

  const variants = {
    info: 'bg-blue-50/90 text-blue-900 border-blue-200',
    warning: 'bg-amber-50/90 text-amber-900 border-amber-200',
    error: 'bg-rose-50/90 text-rose-900 border-rose-200',
    success: 'bg-emerald-50/90 text-emerald-900 border-emerald-200',
  };

  return (
    <div
      className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all text-left ${variants[variant] || variants.info} ${className}`}
      role="alert"
    >
      {icons[variant] || icons.info}

      <div className="grow space-y-1">
        {title && (
          <h4 className="text-sm font-bold tracking-tight font-heading">
            {title}
          </h4>
        )}
        {children && (
          <div className="text-xs sm:text-sm font-medium opacity-90 leading-relaxed">
            {children}
          </div>
        )}
        {action && <div className="pt-2">{action}</div>}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 rounded-lg hover:bg-black/5 transition-colors opacity-70 hover:opacity-100"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
