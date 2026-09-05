/**
 * Void or Cancel Invoice Mandatory Reason Entry Modal Component
 * Phase 14 — DealFlow360
 */

import React, { useState } from 'react';
import { X, Ban, ShieldAlert, Check } from 'lucide-react';
import { validateVoidReason } from '../validation/invoiceValidation';

export const VoidInvoiceModal = ({ isOpen, onClose, actionType = 'VOID', onConfirmAction }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const valCheck = validateVoidReason(reason);
    if (!valCheck.isValid) {
      setError(valCheck.error);
      return;
    }

    onConfirmAction(reason);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Ban className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-extrabold text-slate-900">
              {actionType === 'VOID' ? 'Void Issued Commercial Invoice' : 'Cancel Invoice Record'}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Voiding or cancelling an invoice is a controlled financial operation. An immutable audit record will be logged with your operational justification.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Reason / Justification *
            </label>
            <textarea
              rows="3"
              required
              placeholder="e.g. Commercial order line cancelled by mutual agreement, invoice voided before payment processing..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-rose-600 outline-none"
            />
          </div>

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
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" /> Confirm {actionType === 'VOID' ? 'Void Invoice' : 'Cancel Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
