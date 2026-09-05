import React from 'react';
import { Package } from 'lucide-react';

export const QuotationProductTable = ({ quotation }) => {
  if (!quotation) return null;

  const items = quotation.items || [];
  const currency = quotation.currency || 'INR';

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(val || 0);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Package className="w-4 h-4 text-primary-500" />
          <span>Products & Pricing Breakdown</span>
        </h3>
        <span className="text-xs text-slate-500 font-medium">Currency: {currency}</span>
      </div>

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
              <tr key={item.quotationItemId || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                <td className="py-3.5 px-6">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {item.productNameSnapshot || 'Product'}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    {item.skuSnapshot || 'N/A'}
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

      {/* Summary Footer */}
      <div className="p-6 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-end">
        <div className="w-full md:w-80 space-y-2 text-sm">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Subtotal:</span>
            <span className="font-medium">{formatCurrency(quotation.subtotal)}</span>
          </div>

          {quotation.discountTotal > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
              <span>Applied Discount:</span>
              <span className="font-medium">-{formatCurrency(quotation.discountTotal)}</span>
            </div>
          )}

          {quotation.taxTotal > 0 && (
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Tax / GST:</span>
              <span className="font-medium">{formatCurrency(quotation.taxTotal)}</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-base font-bold text-slate-900 dark:text-white">
            <span>Grand Total:</span>
            <span className="text-xl text-primary-600 dark:text-primary-400">{formatCurrency(quotation.grandTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
