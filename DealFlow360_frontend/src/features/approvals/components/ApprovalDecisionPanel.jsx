import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, ShieldAlert, MessageSquare } from 'lucide-react';
import { Button } from '../../../components/ui/Button/Button';
import { Textarea } from '../../../components/ui/Textarea/Textarea';
import { Card } from '../../../components/ui/Card/Card';
import { ConfirmationDialog } from '../../../components/dialogs/ConfirmationDialog/ConfirmationDialog';
import { ApprovalReasonModal } from './ApprovalReasonModal';
import { validateSelfApproval } from '../validation/approvalValidation';

/**
 * ApprovalDecisionPanel Component
 * Provides action controls for Sales Managers and Finance/Ops approvers to Approve,
 * Reject with mandatory reason, or Request Revision on commercial proposals.
 */
export const ApprovalDecisionPanel = ({
  quotation,
  onApprove,
  onReject,
  onRequestRevision,
  submitting = false,
  currentUser = {},
}) => {
  const [comment, setComment] = useState('');
  const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false);
  const [modalMode, setModalMode] = useState(null); // 'REJECT' | 'REVISION' | null

  if (!quotation) return null;

  const currentStatus = quotation.status;
  const isPendingApproval =
    currentStatus === 'PENDING_MANAGER_APPROVAL' || currentStatus === 'PENDING_FINANCE_APPROVAL';

  // Check self-approval constraint
  const selfCheck = validateSelfApproval(quotation.salespersonId, currentUser.id);
  const isSelfProposal = !selfCheck.valid && currentUser.role !== 'Sales Manager' && currentUser.role !== 'Finance';

  const handleConfirmApprove = () => {
    onApprove(comment.trim());
    setIsApproveConfirmOpen(false);
  };

  const handleModalConfirm = (reasonText) => {
    if (modalMode === 'REJECT') {
      onReject(reasonText);
    } else if (modalMode === 'REVISION') {
      onRequestRevision(reasonText);
    }
    setModalMode(null);
  };

  if (!isPendingApproval) {
    return (
      <Card className="p-4 bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1 text-left">
        <div className="font-bold text-slate-800">Quotation Approval Closed</div>
        <p>
          This quotation is currently in status <strong>{currentStatus}</strong> and cannot be acted upon.
        </p>
      </Card>
    );
  }

  if (isSelfProposal) {
    return (
      <Card className="p-4 bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1 text-left">
        <div className="font-bold text-amber-950 flex items-center gap-1.5">
          <ShieldAlert size={16} className="text-amber-600" />
          Separation of Duties Policy Enforcement
        </div>
        <p>
          You created this quotation proposal. Company policy strictly prohibits approving your own commercial requests.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-5 border border-slate-200 bg-white shadow-sm space-y-4 text-left">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <div className="p-2 rounded-lg bg-[#714B67]/10 text-[#714B67]">
          <CheckCircle2 size={18} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Authorization & Decision Panel</h3>
          <p className="text-xs text-slate-500">Review commercial proposal specifications and execute decision</p>
        </div>
      </div>

      {/* Optional Approval Comment */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
          <MessageSquare size={13} className="text-slate-400" /> Approval Justification Comment (Optional)
        </label>
        <Textarea
          rows={2}
          placeholder="Add optional notes regarding commercial authorization..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={submitting}
          className="text-xs"
        />
      </div>

      {/* Decision Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setModalMode('REVISION')}
            disabled={submitting}
            className="flex items-center gap-1.5 text-xs text-amber-700 hover:bg-amber-50 border-amber-300 font-semibold"
          >
            <RotateCcw size={14} /> Request Revision
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setModalMode('REJECT')}
            disabled={submitting}
            className="flex items-center gap-1.5 text-xs text-rose-700 hover:bg-rose-50 border-rose-300 font-semibold"
          >
            <XCircle size={14} /> Reject Proposal
          </Button>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={() => setIsApproveConfirmOpen(true)}
          disabled={submitting}
          className="flex items-center gap-1.5 px-6 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
        >
          <CheckCircle2 size={16} /> Approve Quotation
        </Button>
      </div>

      {/* Approve Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isApproveConfirmOpen}
        onClose={() => setIsApproveConfirmOpen(false)}
        onConfirm={handleConfirmApprove}
        title="Approve Commercial Proposal?"
        message={`Confirm commercial authorization for quotation ${quotation.quotationNumber || quotation.quotationId}? This action will update status to APPROVED.`}
        confirmText="Confirm Approval"
        cancelText="Cancel"
        variant="primary"
      />

      {/* Reject / Revision Reason Modal */}
      {modalMode && (
        <ApprovalReasonModal
          isOpen={Boolean(modalMode)}
          mode={modalMode}
          quotationNumber={quotation.quotationNumber || quotation.quotationId}
          onClose={() => setModalMode(null)}
          onConfirm={handleModalConfirm}
          submitting={submitting}
        />
      )}
    </Card>
  );
};
