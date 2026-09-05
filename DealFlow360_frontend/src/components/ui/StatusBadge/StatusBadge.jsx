import React from 'react';
import { STATUS_DEFINITIONS } from '../../../constants/tokens';

/**
 * Specialized StatusBadge Component
 * Enforces centralized status design across all DealFlow360 business modules.
 */
export const StatusBadge = ({
  status = 'PENDING',
  size = 'md', // sm | md | lg
  showDot = true,
  className = '',
  customLabel,
}) => {
  const upperStatus = String(status).toUpperCase();
  const def = STATUS_DEFINITIONS[upperStatus] || {
    label: status,
    variant: 'neutral',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px] gap-1 rounded-md font-medium',
    md: 'px-2.5 py-0.5 text-xs gap-1.5 rounded-md font-semibold',
    lg: 'px-3 py-1 text-sm gap-2 rounded-lg font-bold',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={`inline-flex items-center border select-none ${def.bg} ${def.text} ${def.border} ${sizes[size] || sizes.md} ${className}`}
    >
      {showDot && (
        <span className={`rounded-full shrink-0 bg-current opacity-80 ${dotSizes[size] || dotSizes.md}`} />
      )}
      <span>{customLabel || def.label}</span>
    </span>
  );
};

export default StatusBadge;
