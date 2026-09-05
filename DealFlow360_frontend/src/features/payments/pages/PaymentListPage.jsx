/**
 * Commercial Payment Management & Receipts Directory Page
 * Route: /company/payments
 * Phase 15 — DealFlow360
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader';
import {
  CreditCard,
  Plus,
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import { usePayments } from '../hooks/usePayments';
import { PaymentFilters } from '../components/PaymentFilters';
import { PaymentTable } from '../components/PaymentTable';
import { PaymentFormModal } from '../components/PaymentFormModal';
import { PAYMENT_STATUS } from '../types/paymentTypes';

export const PaymentListPage = () => {
  const navigate = useNavigate();
  const { payments, loading, params, updateFilters, refetch, createPayment } = usePayments();

  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // Calculated metrics
  const completedCount = payments.filter((p) => p.status === PAYMENT_STATUS.COMPLETED).length;
  const pendingCount = payments.filter((p) => p.status === PAYMENT_STATUS.PENDING || p.status === PAYMENT_STATUS.PROCESSING).length;
  const cancelledCount = payments.filter((p) => p.status === PAYMENT_STATUS.CANCELLED || p.status === PAYMENT_STATUS.FAILED).length;

  const totalCollectedAmount = payments
    .filter((p) => p.status === PAYMENT_STATUS.COMPLETED)
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const handleRecordPaymentSubmit = async (paymentData) => {
    try {
      await createPayment(paymentData, 'Finance User');
      setIsRecordModalOpen(false);
      refetch();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Commercial Payment Ledger & Remittance"
        subtitle="Record payments against commercial invoices, verify bank wire references, and track outstanding balances."
        badgeText={`${payments.length} Total Transactions`}
        badgeVariant="emerald"
      >
        <button
          type="button"
          onClick={() => setIsRecordModalOpen(true)}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" /> Record New Payment
        </button>
      </PageHeader>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Total Remittances
            </span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-xl font-black text-emerald-900">
            ${totalCollectedAmount.toLocaleString(undefined, { minimumFractionDigits: 0 })}
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Completed Payments
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-slate-900">{completedCount}</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Pending / Processing
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-black text-slate-900">{pendingCount}</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Cancelled / Failed
            </span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-xl font-black text-slate-900">{cancelledCount}</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <PaymentFilters
        filters={params}
        onFilterChange={updateFilters}
        onReset={() => updateFilters({ status: '', search: '', paymentMethod: '', currency: '' })}
      />

      {/* Payment Table */}
      <PaymentTable payments={payments} loading={loading} />

      {/* Payment Modal */}
      <PaymentFormModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        onSubmitPayment={handleRecordPaymentSubmit}
      />
    </div>
  );
};
