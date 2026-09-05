import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertCircle, ArrowLeft, ExternalLink } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Button } from '../../../components/ui/Button/Button';
import { useToast } from '../../../components/feedback/Toast';
import { Skeleton } from '../../../components/feedback/Skeleton/Skeleton';
import { ErrorState } from '../../../components/feedback/ErrorState/ErrorState';
import { approvalService } from '../services/approvalService';
import { useApprovalDecision } from '../hooks/useApprovalDecision';
import { usePermissions } from '../../../hooks/auth/usePermissions';

import { QuotationSummary } from '../../quotations/components/QuotationSummary';
import { DiscountBreakdown } from '../../quotations/components/DiscountBreakdown';
import { ApprovalDecisionPanel } from '../components/ApprovalDecisionPanel';
import { ApprovalHistory } from '../components/ApprovalHistory';
import { ApprovalTimeline } from '../components/ApprovalTimeline';

export const ApprovalDetailPage = () => {
  const { quotationId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = usePermissions();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { approve, reject, requestRevision, submitting, error: decisionErr } = useApprovalDecision(quotationId);

  const loadApprovalDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await approvalService.getApprovalDetails(quotationId);
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to load quotation approval details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApprovalDetails();
  }, [quotationId]);

  const handleApprove = async (comment) => {
    const res = await approve(comment);
    if (res.success) {
      toast.success(`Quotation ${quotationId} approved successfully!`);
      loadApprovalDetails();
    } else {
      if (res.status === 409) {
        toast.error('This quotation has already been processed or updated by another user.');
      } else {
        toast.error(res.error || 'Failed to approve quotation.');
      }
    }
  };

  const handleReject = async (reason) => {
    const res = await reject(reason);
    if (res.success) {
      toast.success(`Quotation ${quotationId} rejected.`);
      loadApprovalDetails();
    } else {
      toast.error(res.error || 'Failed to reject quotation.');
    }
  };

  const handleRequestRevision = async (reason) => {
    const res = await requestRevision(reason);
    if (res.success) {
      toast.success(`Revision requested for quotation ${quotationId}.`);
      loadApprovalDetails();
    } else {
      toast.error(res.error || 'Failed to request revision.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 md:space-y-8 text-left">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !data || !data.quotation) {
    return (
      <div className="py-12 space-y-6 md:space-y-8">
        <ErrorState
          title="Approval Record Not Found"
          description={error || 'The requested approval record does not exist or access is restricted.'}
          onRetry={loadApprovalDetails}
          action={
            <Button variant="outline" onClick={() => navigate('/company/approvals')}>
              Back to Approval Queue
            </Button>
          }
        />
      </div>
    );
  }

  const { quotation, history = [] } = data;

  const currentUserContext = {
    id: user?.id || 'MGR-007',
    role: user?.roleName || user?.role || 'Sales Manager',
  };

  const mockGovernanceResult = {
    requestedDiscountPercentage: quotation.discountPercentage || 0,
    maximumAuthorizedDiscount: 5.0,
    applicableTier: {
      name: quotation.discountAuthority || 'Salesperson Standard Tier',
      code: 'DT-SLS-01',
    },
    approvalLevel: quotation.approvalLevel || 'MANAGER',
    governanceDecision: quotation.discountStatus || 'PENDING_MANAGER_APPROVAL',
    riskLevel: quotation.riskLevel || 'MEDIUM',
    riskReason: `Requested discount (${quotation.discountPercentage || 0}%) exceeds salesperson authority limit (5%) and requires ${quotation.approvalLevel || 'Manager'} authorization.`,
    discountAmount: quotation.discountTotal || 0,
    audit: {
      requestedBy: quotation.salespersonName || 'Sarah Jenkins',
      requestedAt: quotation.createdAt,
      userRole: 'Salesperson',
    },
  };

  return (
    <div className="space-y-6 md:space-y-8 text-left">
      <PageHeader
        title={`Review Quotation ${quotation.quotationNumber || quotationId}`}
        description="Inspect submitted commercial proposal specifications, governance risk evaluation, and execute decision."
        backRoute="/company/approvals"
        actions={
          quotation.requestId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/company/sales/requests/${quotation.requestId}`)}
              className="text-xs flex items-center gap-1.5"
            >
              <ExternalLink size={14} /> Source Request ({quotation.requestId})
            </Button>
          )
        }
      />

      {/* Lifecycle Progress Timeline */}
      <ApprovalTimeline status={quotation.status} riskLevel={quotation.riskLevel} />

      {/* Decision Error Alert */}
      {decisionErr && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{decisionErr}</span>
        </div>
      )}

      {/* Decision Panel Controls */}
      <ApprovalDecisionPanel
        quotation={quotation}
        onApprove={handleApprove}
        onReject={handleReject}
        onRequestRevision={handleRequestRevision}
        submitting={submitting}
        currentUser={currentUserContext}
      />

      {/* Governance Risk Explanation Panel */}
      <DiscountBreakdown
        governanceResult={mockGovernanceResult}
        currency={quotation.currency}
        subtotal={quotation.subtotal}
      />

      {/* Read-Only Commercial Proposal Breakdown */}
      <QuotationSummary quotation={quotation} />

      {/* Chronological Audit History */}
      <ApprovalHistory history={history} />
    </div>
  );
};

export default ApprovalDetailPage;
