import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Calendar, User, FileText, ArrowRight } from 'lucide-react';
import { CUSTOMER_STATUS_LABELS, CUSTOMER_STATUS_BADGE_VARIANTS } from '../types/customerQuotationTypes';

export const CustomerQuotationTable = ({ quotations = [], loading = false }) => {
  const navigate = useNavigate();

  const formatCurrency = (val, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
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

  const renderBadge = (status) => {
    const label = CUSTOMER_STATUS_LABELS[status] || status;
    const variant = CUSTOMER_STATUS_BADGE_VARIANTS[status] || 'neutral';

    const styles = {
      primary: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
      warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
      info: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-400 dark:border-cyan-800',
      purple: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
      success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
      danger: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800',
      neutral: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border ${styles[variant] || styles.neutral}`}>
        {label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-14 bg-slate-100 dark:bg-slate-700/40 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (!quotations || quotations.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
        <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">No Quotations Found</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
          There are currently no active commercial proposals associated with your customer account matching the criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Quotation Number</th>
              <th className="py-3.5 px-4">Sales Representative</th>
              <th className="py-3.5 px-4">Issue Date</th>
              <th className="py-3.5 px-4">Valid Until</th>
              <th className="py-3.5 px-4 text-right">Grand Total</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-sm">
            {quotations.map((q) => (
              <tr
                key={q.quotationId}
                onClick={() => navigate(`/customer/quotations/${q.quotationId}`)}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 cursor-pointer transition"
              >
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    <span>{q.quotationNumber}</span>
                    {q.version > 1 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">
                        v{q.version}
                      </span>
                    )}
                  </div>
                  {q.title && <p className="text-xs font-normal text-slate-500 truncate max-w-xs">{q.title}</p>}
                </td>

                <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{q.salespersonName || 'Sales Executive'}</span>
                  </div>
                </td>

                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-xs">
                  {formatDate(q.publishedAt)}
                </td>

                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-xs">
                  {formatDate(q.validUntil)}
                </td>

                <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-white">
                  {formatCurrency(q.grandTotal, q.currency)}
                </td>

                <td className="py-3.5 px-4 text-center">
                  {renderBadge(q.status)}
                </td>

                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/customer/quotations/${q.quotationId}`);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline"
                  >
                    <span>View Proposal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-700">
        {quotations.map((q) => (
          <div
            key={q.quotationId}
            onClick={() => navigate(`/customer/quotations/${q.quotationId}`)}
            className="p-4 space-y-3 hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-base">
                  {q.quotationNumber}
                  {q.version > 1 && (
                    <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">
                      v{q.version}
                    </span>
                  )}
                </div>
                {q.title && <p className="text-xs text-slate-500 mt-0.5">{q.title}</p>}
              </div>
              {renderBadge(q.status)}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Salesperson</span>
                <span className="font-medium">{q.salespersonName || 'Sarah Jenkins'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Valid Until</span>
                <span className="font-medium">{formatDate(q.validUntil)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
              <span className="text-xs font-semibold text-slate-500">Grand Total:</span>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {formatCurrency(q.grandTotal, q.currency)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
