import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Button } from '../../../components/ui/Button/Button';
import { useToast } from '../../../components/feedback/Toast';
import { Skeleton } from '../../../components/feedback/Skeleton/Skeleton';
import { quotationService } from '../services/quotationService';
import { approvalService } from '../../approvals/services/approvalService';
import { QuotationForm } from '../components/QuotationForm';
import { usePermissions } from '../../../hooks/auth/usePermissions';
import { getSharedRequestsStore } from '../../customer-requests/services/customerRequestService';

export const QuotationCreatePage = () => {
  const [searchParams] = useSearchParams();
  const requestIdParam = searchParams.get('requestId') || '';

  const navigate = useNavigate();
  const toast = useToast();
  const { user } = usePermissions();

  const [eligibleRequests, setEligibleRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [eligiblePriceLists, setEligiblePriceLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eligibilityError, setEligibilityError] = useState('');

  useEffect(() => {
    async function loadFormResources() {
      setLoading(true);
      setEligibilityError('');
      try {
        const [reqs, priceLists] = await Promise.all([
          quotationService.getQuotationEligibleRequests(),
          quotationService.getQuotationEligiblePriceLists(),
        ]);

        setEligibleRequests(reqs || []);
        setEligiblePriceLists(priceLists || []);

        // Find request if requestId parameter was passed
        if (requestIdParam) {
          const allRequests = getSharedRequestsStore();
          const targetReq = allRequests.find(
            (r) => r.id === requestIdParam || r.requestId === requestIdParam
          );

          if (!targetReq) {
            setEligibilityError(`Source Customer Request "${requestIdParam}" was not found.`);
          } else if (targetReq.status !== 'REQUIREMENT_CONFIRMED') {
            setEligibilityError(
              `Request "${requestIdParam}" is currently in state [${targetReq.status}]. Quotations can only be created from requests in REQUIREMENT_CONFIRMED state.`
            );
            setSelectedRequest(targetReq);
          } else {
            setSelectedRequest(targetReq);
          }
        } else if (reqs && reqs.length > 0) {
          setSelectedRequest(reqs[0]);
        }
      } catch (err) {
        toast.error('Failed to load quotation creation prerequisites.');
      } finally {
        setLoading(false);
      }
    }

    loadFormResources();
  }, [requestIdParam, toast]);

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        salespersonId: user?.id || 'SP-014',
        salespersonName: user?.fullName || 'Sarah Jenkins',
      };

      const created = await quotationService.createQuotation(payload);

      if (formData.submitForApproval) {
        await approvalService.submitForApproval(created.quotationId || created.quotationNumber, {
          id: user?.id || 'SP-014',
          fullName: user?.fullName || 'Sarah Jenkins',
        });
        toast.success(`Quotation ${created.quotationNumber} submitted for commercial approval!`);
      } else {
        toast.success(`Quotation ${created.quotationNumber} saved as DRAFT!`);
      }

      navigate(`/company/quotations/${created.quotationId || created.quotationNumber}`);
    } catch (err) {
      toast.error(err.message || 'Failed to create quotation draft.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 text-left p-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 text-left">
      <PageHeader
        title="Draft Commercial Sales Quotation"
        description="Select confirmed customer requirement, associate active commercial price list, and specify line item quantities."
        backRoute="/company/quotations"
      />

      {eligibilityError && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-bold text-amber-900">Request Eligibility Alert</h5>
            <p>{eligibilityError}</p>
          </div>
        </div>
      )}

      {(!selectedRequest && !requestIdParam && eligibleRequests.length === 0) ? (
        <div className="p-8 text-center bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
          <AlertCircle size={32} className="mx-auto text-amber-500" />
          <h3 className="text-base font-bold text-slate-800">No Eligible Confirmed Requests Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Quotations must begin from customer requests that have reached the <strong>REQUIREMENT_CONFIRMED</strong> state.
          </p>
          <div className="pt-2">
            <Button
              variant="outline"
              onClick={() => navigate('/company/sales/requests')}
              className="text-xs"
            >
              Go to Sales Requests
            </Button>
          </div>
        </div>
      ) : (
        <QuotationForm
          initialValues={{
            requestId: selectedRequest?.requestId || selectedRequest?.id || requestIdParam,
            customerName: selectedRequest?.customerName || selectedRequest?.companyName,
            companyName: selectedRequest?.companyName || selectedRequest?.customerName,
            customerEmail: selectedRequest?.customerEmail,
          }}
          selectedRequest={selectedRequest}
          eligiblePriceLists={eligiblePriceLists}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default QuotationCreatePage;
