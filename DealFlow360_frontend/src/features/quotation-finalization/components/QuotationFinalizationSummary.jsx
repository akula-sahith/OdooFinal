import React from 'react';
import { FileText, Building2, User, Calendar, DollarSign, CheckCircle2 } from 'lucide-react';

export const QuotationFinalizationSummary = ({ quotation, snapshot }) => {
  if (!quotation) return null;

  const currency = quotation.currency || 'INR';

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const formatDate = (dateStr) => {
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
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm mb-6">
      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
        <FileText className="w-4 h-4 text-primary-500" />
        <span>Commercial Finalization Summary</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Quotation Number & Version */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-700/60 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Proposal Ref
          </span>
          <div className="font-bold text-slate-900 dark:text-white text-base">
            {quotation.quotationNumber}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Accepted Version: <strong className="text-slate-700 dark:text-slate-300">v{quotation.version}</strong>
          </div>
        </div>

        {/* Customer Account */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-700/60 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Accepted Customer Organization
          </span>
          <div className="font-bold text-slate-900 dark:text-white text-sm truncate flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-primary-500 shrink-0" />
            <span className="truncate">{quotation.companyName || quotation.customerName}</span>
          </div>
          <div className="text-xs text-slate-500 truncate">{quotation.customerEmail}</div>
        </div>

        {/* Sales Representative */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-700/60 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Sales Executive
          </span>
          <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-primary-500 shrink-0" />
            <span>{quotation.salespersonName || 'Sarah Jenkins'}</span>
          </div>
          <div className="text-xs text-slate-500">Accepted On: {formatDate(quotation.acceptedAt || quotation.updatedAt)}</div>
        </div>

        {/* Grand Total Contract Value */}
        <div className="p-4 bg-primary-50/60 dark:bg-primary-950/40 rounded-xl border border-primary-100 dark:border-primary-900/60 space-y-1">
          <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider block">
            Final Agreed Total
          </span>
          <div className="font-extrabold text-primary-700 dark:text-primary-300 text-xl">
            {formatCurrency(quotation.grandTotal)}
          </div>
          <div className="text-xs text-primary-600 dark:text-primary-400 font-medium">
            Currency: {currency}
          </div>
        </div>
      </div>
    </div>
  );
};
