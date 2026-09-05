import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldAlert, XCircle } from 'lucide-react';
import { DISCOUNT_GOVERNANCE_STATUS } from '../types/quotationTypes';

/**
 * DiscountGovernanceBadge Component
 * Displays governance decision badges matching DealFlow360 design tokens.
 */
export const DiscountGovernanceBadge = ({ decision = 'WITHIN_AUTHORITY', size = 'sm' }) => {
  const configs = {
    [DISCOUNT_GOVERNANCE_STATUS.WITHIN_AUTHORITY]: {
      label: 'Within Authority',
      variant: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
    },
    [DISCOUNT_GOVERNANCE_STATUS.PENDING_MANAGER_APPROVAL]: {
      label: 'Manager Approval Required',
      variant: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: AlertTriangle,
    },
    [DISCOUNT_GOVERNANCE_STATUS.PENDING_FINANCE_APPROVAL]: {
      label: 'Finance Escalation Required',
      variant: 'bg-purple-50 text-[#714B67] border-purple-200',
      icon: ShieldAlert,
    },
    [DISCOUNT_GOVERNANCE_STATUS.REJECTED_BY_POLICY]: {
      label: 'Exceeds Corporate Policy',
      variant: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: XCircle,
    },
    [DISCOUNT_GOVERNANCE_STATUS.NOT_REQUESTED]: {
      label: 'Standard Pricing',
      variant: 'bg-slate-100 text-slate-600 border-slate-200',
      icon: CheckCircle2,
    },
  };

  const config = configs[decision] || configs[DISCOUNT_GOVERNANCE_STATUS.WITHIN_AUTHORITY];
  const IconComponent = config.icon;

  const sizeStyles = size === 'lg' ? 'px-3 py-1 text-xs gap-1.5' : 'px-2 py-0.5 text-[11px] gap-1';

  return (
    <span
      className={`inline-flex items-center font-bold rounded-lg border shadow-2xs ${config.variant} ${sizeStyles}`}
    >
      <IconComponent className="w-3.5 h-3.5 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};
