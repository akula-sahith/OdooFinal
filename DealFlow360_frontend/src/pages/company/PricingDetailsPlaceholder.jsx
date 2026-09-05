import React from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { EmptyState } from '../../components/ui/EmptyState';
import { Tag } from 'lucide-react';

export const PricingDetailsPlaceholder = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Pricing Agreement: ${id}`}
        subtitle="Contractual tier terms, baseline discounts, and customer account attachments."
        badgeText={`Tier ID: ${id}`}
        badgeVariant="info"
      />

      <EmptyState
        icon={Tag}
        title={`Pricing Contract Details (${id})`}
        description="Tier discount thresholds, contract expiry dates, and product pricing exceptions will load from the API."
        notice="API Contract Ready. No dummy pricing payload."
      />
    </div>
  );
};
