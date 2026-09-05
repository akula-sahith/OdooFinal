/**
 * Embedded Payment History Timeline Component for Invoice Detail View
 * Phase 15 — DealFlow360
 */

import React from 'react';
import { CreditCard, DollarSign, Clock, CheckCircle2, AlertTriangle, Plus } from 'lucide-react';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { PAYMENT_METHOD_LABELS } from '../types/paymentTypes';

export const PaymentTimeline = ({
  invoice,
  payments = [],
  onRecordPaymentClick,
  onCancelPaymentClick,
}) => {
  if (!invoice) return null;

  const currency = invoice.currency || 'USD';
  const completedTotal = payments
    .filter((p) => p.status === 'COMPLETED')
    .reduce((acc, p) => acc + Number(p.amount || 0), 0);

  const amountDue = Math.max(0, (invoice.grandTotal || 0) - completedTotal);
  const isPayable = (invoice.status === 'ISSUED' || invoice.status === 'PARTIALLY_PAID' || invoice.status === 'OVERDUE') && amountDue > 0;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-extrabold text-slate-900">
              Commercial Payment Ledger & Remittance History
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Completed Payments: <strong className="text-emerald-800">{currency} ${completedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong> | Outstanding Balance: <strong className="text-rose-800">{currency} ${amountDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
          </p>
        </div>

        {isPayable && onRecordPaymentClick && (
          <button
            type="button"
            onClick={onRecordPaymentClick}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-white" /> Record Payment
          </button>
        )}
      </div>

      {/* Payment History Items */}
      <div className="space-y-3">
        {payments.length > 0 ? (
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
            {payments.map((p) => (
              <div key={p.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#714B67]">{p.paymentNumber}</span>
                    <PaymentStatusBadge status={p.status} />
                    <span className="text-slate-500 font-medium">({PAYMENT_METHOD_LABELS[p.paymentMethod] || p.paymentMethod})</span>
                  </div>
                  <p className="text-slate-600 font-medium">
                    Ref #: <span className="font-mono font-bold text-slate-800">{p.referenceNumber || 'N/A'}</span> | Recorded on {p.paymentDate} by {p.createdBy || 'Finance User'}
                  </p>
                  {p.notes && <p className="text-[11px] text-slate-400 italic">"{p.notes}"</p>}
                </div>

                <div className="flex items-center gap-4 text-right self-end sm:self-center">
                  <span className="text-sm font-black text-emerald-800">
                    {p.currency || currency} ${Number(p.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>

                  {p.status === 'COMPLETED' && onCancelPaymentClick && (
                    <button
                      type="button"
                      onClick={() => onCancelPaymentClick(p)}
                      className="px-2.5 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel Payment
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 space-y-2 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <CreditCard className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-medium">No payments recorded against this invoice yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
