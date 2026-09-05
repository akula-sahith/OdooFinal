import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

/**
 * Single Toast Item Component
 */
export const Toast = ({ id, type = 'info', title, message, onDismiss }) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
  };

  const borders = {
    success: 'border-l-4 border-l-emerald-500',
    error: 'border-l-4 border-l-rose-500',
    warning: 'border-l-4 border-l-amber-500',
    info: 'border-l-4 border-l-blue-500',
  };

  return (
    <div
      className={`w-80 sm:w-96 bg-white border border-slate-200/90 shadow-xl rounded-xl p-4 flex items-start gap-3.5 pointer-events-auto animate-in slide-in-from-right duration-200 text-left ${borders[type] || borders.info}`}
      role="alert"
    >
      {icons[type] || icons.info}
      <div className="grow space-y-0.5">
        {title && (
          <h5 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">
            {title}
          </h5>
        )}
        {message && (
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            {message}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(id)}
        className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default Toast;
