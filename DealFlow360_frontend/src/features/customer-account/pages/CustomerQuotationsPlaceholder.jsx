import React, { useState } from 'react';
import { Tag } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Card } from '../../../components/ui/Card/Card';
import { EmptyState } from '../../../components/feedback/EmptyState/EmptyState';

export const CustomerQuotationsPlaceholder = () => {
  return (
    <div className="space-y-6 text-left max-w-5xl">
      <PageHeader
        title="My Quotations & B2B Proposals"
        description="Formal commercial price proposals, line items, and approval terms."
      />

      <Card padding="lg">
        <EmptyState
          icon={Tag}
          title="No Commercial Quotations Found"
          description="Quotations issued by your assigned sales team will appear here in future sales workflow phases."
        />
      </Card>
    </div>
  );
};

export default CustomerQuotationsPlaceholder;
