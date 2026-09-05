import React from 'react';

/**
 * Reusable Card Container Component
 * Variants: standard | elevated | interactive | bordered
 */
export const Card = ({
  children,
  variant = 'standard',
  className = '',
  onClick,
  ...props
}) => {
  const variants = {
    standard: 'bg-white border border-slate-200/80 shadow-xs rounded-2xl',
    elevated: 'bg-white border border-slate-200/60 shadow-md rounded-2xl',
    interactive: 'bg-white border border-slate-200/80 shadow-xs rounded-2xl hover:border-[#714B67]/40 hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.995]',
    bordered: 'bg-white border-2 border-slate-200 rounded-2xl',
  };

  return (
    <div
      onClick={onClick}
      className={`text-slate-900 transition-colors overflow-hidden ${variants[variant] || variants.standard} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`p-5 sm:p-6 border-b border-slate-100 flex flex-col gap-1 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '', as: Component = 'h3', ...props }) => (
  <Component className={`text-base sm:text-lg font-bold text-slate-900 tracking-tight font-heading ${className}`} {...props}>
    {children}
  </Component>
);

export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-xs sm:text-sm text-slate-500 font-medium ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-5 sm:p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`p-4 sm:p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-4 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
