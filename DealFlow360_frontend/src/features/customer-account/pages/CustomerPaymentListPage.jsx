/**
 * Customer Portal Payments Directory Page
 * Route: /customer/payments
 * Phase 15 — DealFlow360
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Eye, DollarSign } from 'lucide-react';
import { paymentService } from '../../payments/services/paymentService';
import { PaymentStatusBadge } from '../../payments/components/PaymentStatusBadge';
import { PAYMENT_METHOD_LABELS } from '../../payments/types/paymentTypes';

export const CustomerPaymentListPage = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomerPayments = async () => {
      setLoading(true);
      try {
        const list = await paymentService.getPayments();
        setPayments(list);
      } catch (e) {
        console.error('Failed loading customer payments', e);
      } finally {
        setLoading(false);
      }
    };
    loadCustomerPayments();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4 bg-white rounded-2xl border border-slate-200">
        <div className="w-10 h-10 border-4 border-[#714B67] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-slate-500">Loading your payment transactions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-slate-900">Commercial Payments & Remittances</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          View completed payment transactions, reference numbers, and payment dates.
        </p>
      </div>

      {/* Payments List Table */}
      {payments.length > 0 ? (
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
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Payment Number */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#714B67]">
                      <button
                        onClick={() => navigate(`/customer/payments/${p.id}`)}
                        className="hover:underline cursor-pointer"
                      >
                        {p.paymentNumber}
                      </button>
                    </td>

                    {/* Invoice */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{p.invoiceId}</td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{p.paymentDate}</td>

                    {/* Method */}
                    <td className="py-3.5 px-4 text-slate-700 font-semibold">
                      {PAYMENT_METHOD_LABELS[p.paymentMethod] || p.paymentMethod}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right font-extrabold text-emerald-800">
                      {p.currency || 'USD'} ${p.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <PaymentStatusBadge status={p.status} />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => navigate(`/customer/payments/${p.id}`)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="View Detailed Receipt"
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
      ) : (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-16 text-center space-y-3">
          <CreditCard className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Payments Recorded</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
            There are currently no payment transactions recorded for your account.
          </p>
        </div>
      )}
    </div>
  );
};
