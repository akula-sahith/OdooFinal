/**
 * Customer Portal Payment Detail & Receipt View Page
 * Route: /customer/payments/:paymentId
 * Phase 15 — DealFlow360
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, FileText } from 'lucide-react';
import { paymentService } from '../../payments/services/paymentService';
import { PaymentStatusBadge } from '../../payments/components/PaymentStatusBadge';
import { PAYMENT_METHOD_LABELS } from '../../payments/types/paymentTypes';

export const CustomerPaymentDetailPage = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      try {
        const data = await paymentService.getPaymentById(paymentId);
        setPayment(data);
      } catch (e) {
        console.error('Error loading customer payment detail:', e);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [paymentId]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4 bg-white rounded-2xl border border-slate-200">
        <div className="w-10 h-10 border-4 border-[#714B67] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-slate-500">Loading payment receipt...</p>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-8">
        <CreditCard className="w-8 h-8 text-slate-300 mx-auto" />
        <h3 className="text-sm font-bold text-slate-900">Payment Record Not Found</h3>
        <button
          onClick={() => navigate('/customer/payments')}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
        >
          Return to Payments Directory
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/customer/payments')}
          className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-black text-slate-900">Payment Receipt #{payment.paymentNumber}</h1>
          <p className="text-xs text-slate-500 font-medium">Invoice Reference #{payment.invoiceId}</p>
        </div>
      </div>

      {/* Main Receipt Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Payment Status
            </span>
            <div className="mt-1">
              <PaymentStatusBadge status={payment.status} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/customer/invoices/${payment.invoiceId}`)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-indigo-700" /> View Invoice #{payment.invoiceId}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-slate-700">
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Remittance Amount</span>
            <span className="text-base font-black text-emerald-800 mt-0.5 block">
              {payment.currency} ${payment.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Payment Method</span>
            <span className="font-bold text-slate-900 mt-0.5 block">
              {PAYMENT_METHOD_LABELS[payment.paymentMethod] || payment.paymentMethod}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Bank Reference / Txn #</span>
            <span className="font-mono font-bold text-slate-900 mt-0.5 block">
              {payment.referenceNumber || 'N/A'}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Payment Date</span>
            <span className="font-bold text-slate-900 mt-0.5 block">{payment.paymentDate}</span>
          </div>
        </div>

        {payment.notes && (
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Notes</span>
            <p className="text-slate-700 font-medium italic">"{payment.notes}"</p>
          </div>
        )}
      </div>
    </div>
  );
};
