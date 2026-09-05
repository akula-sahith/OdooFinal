import React from 'react';

export const PageHeader = ({
  title,
  subtitle,
  actions,
  badgeText,
  badgeVariant = 'plum',
  className = '',
}) => {
  const badgeColors = {
    plum: 'bg-[#F7F2F5] text-[#714B67] border-[#714B67]/20',
    teal: 'bg-[#E6F6F6] text-[#00A09D] border-[#00A09D]/30',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  return (
    <div className={`w-full flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 mb-6 ${className}`}>
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
            {title}
          </h1>
          {badgeText && (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                badgeColors[badgeVariant] || badgeColors.plum
              }`}
            >
              {badgeText}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-3xl">
            {subtitle}
          </p>
        )}
      </div>

      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  );
};
