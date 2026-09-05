import React, { forwardRef, useId } from 'react';
import { ChevronDown, AlertCircle, Loader2, X } from 'lucide-react';

/**
 * Reusable Select Component
 * Features customizable options, clear selection button, loading state, and error handling.
 */
export const Select = forwardRef(({
  label,
  options = [], // [{ value: '1', label: 'Option 1' }] or strings
  placeholder = 'Select an option...',
  helperText,
  error,
  required = false,
  disabled = false,
  isLoading = false,
  isClearable = false,
  value,
  onChange,
  leadingIcon: LeadingIcon,
  className = '',
  containerClassName = '',
  id: customId,
  ...props
}, ref) => {
  const generatedId = useId();
  const selectId = customId || generatedId;
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;

  const normalizedOptions = options.map((opt) =>
    typeof opt === 'object' ? opt : { value: opt, label: String(opt) }
  );

  const handleClear = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (onChange) {
      const syntheticEvent = { target: { value: '', name: props.name } };
      onChange(syntheticEvent);
    }
  };

  const statusBorderClasses = error
    ? 'border-rose-500 text-rose-900 focus:border-rose-500 focus:ring-rose-500/15 bg-rose-50/10'
    : 'border-slate-300 hover:border-slate-400 focus:border-[#714B67] focus:ring-[#714B67]/15';

  const hasValue = value !== undefined && value !== null && value !== '';

  // Calculate dynamic left and right padding to prevent icon & text overlap
  const leftPaddingClass = LeadingIcon ? 'pl-10.5 sm:pl-11' : 'pl-3.5 sm:pl-4';
  const rightPaddingClass = hasValue && isClearable ? 'pr-14' : 'pr-10 sm:pr-10.5';

  return (
    <div className={`w-full space-y-1.5 text-left ${containerClassName}`}>
      {label && (
        <label htmlFor={selectId} className="block text-xs sm:text-sm font-semibold text-slate-700 select-none">
          {label} {required && <span className="text-rose-500 font-extrabold">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-xs">
        {LeadingIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 z-10">
            <LeadingIcon className="w-4 h-4 shrink-0 text-slate-400" />
          </div>
        )}

        <select
          ref={ref}
          id={selectId}
          value={value ?? ''}
          onChange={onChange}
          disabled={disabled || isLoading}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`w-full h-10 sm:h-11 ${leftPaddingClass} ${rightPaddingClass} text-sm bg-white border rounded-xl appearance-none font-medium transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-60 disabled:bg-slate-100 disabled:cursor-not-allowed ${
            !hasValue ? 'text-slate-400' : 'text-slate-900'
          } ${statusBorderClasses} ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {normalizedOptions.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled} className="text-slate-900 bg-white">
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center gap-1.5 pointer-events-none">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
          ) : isClearable && hasValue && !disabled ? (
            <button
              type="button"
              onClick={handleClear}
              className="pointer-events-auto p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
          )}
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

Select.displayName = 'Select';
export default Select;
