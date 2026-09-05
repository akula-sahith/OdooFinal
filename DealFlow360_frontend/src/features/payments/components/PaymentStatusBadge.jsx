/**
 * Payment Status Badge Component
 * Phase 15 — DealFlow360
 */

import React from 'react';
import {
  CheckCircle2,
  Clock,
  RefreshCw,
  AlertTriangle,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import { PAYMENT_STATUS } from '../types/paymentTypes';

export const PaymentStatusBadge = ({ status, className = '' }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case PAYMENT_STATUS.COMPLETED:
        return { label: 'Completed', icon: CheckCircle2, style: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-extrabold' };
      case PAYMENT_STATUS.PENDING:
        return { label: 'Pending', icon: Clock, style: 'bg-slate-100 text-slate-700 border-slate-200 font-semibold' };
      case PAYMENT_STATUS.PROCESSING:
        return { label: 'Processing', icon: RefreshCw, style: 'bg-sky-50 text-sky-700 border-sky-200 animate-pulse font-semibold' };
      case PAYMENT_STATUS.FAILED:
        return { label: 'Failed', icon: AlertTriangle, style: 'bg-rose-100 text-rose-800 border-rose-300 font-bold' };
      case PAYMENT_STATUS.CANCELLED:
        return { label: 'Cancelled', icon: XCircle, style: 'bg-rose-50 text-rose-700 border-rose-200' };
      case PAYMENT_STATUS.REFUNDED:
        return { label: 'Refunded', icon: RotateCcw, style: 'bg-amber-100 text-amber-900 border-amber-300 font-bold' };
      default:
        return { label: status || 'Unknown', icon: Clock, style: 'bg-slate-100 text-slate-600 border-slate-200' };
    }
  };

  const config = getBadgeConfig();
  const IconComponent = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs rounded-full border ${config.style} ${className}`}
    >
      <IconComponent className="w-3.5 h-3.5 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};
