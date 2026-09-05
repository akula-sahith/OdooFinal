import React, { useState, useEffect } from 'react';
import { AlertCircle, XCircle, RotateCcw } from 'lucide-react';
import { Textarea } from '../../../components/ui/Textarea/Textarea';
import { Button } from '../../../components/ui/Button/Button';

/**
 * ApprovalReasonModal Component
 * Modal requiring a mandatory textual explanation for Rejecting a quotation or Requesting a Revision.
 */
export const ApprovalReasonModal = ({
  isOpen,
  mode = 'REJECT', // REJECT | REVISION
  quotationNumber = '',
  onClose,
  onConfirm,
  submitting = false,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReason('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isReject = mode === 'REJECT';
  const title = isReject ? 'Reject Commercial Quotation' : 'Request Quotation Revision';
  const icon = isReject ? <XCircle size={20} className="text-rose-600" /> : <RotateCcw size={20} className="text-amber-600" />;
  const label = isReject
    ? 'State the reason for rejecting this proposal *'
    : 'Provide revision instructions for the salesperson *';
  const placeholder = isReject
    ? 'e.g. Commercial discount exceeds acceptable profit margin for Tier 4 server hardware.'
    : 'e.g. Discount exceeds salesperson authority range. Please revise discount to 5% or below.';
  const confirmBtnText = isReject ? 'Confirm Rejection' : 'Submit Revision Request';
  const confirmBtnVariant = isReject ? 'danger' : 'primary';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!reason.trim()) {
      setError(isReject ? 'A rejection reason is strictly required.' : 'Revision instructions are strictly required.');
      return;
    }

    if (reason.trim().length < 5) {
      setError('Reason must be at least 5 characters long.');
      return;
    }

    onConfirm(reason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200 text-left">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-100">{icon}</div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
              <p className="text-xs text-slate-500 font-mono">{quotationNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="text-slate-400 hover:text-slate-600 text-lg leading-none font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {label}
            </label>
            <Textarea
              rows={4}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError('');
              }}
              placeholder={placeholder}
              disabled={submitting}
              className="text-xs"
              autoFocus
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={confirmBtnVariant}
              disabled={submitting || !reason.trim()}
              className={`text-xs ${!isReject ? 'bg-amber-600 hover:bg-amber-700 text-white' : ''}`}
            >
              {submitting ? 'Processing...' : confirmBtnText}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
