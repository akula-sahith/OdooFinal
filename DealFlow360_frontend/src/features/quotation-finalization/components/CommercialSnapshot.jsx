import React from 'react';
import { Lock, ShieldCheck, Package, FileText } from 'lucide-react';

export const CommercialSnapshot = ({ snapshot }) => {
  if (!snapshot) return null;

  const items = snapshot.items || [];
  const currency = snapshot.currency || 'INR';

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(val || 0);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-emerald-500/40 dark:border-emerald-500/30 shadow-md overflow-hidden mb-6">
      {/* Header lock bar */}
      <div className="px-6 py-4 bg-emerald-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-sm uppercase tracking-wider">
            Accepted Commercial Snapshot (Frozen Record)
          </h3>
        </div>
        <span className="text-xs bg-emerald-800 px-3 py-1 rounded-full font-mono text-emerald-200">
          Snapshot ID: {snapshot.snapshotId}
        </span>
      </div>

      {/* Snapshot products table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-6">SKU / Item Description</th>
              <th className="py-3 px-4 text-center">Category</th>
              <th className="py-3 px-4 text-center">Quantity</th>
              <th className="py-3 px-4 text-right">Unit Price</th>
              <th className="py-3 px-6 text-right">Line Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-sm">
            {items.map((item, idx) => (
              <tr key={item.quotationItemId || idx} className="hover:bg-slate-50/40">
                <td className="py-3.5 px-6">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {item.productNameSnapshot || item.productName}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    {item.skuSnapshot || item.sku || 'SKU-STD'}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center text-xs text-slate-600 dark:text-slate-400">
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300 font-medium">
                    {item.categorySnapshot || 'Standard'}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center font-semibold text-slate-800 dark:text-slate-200">
                  {item.quantity}
                </td>
                <td className="py-3.5 px-4 text-right text-slate-700 dark:text-slate-300">
                  {formatCurrency(item.unitBasePrice)}
                </td>
                <td className="py-3.5 px-6 text-right font-bold text-slate-900 dark:text-white">
                  {formatCurrency(item.netLineAmount || item.lineTotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Snapshot Summary Totals */}
      <div className="p-6 bg-slate-50/60 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="text-xs text-slate-500 space-y-1 max-w-md">
          <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Commercial Terms & Validity</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 italic">
            "{snapshot.commercialTerms || 'Standard Net 30 Commercial Agreement'}"
          </p>
          <p className="text-[11px] text-slate-400">
            Accepted by {snapshot.acceptedBy} on {new Date(snapshot.acceptedAt).toLocaleString()}.
          </p>
        </div>

        <div className="w-full md:w-80 space-y-2 text-sm">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Subtotal:</span>
            <span className="font-medium">{formatCurrency(snapshot.subtotal)}</span>
          </div>

          {snapshot.discountTotal > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
              <span>Applied Discount:</span>
              <span className="font-medium">-{formatCurrency(snapshot.discountTotal)}</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-base font-bold text-slate-900 dark:text-white">
            <span>Grand Total:</span>
            <span className="text-xl text-emerald-600 dark:text-emerald-400">
              {formatCurrency(snapshot.grandTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
