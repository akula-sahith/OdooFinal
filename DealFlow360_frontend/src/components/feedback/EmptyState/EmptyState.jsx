import React from 'react';
import { FolderOpen } from 'lucide-react';

/**
 * Reusable EmptyState Component
 * Structure: Icon/Illustration + Title + Description + Optional Action
 */
export const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No records found',
  description = 'There are no items to display right now.',
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center max-w-md mx-auto ${className}`}>
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#F7F2F5] text-[#714B67] flex items-center justify-center mb-4 shadow-xs border border-[#714B67]/20">
        <Icon className="w-7 h-7 stroke-[1.5]" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading mb-1">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed mb-6">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
