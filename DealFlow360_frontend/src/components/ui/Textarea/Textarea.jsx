import React, { forwardRef, useId } from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Reusable Textarea Component
 * Features character counter, error states, and resize control.
 */
export const Textarea = forwardRef(({
  label,
  helperText,
  error,
  required = false,
  disabled = false,
  readOnly = false,
  maxLength,
  value,
  defaultValue,
  onChange,
  rows = 4,
  resize = 'vertical', // none | vertical | horizontal | both
  className = '',
  containerClassName = '',
  id: customId,
  ...props
}, ref) => {
  const generatedId = useId();
  const textareaId = customId || generatedId;
  const errorId = `${textareaId}-error`;
  const helperId = `${textareaId}-helper`;

  // Track character count if maxLength is provided
  const currentLength = typeof value === 'string' ? value.length : (typeof defaultValue === 'string' ? defaultValue.length : 0);

  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  };

  const statusBorderClasses = error
    ? 'border-rose-500 text-rose-900 focus:border-rose-500 focus:ring-rose-500/15 bg-rose-50/10'
    : 'border-slate-300 hover:border-slate-400 focus:border-[#714B67] focus:ring-[#714B67]/15';

  return (
    <div className={`w-full space-y-1.5 text-left ${containerClassName}`}>
      <div className="flex items-center justify-between">
        {label && (
          <label htmlFor={textareaId} className="block text-xs sm:text-sm font-semibold text-slate-700 select-none">
            {label} {required && <span className="text-rose-500 font-extrabold">*</span>}
          </label>
        )}
        {maxLength && (
          <span className="text-xs text-slate-400 font-medium">
            {currentLength}/{maxLength}
          </span>
        )}
      </div>

      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        className={`w-full p-3.5 text-sm text-slate-900 bg-white border rounded-xl placeholder-slate-400 font-medium transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-60 disabled:bg-slate-100 disabled:cursor-not-allowed read-only:bg-slate-50 ${
          resizeClasses[resize] || resizeClasses.vertical
        } ${statusBorderClasses} ${className}`}
        {...props}
      />

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

Textarea.displayName = 'Textarea';
export default Textarea;
