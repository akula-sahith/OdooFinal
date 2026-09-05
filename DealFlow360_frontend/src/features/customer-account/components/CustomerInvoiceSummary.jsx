import React from 'react';

export const CustomerInvoiceSummary = ({
  subtotal = 0,
  discountTotal = 0,
  taxTotal = 0,
  grandTotal = 0,
  amountPaid = 0,
  amountDue = 0,
  currency = 'USD',
}) => {
  const format = (val) => `${currency} $${Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3 text-xs">
      <div className="flex justify-between text-slate-600 font-medium">
        <span>Subtotal</span>
        <span className="font-bold text-slate-900">{format(subtotal)}</span>
      </div>

      {discountTotal > 0 && (
        <div className="flex justify-between text-emerald-700 font-medium">
          <span>Total Discount</span>
          <span className="font-bold">-{format(discountTotal)}</span>
        </div>
      )}

      <div className="flex justify-between text-slate-600 font-medium">
        <span>Tax Total</span>
        <span className="font-bold text-slate-900">{format(taxTotal)}</span>
      </div>

      <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900">
        <span>Grand Total</span>
        <span>{format(grandTotal)}</span>
      </div>

      <div className="flex justify-between text-emerald-700 font-bold text-xs pt-1">
        <span>Amount Remitted</span>
        <span>{format(amountPaid)}</span>
      </div>

      <div className="flex justify-between text-rose-700 font-black text-sm pt-2 border-t border-slate-200">
        <span>Balance Due</span>
        <span>{format(amountDue)}</span>
      </div>
    </div>
  );
};
