import React from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { EmptyState } from '../../components/ui/EmptyState';
import { Building2 } from 'lucide-react';

export const CustomerDetailsPlaceholder = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Customer Account: ${id}`}
        subtitle="Detailed account history, contract terms, assigned account managers, and quotation history."
        badgeText={`ID: ${id}`}
        badgeVariant="teal"
      />

      <EmptyState
        icon={Building2}
        title={`Account Details Overview (${id})`}
        description="Detailed contract agreements, order history, and billing records will load here from the backend API."
        notice="API Contract Ready. No dummy customer payload."
      />
    </div>
  );
};
