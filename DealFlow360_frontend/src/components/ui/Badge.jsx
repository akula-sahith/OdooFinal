import React from 'react';

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    suspended: 'bg-rose-50 text-rose-700 border-rose-200',
    disabled: 'bg-slate-100 text-slate-600 border-slate-300',
    unverified: 'bg-amber-50 text-amber-700 border-amber-200',
    invited: 'bg-blue-50 text-blue-700 border-blue-200',
    role: 'bg-purple-50 text-[#714B67] border-purple-200 font-mono font-bold',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold border rounded-md shadow-xs ${variantStyles[variant] || variantStyles.neutral} ${sizeStyles[size]} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{children}</span>
    </span>
  );
};
