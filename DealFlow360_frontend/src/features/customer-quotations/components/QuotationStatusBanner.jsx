import React from 'react';
import { Calendar, User, Mail, Phone, Clock, FileCheck } from 'lucide-react';
import { CUSTOMER_STATUS_LABELS, CUSTOMER_STATUS_BADGE_VARIANTS } from '../types/customerQuotationTypes';

export const QuotationStatusBanner = ({ quotation }) => {
  if (!quotation) return null;

  const status = quotation.status;
  const label = CUSTOMER_STATUS_LABELS[status] || status;
  const variant = CUSTOMER_STATUS_BADGE_VARIANTS[status] || 'neutral';

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left column: Header & Status */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {quotation.quotationNumber}
            </h1>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border border-current ${
              variant === 'success' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' :
              variant === 'danger' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400' :
              variant === 'warning' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
              variant === 'info' ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400' :
              'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
            }`}>
              {label}
            </span>
            {quotation.version > 1 && (
              <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">
                Version {quotation.version}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
            {quotation.title || 'Official Commercial Quotation Proposal'}
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Issued: <strong className="text-slate-700 dark:text-slate-300">{formatDisplayDate(quotation.publishedAt)}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Valid Until: <strong className="text-slate-700 dark:text-slate-300">{formatDisplayDate(quotation.validUntil)}</strong>
            </span>
            {quotation.requestId && (
              <span className="flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-slate-400" />
                Ref Requirement: <strong className="text-slate-700 dark:text-slate-300">{quotation.requestId}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Right column: Assigned Sales Executive Contact Info */}
        <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 space-y-2 min-w-[260px]">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Assigned Commercial Executive
          </span>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {quotation.salespersonName || 'Sarah Jenkins'}
            </span>
          </div>
          <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 pt-1">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{quotation.salespersonEmail || 's.jenkins@dealflow360.com'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{quotation.salespersonPhone || '+1 (555) 019-2831'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
