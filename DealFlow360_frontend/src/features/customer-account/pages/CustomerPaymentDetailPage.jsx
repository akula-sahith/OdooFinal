import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CreditCard,
  Receipt,
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
  Building,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import { customerPortalService } from '../services/customerPortalService';
import { PaymentStatusBadge } from '../../payments/components/PaymentStatusBadge';
import { PAYMENT_METHOD_LABELS } from '../../payments/types/paymentTypes';

export const CustomerPaymentDetailPage = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPayment = async () => {
      if (!paymentId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await customerPortalService.getPaymentById(paymentId);
        setPayment(data);
      } catch (err) {
        console.error('Failed loading payment detail:', err);
        setError(err.message || 'Payment transaction not found or unauthorized.');
      } finally {
        setLoading(false);
      }
    };
    loadPayment();
  }, [paymentId]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4 bg-white rounded-2xl border border-slate-200">
        <div className="w-10 h-10 border-4 border-[#714B67] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-slate-500">Loading remittance transaction receipt...</p>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="bg-white border border-rose-200 rounded-2xl p-12 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-base font-extrabold text-slate-900">Payment Record Not Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">{error || 'You are not authorized to view this transaction.'}</p>
        <button
          type="button"
          onClick={() => navigate('/customer/payments')}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
        >
          Back to Payments
        </button>
      </div>
    );
  }

  const {
    paymentNumber = paymentId,
    invoiceId,
    orderId,
    amount = 0,
    currency = 'USD',
    paymentDate,
    paymentMethod,
    referenceNumber,
    status = 'COMPLETED',
    notes,
    createdBy,
  } = payment;

  return (
    <div className="space-y-6 pb-16 text-left">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/customer/payments')}
            className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 font-mono">{paymentNumber}</h1>
              <PaymentStatusBadge status={status} />
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Payment Date: {paymentDate} • Ref: {referenceNumber || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Remittance Receipt Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row justify-between border-b border-slate-200 pb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-200">
              <CreditCard className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Official Payment Remittance Receipt</h3>
              <p className="text-xs text-slate-500 font-medium">DealFlow360 Account Remittance</p>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Remitted Amount</span>
            <span className="text-2xl font-black text-emerald-800">
              {currency} ${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Transaction Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs bg-slate-50 p-5 rounded-xl border border-slate-200/80">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Payment Method</span>
            <span className="font-bold text-slate-900 mt-1 block">
              {PAYMENT_METHOD_LABELS[paymentMethod] || paymentMethod || 'Bank Transfer'}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Bank / Reference No.</span>
            <span className="font-mono font-bold text-[#714B67] mt-1 block">
              {referenceNumber || 'ELECTRONIC-WIRE-REF'}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Applied Invoice</span>
            <span className="font-mono font-bold text-slate-800 mt-1 block">
              <button onClick={() => navigate(`/customer/invoices/${invoiceId}`)} className="hover:underline">
                {invoiceId}
              </button>
            </span>
          </div>

          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Associated Order</span>
            <span className="font-mono font-bold text-slate-800 mt-1 block">
              {orderId ? (
                <button onClick={() => navigate(`/customer/orders/${orderId}`)} className="hover:underline">
                  {orderId}
                </button>
              ) : (
                'ORD-2026-8912'
              )}
            </span>
          </div>
        </div>

        {notes && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <span className="font-bold text-slate-700 block mb-1">Remittance Memo / Notes</span>
            <p className="text-slate-600 font-medium leading-relaxed">{notes}</p>
          </div>
        )}

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Customer Payment Remittance Record is Permanent & Read-Only.
          </span>
          {createdBy && <span>Recorded By: {createdBy}</span>}
        </div>
      </div>
    </div>
  );
};

export default CustomerPaymentDetailPage;
