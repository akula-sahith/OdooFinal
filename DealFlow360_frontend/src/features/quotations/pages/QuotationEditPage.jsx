import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Button } from '../../../components/ui/Button/Button';
import { useToast } from '../../../components/feedback/Toast';
import { Skeleton } from '../../../components/feedback/Skeleton/Skeleton';
import { ErrorState } from '../../../components/feedback/ErrorState/ErrorState';
import { useQuotation } from '../hooks/useQuotation';
import { quotationService } from '../services/quotationService';
import { QuotationForm } from '../components/QuotationForm';
import { getSharedRequestsStore } from '../../customer-requests/services/customerRequestService';

export const QuotationEditPage = () => {
  const { quotationId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { quotation, loading: quoteLoading, error: quoteError, saveDraft, refetch } = useQuotation(quotationId);

  const [eligiblePriceLists, setEligiblePriceLists] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadFormResources() {
      setLoading(true);
      try {
        const priceLists = await quotationService.getQuotationEligiblePriceLists();
        setEligiblePriceLists(priceLists || []);

        if (quotation?.requestId) {
          const requestsStore = getSharedRequestsStore();
          const foundReq = requestsStore.find(
            (r) => r.id === quotation.requestId || r.requestId === quotation.requestId
          );
          if (foundReq) setSelectedRequest(foundReq);
        }
      } catch (err) {
        toast.error('Failed to load quotation form resources.');
      } finally {
        setLoading(false);
      }
    }

    if (quotation) {
      loadFormResources();
    }
  }, [quotation, toast]);

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    const res = await saveDraft(formData);
    if (res.success) {
      toast.success(`Quotation ${quotation?.quotationNumber || quotationId} draft updated!`);
      navigate(`/company/quotations/${quotationId}`);
    } else {
      toast.error(res.error || 'Failed to update quotation draft.');
      setIsSubmitting(false);
    }
  };

  if (quoteLoading || loading) {
    return (
      <div className="space-y-6 md:space-y-8 text-left">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (quoteError || !quotation) {
    return (
      <div className="py-12 space-y-6 md:space-y-8">
        <ErrorState
          title="Quotation Not Found"
          description={quoteError || 'Sales quotation not found.'}
          onRetry={refetch}
          action={
            <Button variant="outline" onClick={() => navigate('/company/quotations')}>
              Back to Quotations
            </Button>
          }
        />
      </div>
    );
  }

  if (quotation.status !== 'DRAFT') {
    return (
      <div className="py-12 space-y-6 md:space-y-8">
        <ErrorState
          title="Quotation Locked for Editing"
          description={`Quotation in status ${quotation.status} cannot be edited. Only DRAFT proposals can be modified.`}
          action={
            <Button variant="outline" onClick={() => navigate(`/company/quotations/${quotationId}`)}>
              View Quotation Specifications
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 text-left">
      <PageHeader
        title={`Edit Draft Quotation ${quotation.quotationNumber || quotationId}`}
        description="Update proposal line items, quantities, validity dates, or commercial notes."
        backRoute={`/company/quotations/${quotationId}`}
      />

      <QuotationForm
        initialValues={quotation}
        selectedRequest={selectedRequest}
        eligiblePriceLists={eligiblePriceLists}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default QuotationEditPage;
