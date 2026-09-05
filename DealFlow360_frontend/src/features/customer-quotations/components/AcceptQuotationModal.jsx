import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export const AcceptQuotationModal = ({
  isOpen,
  onClose,
  onConfirm,
  quotation,
  submitting,
  error,
}) => {
  if (!isOpen || !quotation) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: quotation.currency || 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-950/30">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Accept Quotation Proposal</h3>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            By accepting, you agree to the commercial pricing and terms specified in this official proposal version.
          </p>

          {/* Quotation Summary Card */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Quotation Number:</span>
              <strong className="text-slate-900 dark:text-white font-mono">{quotation.quotationNumber}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Proposal Version:</span>
              <strong className="text-slate-900 dark:text-white">Version {quotation.version}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Valid Until:</span>
              <strong className="text-slate-900 dark:text-white">{quotation.validUntil}</strong>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-sm font-bold">
              <span className="text-slate-700 dark:text-slate-300">Total Contract Value:</span>
              <span className="text-primary-600 dark:text-primary-400 text-base">{formatCurrency(quotation.grandTotal)}</span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={submitting}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition disabled:opacity-50"
          >
            {submitting ? 'Processing...' : 'Confirm & Accept Quotation'}
          </button>
        </div>
      </div>
    </div>
  );
};
