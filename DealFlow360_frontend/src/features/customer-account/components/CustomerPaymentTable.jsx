import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { PaymentStatusBadge } from '../../payments/components/PaymentStatusBadge';
import { PAYMENT_METHOD_LABELS } from '../../payments/types/paymentTypes';

export const CustomerPaymentTable = ({ payments = [] }) => {
  const navigate = useNavigate();

  if (!payments || payments.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Payment Number</th>
              <th className="py-3.5 px-4">Invoice Ref</th>
              <th className="py-3.5 px-4">Payment Date</th>
              <th className="py-3.5 px-4">Method</th>
              <th className="py-3.5 px-4 text-right">Amount</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium">
            {payments.map((p) => (
              <tr key={p.id || p.paymentNumber} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-[#714B67]">
                  <button
                    onClick={() => navigate(`/customer/payments/${p.id || p.paymentNumber}`)}
                    className="hover:underline cursor-pointer"
                  >
                    {p.paymentNumber || p.id}
                  </button>
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                  <button
                    onClick={() => navigate(`/customer/invoices/${p.invoiceId}`)}
                    className="hover:underline cursor-pointer"
                  >
                    {p.invoiceId}
                  </button>
                </td>
                <td className="py-3.5 px-4 text-slate-600 font-medium">{p.paymentDate}</td>
                <td className="py-3.5 px-4 text-slate-700 font-semibold">
                  {PAYMENT_METHOD_LABELS[p.paymentMethod] || p.paymentMethod}
                </td>
                <td className="py-3.5 px-4 text-right font-extrabold text-emerald-800">
                  {p.currency || 'USD'} ${p.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3.5 px-4">
                  <PaymentStatusBadge status={p.status} />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => navigate(`/customer/payments/${p.id || p.paymentNumber}`)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="View Remittance Receipt"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
