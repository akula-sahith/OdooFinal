/**
 * Detailed Payment Record & Audit Trail Page
 * Route: /company/payments/:paymentId
 * Phase 15 — DealFlow360
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader';
import {
  ArrowLeft,
  CreditCard,
  FileText,
  ShieldCheck,
  XCircle,
  ShieldAlert,
  Clock,
} from 'lucide-react';
import { usePayment } from '../hooks/usePayment';
import { PaymentStatusBadge } from '../components/PaymentStatusBadge';
import { CancelPaymentModal } from '../components/CancelPaymentModal';
import { PAYMENT_METHOD_LABELS } from '../types/paymentTypes';

export const PaymentDetailPage = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const { payment, auditLogs, loading, error, refetch, cancelPayment } = usePayment(paymentId);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [actionError, setActionError] = useState(null);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#714B67] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-slate-500">Loading payment receipt #{paymentId}...</p>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <CreditCard className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">{error || 'Payment Record Not Found'}</h3>
        <button
          onClick={() => navigate('/company/payments')}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
        >
          Return to Payments Directory
        </button>
      </div>
    );
  }

  const handleCancelConfirm = async (reason) => {
    setProcessing(true);
    setActionError(null);
    try {
      await cancelPayment(reason, 'Finance Admin');
      setIsCancelModalOpen(false);
      refetch();
    } catch (e) {
      setActionError(e.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/company/payments')}
          className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <PageHeader
          title={`Payment Receipt ${payment.paymentNumber}`}
          subtitle={`Customer: ${payment.customerName} — Invoice #${payment.invoiceId}`}
          badgeText={payment.currency || 'USD'}
          badgeVariant="emerald"
        />
      </div>

      {actionError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 text-xs font-semibold">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
          <p>{actionError}</p>
        </div>
      )}

      {/* Main Info Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Payment Transaction Status
            </span>
            <div className="mt-1">
              <PaymentStatusBadge status={payment.status} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(`/company/invoices/${payment.invoiceId}`)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-indigo-700" /> View Invoice #{payment.invoiceId}
            </button>

            {payment.status === 'COMPLETED' && (
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(true)}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <XCircle className="w-4 h-4 text-rose-600" /> Cancel Payment
              </button>
            )}
          </div>
        </div>

        {/* Detailed Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-slate-700">
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Payment Amount</span>
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
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Remittance Notes
            </span>
            <p className="text-slate-700 font-medium italic">"{payment.notes}"</p>
          </div>
        )}
      </div>

      {/* Audit Log */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-6 space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Transaction Audit Trail
        </h3>

        <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
          {auditLogs.map((log) => (
            <div key={log.auditId} className="p-4 flex items-start justify-between text-xs bg-white">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md font-mono font-bold text-[10px] bg-slate-100 text-slate-800">
                    {log.action}
                  </span>
                  <span className="font-bold text-slate-900">{log.actor}</span>
                </div>
                {log.reason && <p className="text-slate-600 font-medium">"{log.reason}"</p>}
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Cancellation Modal */}
      <CancelPaymentModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        payment={payment}
        onConfirmCancel={handleCancelConfirm}
      />
    </div>
  );
};
