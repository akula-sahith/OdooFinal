import React from 'react';

/**
 * Reusable SectionHeader Component
 * Keeps hierarchy consistent inside cards, forms, detail pages, and settings.
 */
export const SectionHeader = ({
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100 text-left ${className}`}>
      <div className="space-y-0.5">
        <h2 className="text-base font-bold text-slate-900 font-heading">
          {title}
        </h2>
        {description && (
          <p className="text-xs text-slate-500 font-medium">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0 pt-1 sm:pt-0">{action}</div>}
    </div>
  );
};

export default SectionHeader;
