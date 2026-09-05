/**
 * Invoice Status Badge Component
 * Phase 14 — DealFlow360
 */

import React from 'react';
import {
  FileText,
  Send,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Ban,
  XCircle,
} from 'lucide-react';
import { INVOICE_STATUS } from '../types/invoiceTypes';

export const InvoiceStatusBadge = ({ status, className = '' }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case INVOICE_STATUS.DRAFT:
        return { label: 'Draft', icon: FileText, style: 'bg-slate-100 text-slate-700 border-slate-200 font-bold' };
      case INVOICE_STATUS.ISSUED:
        return { label: 'Issued', icon: Send, style: 'bg-[#F7F2F5] text-[#714B67] border-[#714B67]/30 font-bold' };
      case INVOICE_STATUS.PARTIALLY_PAID:
        return { label: 'Partially Paid', icon: Clock, style: 'bg-amber-50 text-amber-800 border-amber-200 font-bold' };
      case INVOICE_STATUS.PAID:
        return { label: 'Paid', icon: CheckCircle2, style: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-black' };
      case INVOICE_STATUS.OVERDUE:
        return { label: 'Overdue', icon: AlertTriangle, style: 'bg-rose-100 text-rose-800 border-rose-300 font-extrabold' };
      case INVOICE_STATUS.VOID:
        return { label: 'Void', icon: Ban, style: 'bg-zinc-100 text-zinc-600 border-zinc-300' };
      case INVOICE_STATUS.CANCELLED:
        return { label: 'Cancelled', icon: XCircle, style: 'bg-rose-50 text-rose-700 border-rose-200' };
      default:
        return { label: status || 'Unknown', icon: FileText, style: 'bg-slate-100 text-slate-600 border-slate-200' };
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
