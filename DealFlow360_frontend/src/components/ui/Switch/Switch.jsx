import React, { useId } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Switch Component
 * Useful for settings, preferences, and feature flags.
 */
export const Switch = ({
  checked = false,
  onChange,
  disabled = false,
  isLoading = false,
  label,
  description,
  size = 'md', // sm | md
  className = '',
  id: customId,
}) => {
  const generatedId = useId();
  const switchId = customId || generatedId;

  const handleToggle = () => {
    if (disabled || isLoading) return;
    if (onChange) onChange(!checked);
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  const sizes = {
    sm: { track: 'w-8 h-4.5 p-0.5', thumb: 'w-3.5 h-3.5', translate: 'translate-x-3.5' },
    md: { track: 'w-11 h-6 p-0.5', thumb: 'w-5 h-5', translate: 'translate-x-5' },
  };

  const currentSize = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center justify-between gap-4 select-none ${className}`}>
      {(label || description) && (
        <div className="flex flex-col text-left">
          {label && (
            <label htmlFor={switchId} className={`text-sm font-semibold cursor-pointer ${disabled ? 'text-slate-400 cursor-not-allowed' : 'text-slate-800'}`}>
              {label}
            </label>
          )}
          {description && (
            <span className="text-xs text-slate-500 font-medium">
              {description}
            </span>
          )}
        </div>
      )}

      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled || isLoading}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={`relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#714B67] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          checked ? 'bg-[#714B67]' : 'bg-slate-200 hover:bg-slate-300'
        } ${currentSize.track}`}
      >
        <span className="sr-only">{label || 'Toggle switch'}</span>
        <span
          className={`pointer-events-none inline-block rounded-full bg-white shadow-xs transform ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
            checked ? currentSize.translate : 'translate-x-0'
          } ${currentSize.thumb}`}
        >
          {isLoading && (
            <Loader2 className="w-3 h-3 animate-spin text-[#714B67]" />
          )}
        </span>
      </button>
    </div>
  );
};

export default Switch;
