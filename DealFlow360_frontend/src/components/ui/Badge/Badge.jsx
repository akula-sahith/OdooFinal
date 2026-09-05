import React from 'react';
import { X } from 'lucide-react';

/**
 * Reusable Badge Component
 * Variants: neutral | success | warning | error | info | plum
 */
export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md', // sm | md | lg
  dot = false,
  onRemove,
  className = '',
  ...props
}) => {
  const variants = {
    neutral: 'bg-slate-100 text-slate-700 border-slate-200/80',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    error: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    plum: 'bg-[#F7F2F5] text-[#714B67] border-[#714B67]/25',
  };

  const dotColors = {
    neutral: 'bg-slate-400',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-rose-500',
    info: 'bg-blue-500',
    plum: 'bg-[#714B67]',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px] gap-1 rounded-md',
    md: 'px-2.5 py-0.5 text-xs gap-1.5 rounded-md font-medium',
    lg: 'px-3 py-1 text-sm gap-2 rounded-lg font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center border select-none ${variants[variant] || variants.neutral} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant] || dotColors.neutral}`} />
      )}
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 hover:opacity-75 focus:outline-none"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

export default Badge;
