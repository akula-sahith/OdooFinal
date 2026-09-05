import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  MessageSquare,
  Play,
  UserCheck,
  HelpCircle,
  FileCheck,
  FileText,
  Plus,
  XCircle,
} from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Button } from '../../../components/ui/Button/Button';
import { Card } from '../../../components/ui/Card/Card';
import { Textarea } from '../../../components/ui/Textarea/Textarea';
import { Modal } from '../../../components/dialogs/Modal/Modal';
import { ConfirmationDialog } from '../../../components/dialogs/ConfirmationDialog/ConfirmationDialog';
import { useToast } from '../../../components/feedback/Toast';
import { Skeleton } from '../../../components/feedback/Skeleton/Skeleton';
import { ErrorState } from '../../../components/feedback/ErrorState/ErrorState';
import { usePermissions } from '../../../hooks/auth/usePermissions';
import { useSalespersonRequest } from '../hooks/useSalespersonRequest';
import { SalespersonRequestSummary } from '../components/SalespersonRequestSummary';
import { SalespersonConversationPanel } from '../components/SalespersonConversationPanel';
import { RequestTimeline } from '../../requests/components/RequestTimeline';
import { validateClarificationMessage } from '../validation/salespersonRequestValidation';

export const SalespersonRequestDetailPage = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = usePermissions();

  const {
    request,
    loading,
    error,
    actionLoading,
    refetch,
    claimRequest,
    startReview,
    requestClarification,
    confirmRequirement,
    closeRequest,
  } = useSalespersonRequest(requestId);

  // Clarification Modal State
  const [isClarificationModalOpen, setIsClarificationModalOpen] = useState(false);
  const [clarificationText, setClarificationText] = useState('');
  const [clarificationError, setClarificationError] = useState('');

  // Confirmation Dialog State
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // Claim Dialog State
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState(false);

  if (loading) {
    return (
      <div className="space-y-6 text-left">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-48 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 lg:col-span-2" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="py-12">
        <ErrorState
          title="Requirement Request Not Found"
          description={error || 'The requested customer requirement does not exist or access is restricted.'}
          onRetry={refetch}
          action={
            <Button variant="outline" onClick={() => navigate('/company/sales/requests')}>
              Back to Request Queue
            </Button>
          }
        />
      </div>
    );
  }

  const handleStartReview = async () => {
    try {
      await startReview();
      toast.success('Started review for requirement request.');
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to start review.');
    }
  };

  const handleClaim = async () => {
    try {
      await claimRequest({
        id: user?.id || 'SP-014',
        name: user?.fullName || 'Sarah Jenkins',
      });
      toast.success('Request claimed successfully.');
      setIsClaimDialogOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to claim request.');
    }
  };

  const handleOpenClarificationModal = () => {
    setClarificationText('');
    setClarificationError('');
    setIsClarificationModalOpen(true);
  };

  const handleSubmitClarification = async () => {
    const validation = validateClarificationMessage(clarificationText);
    if (!validation.isValid) {
      setClarificationError(validation.errors.message);
      return;
    }

    try {
      await requestClarification(clarificationText, {
        id: user?.id || 'SP-014',
        name: user?.fullName || 'Sarah Jenkins (Sales Representative)',
      });
      toast.success('Clarification question sent to customer!');
      setIsClarificationModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to send clarification question.');
    }
  };

  const handleConfirmRequirement = async () => {
    try {
      await confirmRequirement('Requirement specifications confirmed and validated for quotation drafting.');
      toast.success('Requirement confirmed! Request is now ready for Quotation.');
      setIsConfirmDialogOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to confirm requirement.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <PageHeader
        title={`Request ${request.requestId || requestId}`}
        description="Inspect customer requirements, conduct clarifications, and manage lifecycle state."
        backRoute="/company/sales/requests"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {!request.assignedSalespersonId && (
              <Button
                variant="outline"
                leftIcon={UserCheck}
                onClick={() => setIsClaimDialogOpen(true)}
                isLoading={actionLoading}
              >
                Claim Request
              </Button>
            )}

            {request.status === 'SUBMITTED' && (
              <Button
                variant="primary"
                leftIcon={Play}
                onClick={handleStartReview}
                isLoading={actionLoading}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                Start Review
              </Button>
            )}

            {(request.status === 'UNDER_REVIEW' || request.status === 'REQUIREMENT_CLARIFICATION') && (
              <>
                <Button
                  variant="outline"
                  leftIcon={HelpCircle}
                  onClick={handleOpenClarificationModal}
                  isLoading={actionLoading}
                  className="border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100"
                >
                  Ask Clarification
                </Button>

                <Button
                  variant="primary"
                  leftIcon={CheckCircle2}
                  onClick={() => setIsConfirmDialogOpen(true)}
                  isLoading={actionLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Confirm Requirement
                </Button>
              </>
            )}

            {request.status === 'REQUIREMENT_CONFIRMED' && (
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>Requirement Confirmed</span>
                </div>
                <Button
                  variant="primary"
                  leftIcon={Plus}
                  onClick={() => navigate(`/company/quotations/new?requestId=${request.requestId || requestId}`)}
                  className="bg-[#714B67] hover:bg-[#5a3b52] text-white"
                >
                  Create Quotation
                </Button>
              </div>
            )}
          </div>
        }
      />

      {/* Requirement Summary Card */}
      <SalespersonRequestSummary request={request} />

      {/* Two Column Layout: Conversation & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Real-time Conversation */}
        <div className="lg:col-span-2">
          <SalespersonConversationPanel
            requestId={request.requestId || requestId}
            requestTitle={request.title}
            customerName={request.companyName || request.customerName || 'B2B Client'}
            disabled={request.status === 'CANCELLED' || request.status === 'CLOSED'}
          />
        </div>

        {/* Right Column (1 Col): Status Lifecycle Timeline */}
        <div className="space-y-6">
          <RequestTimeline requestId={request.requestId || requestId} isCustomer={false} />
        </div>
      </div>

      {/* Clarification Input Modal */}
      <Modal
        isOpen={isClarificationModalOpen}
        onClose={() => setIsClarificationModalOpen(false)}
        title="Request Requirement Clarification"
        description={`Send a formal clarification message to ${request.companyName || request.customerName || 'customer'}. Status will update to Clarification Requested.`}
      >
        <div className="space-y-4 pt-2 text-left">
          <Textarea
            label="Clarification Message / Technical Question"
            value={clarificationText}
            onChange={(e) => {
              setClarificationText(e.target.value);
              setClarificationError('');
            }}
            placeholder="e.g. Could you please confirm if dual redundant power supplies are required for this deployment?"
            rows={4}
            error={clarificationError}
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setIsClarificationModalOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              leftIcon={HelpCircle}
              onClick={handleSubmitClarification}
              isLoading={actionLoading}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Send Clarification Question
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Dialog: Requirement Confirmed */}
      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleConfirmRequirement}
        title="Confirm Customer Requirement"
        description={`Are you sure customer requirement "${request.title}" is fully clarified and confirmed? This will set status to REQUIREMENT_CONFIRMED as the handoff point for quotation creation.`}
        confirmLabel="Confirm Requirement"
        confirmVariant="primary"
        isLoading={actionLoading}
      />

      {/* Claim Dialog */}
      <ConfirmationDialog
        isOpen={isClaimDialogOpen}
        onClose={() => setIsClaimDialogOpen(false)}
        onConfirm={handleClaim}
        title="Claim Requirement Request"
        description={`Assign request "${request.title}" to your active sales queue?`}
        confirmLabel="Claim Request"
        confirmVariant="primary"
        isLoading={actionLoading}
      />
    </div>
  );
};

export default SalespersonRequestDetailPage;
