/**
 * Invoice Financial Summary Component
 * Phase 14 — DealFlow360
 */

import React from 'react';
import { DollarSign, ShieldCheck, CreditCard } from 'lucide-react';

export const InvoiceSummary = ({ invoice }) => {
  if (!invoice) return null;

  const currency = invoice.currency || 'USD';

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
        <DollarSign className="w-4 h-4 text-[#714B67]" /> Financial Totals & Balance Summary
      </h4>

      <div className="space-y-2.5 text-xs font-semibold">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-slate-600">
          <span>Commercial Subtotal</span>
          <span className="font-bold text-slate-900">
            {currency} ${invoice.subtotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Discount Total */}
        <div className="flex items-center justify-between text-slate-600">
          <span>Commercial Discount Total</span>
          <span className="font-bold text-emerald-700">
            - {currency} ${invoice.discountTotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Tax Total */}
        <div className="flex items-center justify-between text-slate-600">
          <span>Applicable Tax Total</span>
          <span className="font-bold text-slate-900">
            + {currency} ${invoice.taxTotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 my-2 pt-2"></div>

        {/* Grand Total */}
        <div className="flex items-center justify-between text-sm">
          <span className="font-extrabold text-slate-900">Invoice Grand Total</span>
          <span className="font-black text-[#714B67] text-base">
            {currency} ${invoice.grandTotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Amount Paid (Phase 15 integration ready) */}
        <div className="flex items-center justify-between text-slate-500 pt-1">
          <span className="flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 text-emerald-600" /> Amount Paid (Phase 15)
          </span>
          <span className="font-bold text-emerald-800">
            {currency} ${(invoice.amountPaid || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Amount Due */}
        <div className="p-3 bg-rose-50 border border-rose-200/90 rounded-xl flex items-center justify-between mt-2">
          <span className="font-extrabold text-rose-900">Outstanding Balance Due</span>
          <span className="font-black text-rose-900 text-lg">
            {currency} ${invoice.amountDue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
};
