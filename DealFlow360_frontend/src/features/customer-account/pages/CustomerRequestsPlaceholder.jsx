import React from 'react';
import { FileText } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Card } from '../../../components/ui/Card/Card';
import { EmptyState } from '../../../components/feedback/EmptyState/EmptyState';

export const CustomerRequestsPlaceholder = () => {
  return (
    <div className="space-y-6 text-left max-w-5xl">
      <PageHeader
        title="My Commercial Proposals & Requests"
        description="Requirement submissions, customized procurement requests, and specifications."
      />

      <Card padding="lg">
        <EmptyState
          icon={FileText}
          title="No Commercial Requests Submitted Yet"
          description="Commercial requirement submission workflows will be available in future sales phases."
        />
      </Card>
    </div>
  );
};

export default CustomerRequestsPlaceholder;
