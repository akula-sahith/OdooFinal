import React from 'react';
import { CheckCircle2, XCircle, MessageSquarePlus, Clock, AlertTriangle } from 'lucide-react';

export const QuotationActionPanel = ({
  quotation,
  isActionable,
  submitting,
  onOpenAccept,
  onOpenReject,
  onOpenRequestChanges,
}) => {
  if (!quotation) return null;

  const status = quotation.status;

  if (status === 'ACCEPTED') {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">Quotation Accepted</h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              Accepted on {new Date(quotation.acceptedAt || Date.now()).toLocaleDateString()} by {quotation.acceptedBy || 'Customer'}.
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-emerald-600 text-white font-semibold text-xs rounded-lg shadow-sm">
          Accepted
        </span>
      </div>
    );
  }

  if (status === 'REJECTED') {
    return (
      <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">Quotation Declined / Rejected</h4>
            {quotation.rejectionReason && (
              <p className="text-xs text-rose-700 dark:text-rose-300 italic">
                "{quotation.rejectionReason}"
              </p>
            )}
            <p className="text-[11px] text-rose-600 dark:text-rose-400">
              Rejected on {new Date(quotation.rejectedAt || Date.now()).toLocaleDateString()}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'EXPIRED') {
    return (
      <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-center gap-3">
        <Clock className="w-5 h-5 text-slate-500 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Quotation Expired</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            This commercial quotation passed its validity window on {quotation.validUntil}. Please contact your sales executive to request a fresh proposal.
          </p>
        </div>
      </div>
    );
  }

  if (!isActionable) {
    return (
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl p-4 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">Proposal Pending Internal Processing</h4>
          <p className="text-xs text-amber-700 dark:text-amber-300">
            This quotation is currently undergoing commercial review. Actions will become available once published.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Review & Respond to Commercial Proposal</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Valid until <strong className="text-slate-700 dark:text-slate-300">{quotation.validUntil}</strong>. You can accept, reject, or request commercial changes.
        </p>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <button
          onClick={onOpenRequestChanges}
          disabled={submitting}
          className="flex-1 md:flex-none px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Request Changes</span>
        </button>

        <button
          onClick={onOpenReject}
          disabled={submitting}
          className="flex-1 md:flex-none px-4 py-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800 font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
        >
          <XCircle className="w-4 h-4" />
          <span>Reject</span>
        </button>

        <button
          onClick={onOpenAccept}
          disabled={submitting}
          className="flex-1 md:flex-none px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Accept Proposal</span>
        </button>
      </div>
    </div>
  );
};
