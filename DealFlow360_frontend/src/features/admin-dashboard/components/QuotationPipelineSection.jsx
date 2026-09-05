import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Skeleton } from '../../../components/feedback/Skeleton';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { ErrorState } from '../../../components/feedback/ErrorState';

/**
 * Quotation Pipeline Operational Section
 * Displays quotation distribution across lifecycle stages with direct routing filters.
 */
export const QuotationPipelineSection = ({
  counts = null, // { DRAFT: 0, SENT: 0, VIEWED: 0, ACCEPTED: 0, REJECTED: 0, EXPIRED: 0 }
  isLoading = false,
  error = null,
  onRetry,
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card variant="standard">
        <CardHeader>
          <Skeleton variant="text" width="160px" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} variant="rectangle" height="70px" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="bordered" className="border-rose-200">
        <CardContent>
          <ErrorState
            title="Unable to load quotation pipeline"
            message={error}
            onRetry={onRetry}
          />
        </CardContent>
      </Card>
    );
  }

  const stages = [
    { key: 'DRAFT', label: 'Draft' },
    { key: 'SENT', label: 'Sent' },
    { key: 'VIEWED', label: 'Viewed' },
    { key: 'ACCEPTED', label: 'Accepted' },
    { key: 'REJECTED', label: 'Rejected' },
    { key: 'EXPIRED', label: 'Expired' },
  ];

  const hasData = counts && Object.values(counts).some((v) => v !== undefined && v !== null);

  return (
    <Card variant="standard">
      <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#714B67]" />
            <CardTitle>Quotation Pipeline</CardTitle>
          </div>
          <CardDescription>
            Lifecycle breakdown of active and archived proposals.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5">
        {!hasData ? (
          <EmptyState
            icon={FileText}
            title="No quotation records"
            description="Quotations will appear in pipeline stages once created by your sales team."
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {stages.map((stage) => {
              const val = counts ? counts[stage.key] : undefined;
              const hasVal = val !== undefined && val !== null;

              return (
                <div
                  key={stage.key}
                  onClick={() => navigate(`/company/quotations?status=${stage.key.toLowerCase()}`)}
                  className="p-3.5 bg-slate-50 hover:bg-[#F7F2F5]/80 border border-slate-200 hover:border-[#714B67]/40 rounded-xl transition-all cursor-pointer group text-left space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <StatusBadge status={stage.key} size="sm" showDot={false} />
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#714B67] transition-colors" />
                  </div>
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading block">
                    {hasVal ? val.toLocaleString() : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuotationPipelineSection;
