import React, { forwardRef, useId } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

/**
 * Reusable Input Component
 * Supports all form input states, icons, labels, and error messages.
 */
export const Input = forwardRef(({
  label,
  helperText,
  error,
  success,
  isLoading = false,
  required = false,
  disabled = false,
  readOnly = false,
  leadingIcon: LeadingIcon,
  trailingIcon: TrailingIcon,
  onTrailingIconClick,
  className = '',
  containerClassName = '',
  type = 'text',
  id: customId,
  ...props
}, ref) => {
  const generatedId = useId();
  const inputId = customId || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  // State Border & Ring Classes
  let statusBorderClasses = 'border-slate-300 hover:border-slate-400 focus:border-[#714B67] focus:ring-[#714B67]/15';
  if (error) {
    statusBorderClasses = 'border-rose-500 text-rose-900 focus:border-rose-500 focus:ring-rose-500/15 bg-rose-50/10';
  } else if (success) {
    statusBorderClasses = 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/15';
  }

  return (
    <div className={`w-full space-y-1.5 text-left ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="block text-xs sm:text-sm font-semibold text-slate-700 select-none">
          {label} {required && <span className="text-rose-500 font-extrabold">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-xs">
        {LeadingIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <LeadingIcon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled || isLoading}
          readOnly={readOnly}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`w-full h-10 sm:h-11 px-3.5 sm:px-4 text-sm text-slate-900 bg-white border rounded-xl placeholder-slate-400 font-medium transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-60 disabled:bg-slate-100 disabled:cursor-not-allowed read-only:bg-slate-50 read-only:cursor-default ${
            LeadingIcon ? 'pl-10' : ''
          } ${TrailingIcon || isLoading || error || success ? 'pr-10' : ''} ${statusBorderClasses} ${className}`}
          {...props}
        />

        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center gap-1.5">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
          ) : error ? (
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          ) : success ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          ) : TrailingIcon ? (
            <button
              type="button"
              tabIndex={onTrailingIconClick ? 0 : -1}
              onClick={onTrailingIconClick}
              className={`text-slate-400 hover:text-slate-600 ${onTrailingIconClick ? 'cursor-pointer' : 'pointer-events-none'}`}
            >
              <TrailingIcon className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>

      {error ? (
        <p id={errorId} className="flex items-center gap-1 text-xs text-rose-600 font-medium pt-0.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-slate-500 font-medium pt-0.5">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
