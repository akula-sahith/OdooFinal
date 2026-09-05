import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit3, FileText, CheckCircle2, ExternalLink } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Button } from '../../../components/ui/Button/Button';
import { Skeleton } from '../../../components/feedback/Skeleton/Skeleton';
import { ErrorState } from '../../../components/feedback/ErrorState/ErrorState';
import { useQuotation } from '../hooks/useQuotation';
import { QuotationSummary } from '../components/QuotationSummary';

export const QuotationDetailPage = () => {
  const { quotationId } = useParams();
  const navigate = useNavigate();

  const { quotation, loading, error, refetch } = useQuotation(quotationId);

  if (loading) {
    return (
      <div className="space-y-6 text-left p-6 max-w-7xl mx-auto">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !quotation) {
    return (
      <div className="py-12 p-6 max-w-7xl mx-auto">
        <ErrorState
          title="Quotation Not Found"
          description={error || 'The requested sales quotation does not exist or access is restricted.'}
          onRetry={refetch}
          action={
            <Button variant="outline" onClick={() => navigate('/company/quotations')}>
              Back to Quotation List
            </Button>
          }
        />
      </div>
    );
  }

  const isDraft = quotation.status === 'DRAFT';

  return (
    <div className="space-y-6 text-left p-6 max-w-7xl mx-auto">
      <PageHeader
        title={`Quotation ${quotation.quotationNumber || quotationId}`}
        description="Inspect commercial proposal details, client account references, and itemized subtotal breakdown."
        backRoute="/company/quotations"
        actions={
          <div className="flex items-center gap-3">
            {quotation.requestId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/company/sales/requests/${quotation.requestId}`)}
                className="text-xs flex items-center gap-1.5"
              >
                <ExternalLink size={14} /> Source Request ({quotation.requestId})
              </Button>
            )}

            {isDraft ? (
              <Button
                variant="primary"
                leftIcon={Edit3}
                onClick={() => navigate(`/company/quotations/${quotation.quotationId || quotationId}/edit`)}
                className="bg-[#714B67] hover:bg-[#5a3b52] text-white text-xs"
              >
                Edit Draft Proposal
              </Button>
            ) : (quotation.status === 'ACCEPTED' || quotation.status === 'COMMERCIALLY_CLOSED') ? (
              <Button
                variant="primary"
                leftIcon={CheckCircle2}
                onClick={() => navigate(`/m-entry-z7829a/workspace/quotations/${quotation.quotationId || quotationId}/finalize`)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
              >
                View Commercial Closure & Order Readiness
              </Button>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-[#714B67] text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Status: {quotation.status}</span>
              </div>
            )}
          </div>
        }
      />

      <QuotationSummary quotation={quotation} />
    </div>
  );
};

export default QuotationDetailPage;
