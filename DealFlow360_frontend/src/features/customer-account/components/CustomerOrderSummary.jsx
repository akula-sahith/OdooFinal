import React from 'react';

export const CustomerOrderSummary = ({ subtotal = 0, discountTotal = 0, taxTotal = 0, grandTotal = 0, currency = 'USD' }) => {
  const format = (val) => `${currency} $${Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3 text-xs">
      <div className="flex justify-between text-slate-600 font-medium">
        <span>Subtotal</span>
        <span className="font-bold text-slate-900">{format(subtotal)}</span>
      </div>

      {discountTotal > 0 && (
        <div className="flex justify-between text-emerald-700 font-medium">
          <span>Discount Applied</span>
          <span className="font-bold">-{format(discountTotal)}</span>
        </div>
      )}

      <div className="flex justify-between text-slate-600 font-medium">
        <span>Tax Total</span>
        <span className="font-bold text-slate-900">{format(taxTotal)}</span>
      </div>

      <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm">
        <span className="font-black text-slate-900">Grand Total</span>
        <span className="font-black text-[#714B67] text-base">{format(grandTotal)}</span>
      </div>
    </div>
  );
};
