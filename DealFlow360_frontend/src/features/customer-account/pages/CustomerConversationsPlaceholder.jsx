import React from 'react';
import { MessageSquare } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Card } from '../../../components/ui/Card/Card';
import { EmptyState } from '../../../components/feedback/EmptyState/EmptyState';

export const CustomerConversationsPlaceholder = () => {
  return (
    <div className="space-y-6 text-left max-w-5xl">
      <PageHeader
        title="Commercial Conversations"
        description="Direct communication with assigned DealFlow360 sales representatives."
      />

      <Card padding="lg">
        <EmptyState
          icon={MessageSquare}
          title="No Active Conversations"
          description="Customer ↔ Salesperson messaging will be available in future sales communication phases."
        />
      </Card>
    </div>
  );
};

export default CustomerConversationsPlaceholder;
