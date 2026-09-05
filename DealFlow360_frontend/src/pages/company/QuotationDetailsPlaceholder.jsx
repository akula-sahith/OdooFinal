import React from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { EmptyState } from '../../components/ui/EmptyState';
import { FileCheck2 } from 'lucide-react';

export const QuotationDetailsPlaceholder = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Quotation: ${id}`}
        subtitle="Review proposal line items, discount approval status, customer PDF generation, and agreement terms."
        badgeText={`Ref: ${id}`}
        badgeVariant="purple"
      />

      <EmptyState
        icon={FileCheck2}
        title={`Quotation Details (${id})`}
        description="Line-item specifications, tax calculations, approval logs, and client sign-off records will load from the API."
        notice="API Contract Ready. No dummy quotation payload."
      />
    </div>
  );
};
