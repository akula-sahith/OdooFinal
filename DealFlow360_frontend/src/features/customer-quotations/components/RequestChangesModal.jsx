import React, { useState } from 'react';
import { MessageSquarePlus, AlertCircle, X } from 'lucide-react';
import { REQUEST_CHANGE_CATEGORIES } from '../types/customerQuotationTypes';
import { validateChangeRequest } from '../validation/customerQuotationValidation';

export const RequestChangesModal = ({
  isOpen,
  onClose,
  onConfirm,
  quotation,
  submitting,
  error,
}) => {
  const [category, setCategory] = useState('Discount');
  const [message, setMessage] = useState('');
  const [validationError, setValidationError] = useState(null);

  if (!isOpen || !quotation) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;

    const check = validateChangeRequest({ category, message });
    if (!check.isValid) {
      setValidationError(check.error);
      return;
    }

    setValidationError(null);
    onConfirm({ category, message });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-primary-50/50 dark:bg-primary-950/30">
          <div className="flex items-center gap-2 text-primary-700 dark:text-primary-400">
            <MessageSquarePlus className="w-5 h-5" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Request Commercial Changes</h3>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Describe the requested modifications for quotation <strong className="text-slate-900 dark:text-white">{quotation.quotationNumber}</strong>. Your sales representative will review and propose a revised version subject to discount governance approval.
          </p>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Requested Change Category <span className="text-primary-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={submitting}
              className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-800 dark:text-slate-200 font-medium"
            >
              {REQUEST_CHANGE_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Detailed Change Request / Negotiation Note <span className="text-primary-500">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (validationError) setValidationError(null);
              }}
              rows={4}
              disabled={submitting}
              placeholder="e.g. Can you provide a 7% volume discount if we increase quantity to 100 units?"
              className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-800 dark:text-slate-200 resize-none"
            />
            {validationError && (
              <p className="text-[11px] text-rose-500 font-medium">{validationError}</p>
            )}
          </div>

          {(error || validationError) && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error || validationError}</span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !message.trim()}
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs rounded-xl shadow-sm transition disabled:opacity-50"
            >
              {submitting ? 'Submitting Request...' : 'Submit Change Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
