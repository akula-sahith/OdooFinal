import React, { forwardRef, useEffect, useRef, useId } from 'react';
import { Check, Minus, AlertCircle } from 'lucide-react';

/**
 * Reusable Checkbox Component
 * Supports checked, unchecked, indeterminate, disabled, and error states with accessible labels.
 */
export const Checkbox = forwardRef(({
  label,
  description,
  error,
  checked = false,
  indeterminate = false,
  disabled = false,
  onChange,
  className = '',
  containerClassName = '',
  id: customId,
  ...props
}, ref) => {
  const generatedId = useId();
  const checkboxId = customId || generatedId;
  const errorId = `${checkboxId}-error`;
  const internalRef = useRef(null);
  const combinedRef = ref || internalRef;

  useEffect(() => {
    if (combinedRef.current) {
      combinedRef.current.indeterminate = Boolean(indeterminate);
    }
  }, [indeterminate, combinedRef]);

  return (
    <div className={`text-left ${containerClassName}`}>
      <label htmlFor={checkboxId} className={`inline-flex items-start gap-3 select-none cursor-pointer ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}>
        <div className="relative flex items-center justify-center pt-0.5">
          <input
            ref={combinedRef}
            id={checkboxId}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={`sr-only peer`}
            {...props}
          />
          <div
            className={`w-5 h-5 rounded-md border transition-all duration-150 flex items-center justify-center peer-focus-visible:ring-2 peer-focus-visible:ring-[#714B67] peer-focus-visible:ring-offset-2 ${
              checked || indeterminate
                ? 'bg-[#714B67] border-[#714B67] text-white shadow-xs'
                : error
                ? 'bg-white border-rose-500'
                : 'bg-white border-slate-300 hover:border-slate-400'
            } ${className}`}
          >
            {indeterminate ? (
              <Minus className="w-3.5 h-3.5 stroke-[3]" />
            ) : checked ? (
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            ) : null}
          </div>
        </div>

        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span className={`text-sm font-semibold ${error ? 'text-rose-900' : 'text-slate-800'}`}>
                {label}
              </span>
            )}
            {description && (
              <span className="text-xs text-slate-500 font-medium">
                {description}
              </span>
            )}
          </div>
        )}
      </label>

      {error && (
        <p id={errorId} className="flex items-center gap-1 text-xs text-rose-600 font-medium pt-1 pl-8">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
export default Checkbox;
