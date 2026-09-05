import React, { useId } from 'react';
import { AlertCircle } from 'lucide-react';

export const FormField = ({
  label,
  error,
  helperText,
  icon,
  suffixIcon,
  portal = 'customer',
  required = false,
  className = '',
  disabled,
  ...props
}) => {
  const id = useId();
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  const isCustomer = portal === 'customer';

  const ringFocusClass = isCustomer
    ? 'focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15'
    : 'focus:border-[#714B67] focus:ring-2 focus:ring-[#714B67]/15';

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={id} className="block text-xs sm:text-sm font-semibold text-slate-700 tracking-tight">
          {label} {required && <span className="text-rose-500 font-extrabold">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-xs">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}

        <input
          id={id}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`w-full h-10 sm:h-11 px-3.5 sm:px-4 text-xs sm:text-sm text-slate-900 bg-white border border-slate-300/90 rounded-xl placeholder-slate-400 font-medium transition-all duration-200 disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed ${
            icon ? 'pl-9 sm:pl-10' : ''
          } ${suffixIcon ? 'pr-9 sm:pr-10' : ''} ${
            error
              ? 'border-rose-500 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15'
              : `hover:border-slate-400 ${ringFocusClass}`
          } ${className}`}
          {...props}
        />

        {suffixIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">{suffixIcon}</div>
        )}
      </div>

      {error && (
        <p id={errorId} className="flex items-center gap-1 text-[11px] text-rose-600 font-semibold pt-0.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}

      {!error && helperText && (
        <p id={helperId} className="text-[11px] text-slate-500 font-medium pt-0.5">
          {helperText}
        </p>
      )}
    </div>
  );
};
