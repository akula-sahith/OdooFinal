import React from 'react';
import { History, Eye, ArrowRightLeft, Check, Lock } from 'lucide-react';

export const QuotationVersionHistory = ({
  versions = [],
  onSelectCompare,
  selectedForCompare = [],
}) => {
  if (!versions || versions.length === 0) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <History className="w-4 h-4 text-primary-500" />
          <span>Quotation Version History & Audit Trace</span>
        </h3>
        <span className="text-xs text-slate-500 font-medium">
          {versions.length} Version{versions.length > 1 ? 's' : ''} Recorded
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-6">Version</th>
              <th className="py-3 px-4">Created Timestamp</th>
              <th className="py-3 px-4">Author / Created By</th>
              <th className="py-3 px-4 text-center">Customer Visibility</th>
              <th className="py-3 px-4 text-right">Grand Total</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-6 text-right">Compare Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-sm">
            {versions.map((ver) => {
              const isAccepted = ver.status === 'ACCEPTED' || ver.status === 'COMMERCIALLY_CLOSED';
              const isSelected = selectedForCompare.includes(ver.version);

              return (
                <tr
                  key={ver.quotationVersionId || ver.version}
                  className={`transition ${
                    isAccepted
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 font-semibold'
                      : 'hover:bg-slate-50/60 dark:hover:bg-slate-700/30'
                  }`}
                >
                  <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base">v{ver.version}</span>
                      {isAccepted && (
                        <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] uppercase font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Accepted
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-400">
                    {formatDate(ver.createdAt)}
                  </td>

                  <td className="py-3.5 px-4 text-xs text-slate-700 dark:text-slate-300">
                    {ver.createdBy || 'Sarah Jenkins'}
                  </td>

                  <td className="py-3.5 px-4 text-center text-xs">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 rounded-full font-semibold border border-blue-200 dark:border-blue-800">
                      {ver.customerVisibility || 'PUBLISHED'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-white">
                    {formatCurrency(ver.grandTotal)}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {isAccepted ? (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        Commercially Closed
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {ver.status || 'Superseded'}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => onSelectCompare(ver.version)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ml-auto transition ${
                        isSelected
                          ? 'bg-primary-600 text-white shadow-2xs'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      <span>{isSelected ? 'Selected' : 'Select for Comparison'}</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
