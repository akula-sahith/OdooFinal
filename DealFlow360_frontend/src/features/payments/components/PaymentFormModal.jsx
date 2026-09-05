/**
 * Record Payment Form & Confirmation Modal Component
 * Real-Time Balance Validation & Amount Verification
 * Phase 15 — DealFlow360
 */

import React, { useState, useEffect } from 'react';
import { X, CreditCard, ShieldAlert, Check, DollarSign, Calendar, Lock } from 'lucide-react';
import { PAYMENT_METHOD, PAYMENT_METHOD_LABELS } from '../types/paymentTypes';
import { validatePaymentInput } from '../validation/paymentValidation';
import { paymentService } from '../services/paymentService';

export const PaymentFormModal = ({
  isOpen,
  onClose,
  initialInvoice = null,
  onSubmitPayment,
}) => {
  const [eligibleInvoices, setEligibleInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(initialInvoice);
  const [isConfirmationStep, setIsConfirmationStep] = useState(false);

  const [formData, setFormData] = useState({
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: PAYMENT_METHOD.BANK_TRANSFER,
    referenceNumber: '',
    notes: '',
  });

  const [error, setError] = useState(null);
  const [loadingInvoices, setLoadingInvoices] = useState(false);

  useEffect(() => {
    if (initialInvoice) {
      setSelectedInvoice(initialInvoice);
      setFormData((prev) => ({
        ...prev,
        amount: initialInvoice.amountDue !== undefined ? initialInvoice.amountDue : initialInvoice.grandTotal,
        referenceNumber: `REF-WIRE-${Math.floor(100000 + Math.random() * 900000)}`,
      }));
    }
  }, [initialInvoice]);

  useEffect(() => {
    if (isOpen && !initialInvoice) {
      const loadInvoices = async () => {
        setLoadingInvoices(true);
        try {
          const list = await paymentService.getEligibleInvoices();
          setEligibleInvoices(list);
          if (list.length > 0) {
            setSelectedInvoice(list[0]);
            setFormData((prev) => ({
              ...prev,
              amount: list[0].amountDue !== undefined ? list[0].amountDue : list[0].grandTotal,
              referenceNumber: `REF-WIRE-${Math.floor(100000 + Math.random() * 900000)}`,
            }));
          }
        } catch (e) {
          console.error('Failed loading eligible invoices', e);
        } finally {
          setLoadingInvoices(false);
        }
      };
      loadInvoices();
    }
  }, [isOpen, initialInvoice]);

  if (!isOpen) return null;

  const handleInvoiceChange = (invId) => {
    const inv = eligibleInvoices.find((i) => i.id === invId);
    if (inv) {
      setSelectedInvoice(inv);
      setFormData((prev) => ({
        ...prev,
        amount: inv.amountDue !== undefined ? inv.amountDue : inv.grandTotal,
      }));
    }
  };

  const handleNextOrSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const valCheck = validatePaymentInput({ ...formData, currency: selectedInvoice?.currency }, selectedInvoice);
    if (!valCheck.isValid) {
      setError(valCheck.errors.join(' '));
      return;
    }

    if (!isConfirmationStep) {
      setIsConfirmationStep(true);
    } else {
      onSubmitPayment({
        invoiceId: selectedInvoice.id,
        amount: Number(formData.amount),
        paymentDate: formData.paymentDate,
        paymentMethod: formData.paymentMethod,
        referenceNumber: formData.referenceNumber,
        notes: formData.notes,
      });
    }
  };

  const remainingBalanceAfterPayment = selectedInvoice
    ? Math.max(0, (selectedInvoice.amountDue || selectedInvoice.grandTotal) - Number(formData.amount || 0))
    : 0;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-extrabold text-slate-900">
              {isConfirmationStep ? 'Confirm Payment Details' : 'Record Commercial Payment'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-800 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
            <p>{error}</p>
          </div>
        )}

        {!isConfirmationStep ? (
          <form onSubmit={handleNextOrSubmit} className="space-y-4">
            {/* Target Invoice Selection */}
            {!initialInvoice ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Payable Invoice *
                </label>
                <select
                  required
                  value={selectedInvoice?.id || ''}
                  onChange={(e) => handleInvoiceChange(e.target.value)}
                  className="w-full h-10 px-3 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none cursor-pointer"
                >
                  {eligibleInvoices.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.invoiceNumber} — {inv.customerName} (Due: ${inv.amountDue?.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between text-xs font-semibold">
                <div>
                  <span className="text-slate-400 block text-[11px]">Invoice Reference</span>
                  <span className="font-mono font-bold text-[#714B67]">{selectedInvoice?.invoiceNumber}</span>
                  <span className="text-slate-900 font-bold ml-2">— {selectedInvoice?.customerName}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[11px]">Outstanding Due</span>
                  <span className="font-bold text-rose-700">
                    {selectedInvoice?.currency || 'USD'} ${selectedInvoice?.amountDue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )}

            {/* Amount Input */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payment Amount ({selectedInvoice?.currency || 'USD'}) *
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={selectedInvoice?.amountDue || selectedInvoice?.grandTotal}
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full h-10 pl-9 pr-3 text-xs font-black bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method *</label>
                <select
                  required
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full h-10 px-3 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none cursor-pointer"
                >
                  {Object.values(PAYMENT_METHOD).map((m) => (
                    <option key={m} value={m}>
                      {PAYMENT_METHOD_LABELS[m]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Payment Date & Reference */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Payment Date *</label>
                <input
                  type="date"
                  required
                  value={formData.paymentDate}
                  onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                  className="w-full h-10 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bank Reference / Txn #
                </label>
                <input
                  type="text"
                  placeholder="e.g. WIRE-JPMC-99812"
                  value={formData.referenceNumber}
                  onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                  className="w-full h-10 px-3 text-xs font-mono font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>
            </div>

            {/* Remaining Balance Calculator Display */}
            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs flex items-center justify-between font-semibold">
              <span className="text-emerald-900">Calculated Remaining Balance After Payment:</span>
              <span className="font-extrabold text-emerald-900 text-sm">
                {selectedInvoice?.currency || 'USD'} ${remainingBalanceAfterPayment.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Operational Remittance Notes</label>
              <textarea
                rows="2"
                placeholder="Optional notes or bank transaction details..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                Review & Confirm <Check className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          /* Step 2: Confirmation Step */
          <div className="space-y-4 text-xs font-medium">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500">Invoice:</span>
                <span className="font-mono font-bold text-[#714B67]">{selectedInvoice?.invoiceNumber}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500">Customer Account:</span>
                <span className="font-bold text-slate-900">{selectedInvoice?.customerName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500">Payment Amount:</span>
                <span className="font-black text-emerald-800 text-sm">
                  {selectedInvoice?.currency || 'USD'} ${Number(formData.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500">Payment Method:</span>
                <span className="font-bold text-slate-800">{PAYMENT_METHOD_LABELS[formData.paymentMethod]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bank Reference #:</span>
                <span className="font-mono text-slate-800">{formData.referenceNumber || 'N/A'}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsConfirmationStep(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Back to Edit
              </button>
              <button
                type="button"
                onClick={handleNextOrSubmit}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" /> Confirm & Record Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
