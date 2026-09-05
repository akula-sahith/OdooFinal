import React, { forwardRef, useId } from 'react';

/**
 * Reusable Radio Component
 */
export const Radio = forwardRef(({
  label,
  description,
  disabled = false,
  checked = false,
  onChange,
  name,
  value,
  className = '',
  id: customId,
  ...props
}, ref) => {
  const generatedId = useId();
  const radioId = customId || generatedId;

  return (
    <label htmlFor={radioId} className={`inline-flex items-start gap-3 select-none cursor-pointer text-left ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}>
      <div className="relative flex items-center justify-center pt-0.5">
        <input
          ref={ref}
          id={radioId}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className="sr-only peer"
          {...props}
        />
        <div
          className={`w-5 h-5 rounded-full border transition-all duration-150 flex items-center justify-center peer-focus-visible:ring-2 peer-focus-visible:ring-[#714B67] peer-focus-visible:ring-offset-2 ${
            checked
              ? 'border-[#714B67] bg-white'
              : 'border-slate-300 bg-white hover:border-slate-400'
          } ${className}`}
        >
          {checked && (
            <div className="w-2.5 h-2.5 rounded-full bg-[#714B67]" />
          )}
        </div>
      </div>

      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-semibold text-slate-800">
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
  );
});

Radio.displayName = 'Radio';

/**
 * Reusable RadioGroup Wrapper Component
 */
export const RadioGroup = ({
  label,
  helperText,
  error,
  options = [], // [{ value: '1', label: 'Option 1', description: 'Desc' }]
  value,
  onChange,
  name,
  disabled = false,
  className = '',
}) => {
  const groupName = name || useId();

  return (
    <div className={`w-full space-y-2 text-left ${className}`}>
      {label && (
        <span className="block text-xs sm:text-sm font-semibold text-slate-700 select-none">
          {label}
        </span>
      )}
      <div className="space-y-2.5">
        {options.map((opt) => (
          <Radio
            key={opt.value}
            name={groupName}
            value={opt.value}
            label={opt.label}
            description={opt.description}
            checked={value === opt.value}
            disabled={disabled || opt.disabled}
            onChange={(e) => onChange && onChange(e.target.value)}
          />
        ))}
      </div>
      {error ? (
        <p className="text-xs text-rose-600 font-medium pt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 font-medium pt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Radio;
