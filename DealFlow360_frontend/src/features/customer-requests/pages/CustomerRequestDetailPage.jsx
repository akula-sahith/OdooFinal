import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, XCircle } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Card } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import { ConfirmationDialog } from '../../../components/dialogs/ConfirmationDialog/ConfirmationDialog';
import { useToast } from '../../../components/feedback/Toast';
import { useCustomerAuth } from '../../customer-auth/hooks/useCustomerAuth';
import { useCustomerRequest } from '../hooks/useCustomerRequest';
import { CustomerRequestSummary } from '../components/CustomerRequestSummary';
import { RequestTimeline } from '../../requests/components/RequestTimeline';
import { ConversationPanel } from '../../conversations/components/ConversationPanel';

export const CustomerRequestDetailPage = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { customerUser } = useCustomerAuth();
  const { request, loading, error, submitRequest, cancelRequest, saving } = useCustomerRequest(requestId);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    action: '', // 'submit' | 'cancel'
    isSubmitting: false,
  });

  const handleConfirmAction = async () => {
    setConfirmModal((prev) => ({ ...prev, isSubmitting: true }));
    try {
      if (confirmModal.action === 'submit') {
        const res = await submitRequest();
        if (res.success) {
          toast.success('Requirement request submitted to sales workflow.');
        } else {
          toast.error(res.error);
        }
      } else if (confirmModal.action === 'cancel') {
        const res = await cancelRequest();
        if (res.success) {
          toast.success('Requirement request cancelled.');
        } else {
          toast.error(res.error);
        }
      }
      setConfirmModal({ isOpen: false, action: '', isSubmitting: false });
    } catch (err) {
      toast.error('Failed to update request.');
      setConfirmModal({ isOpen: false, action: '', isSubmitting: false });
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-white border border-slate-200/80 rounded-xl text-center text-slate-500 text-sm max-w-5xl">
        Loading requirement request details...
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="space-y-6 text-left max-w-5xl">
        <PageHeader
          title="Requirement Request Not Found"
          actions={
            <Button variant="outline" leftIcon={ArrowLeft} onClick={() => navigate('/customer/requests')}>
              Back to Requests
            </Button>
          }
        />
        <div className="p-8 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm">
          {error || 'Request not found or you do not have access to this request.'}
        </div>
      </div>
    );
  }

  const isDraft = request.status === 'DRAFT';
  const isCancellable = request.status === 'DRAFT' || request.status === 'SUBMITTED';

  return (
    <div className="space-y-6 text-left max-w-5xl">
      {/* Header */}
      <PageHeader
        title={`Request ${request.requestId || request.id}: ${request.title}`}
        description="Commercial requirement specification, approval timeline, and assigned sales engineer conversation."
        actions={
          <div className="flex items-center gap-2.5">
            <Button variant="outline" leftIcon={ArrowLeft} onClick={() => navigate('/customer/requests')}>
              Back to Requests
            </Button>

            {isDraft && (
              <Button
                variant="primary"
                leftIcon={Send}
                onClick={() => setConfirmModal({ isOpen: true, action: 'submit', isSubmitting: false })}
                className="bg-[#714B67] hover:bg-[#5a3b52] text-white"
              >
                Submit Request
              </Button>
            )}

            {isCancellable && (
              <Button
                variant="danger"
                leftIcon={XCircle}
                onClick={() => setConfirmModal({ isOpen: true, action: 'cancel', isSubmitting: false })}
              >
                Cancel Request
              </Button>
            )}
          </div>
        }
      />

      {/* Visual Audit Timeline */}
      <RequestTimeline requestId={request.id || request.requestId} isCustomer={true} />

      {/* Request Specifications Summary */}
      <CustomerRequestSummary request={request} />

      {/* Embedded Conversation Panel */}
      <ConversationPanel
        requestId={request.id || request.requestId}
        requestTitle={request.title}
        assignedSalespersonName={request.assignedSalespersonName || 'Unassigned'}
        customerUser={customerUser}
        disabled={request.status === 'CANCELLED' || request.status === 'CLOSED'}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, action: '', isSubmitting: false })}
        onConfirm={handleConfirmAction}
        title={confirmModal.action === 'submit' ? 'Submit Requirement Request' : 'Cancel Requirement Request'}
        description={
          confirmModal.action === 'submit'
            ? `Submit request "${request.title}" to the DealFlow360 sales team? You will be able to communicate with the assigned sales engineer.`
            : `Are you sure you want to cancel request "${request.title}"?`
        }
        confirmLabel={confirmModal.action === 'submit' ? 'Submit Request' : 'Cancel Request'}
        confirmVariant={confirmModal.action === 'submit' ? 'primary' : 'danger'}
        isLoading={confirmModal.isSubmitting}
      />
    </div>
  );
};

export default CustomerRequestDetailPage;
