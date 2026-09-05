import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable DealFlow360 Button Component
 * Single source of truth for all action buttons across all DealFlow360 modules.
 */
export const Button = forwardRef(({
  children,
  type = 'button',
  variant = 'primary', // primary | secondary | outline | ghost | danger | success | link
  size = 'md',        // sm | md | lg
  isLoading = false,
  loadingText,
  disabled = false,
  leadingIcon: LeadingIcon,
  trailingIcon: TrailingIcon,
  className = '',
  onClick,
  fullWidth = false,
  ...props
}, ref) => {
  // Prevent click when loading or disabled
  const handleClick = (e) => {
    if (disabled || isLoading) {
      e.preventDefault();
      return;
    }
    if (onClick) onClick(e);
  };

  // Base layout and focus states
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none shrink-0 select-none';

  // Variant Styles matching DealFlow360 Design Language
  const variants = {
    primary: 'bg-[#714B67] text-white hover:bg-[#56384E] active:bg-[#432A3C] focus-visible:ring-[#714B67] shadow-sm hover:shadow active:scale-[0.99]',
    secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 focus-visible:ring-slate-400 border border-slate-200/80',
    outline: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 focus-visible:ring-[#714B67]',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200 focus-visible:ring-slate-400',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 focus-visible:ring-rose-500 shadow-sm',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 focus-visible:ring-emerald-500 shadow-sm',
    link: 'bg-transparent text-[#714B67] hover:underline focus-visible:ring-[#714B67] p-0 h-auto font-semibold',
  };

  // Size Specifications
  const sizes = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-10 px-4 text-sm gap-2',
    lg: 'h-12 px-6 text-base gap-2.5',
  };

  // Icon sizing based on button size
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const isLink = variant === 'link';
  const sizeClass = isLink ? '' : (sizes[size] || sizes.md);
  const variantClass = variants[variant] || variants.primary;
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      onClick={handleClick}
      aria-busy={isLoading}
      className={`${baseClasses} ${variantClass} ${sizeClass} ${widthClass} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className={`animate-spin ${iconSizes[size] || 'w-4 h-4'} shrink-0`} />
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {LeadingIcon && <LeadingIcon className={`${iconSizes[size] || 'w-4 h-4'} shrink-0`} />}
          {children && <span className="inline-flex items-center gap-2 whitespace-nowrap">{children}</span>}
          {TrailingIcon && <TrailingIcon className={`${iconSizes[size] || 'w-4 h-4'} shrink-0`} />}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
