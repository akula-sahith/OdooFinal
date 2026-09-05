import React from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { EmptyState } from '../../components/ui/EmptyState';
import { Shield } from 'lucide-react';

export const RoleDetailsPlaceholder = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Security Role: ${id}`}
        subtitle="Detailed permission matrix, resource access boundaries, and assigned staff members."
        badgeText={`Role ID: ${id}`}
        badgeVariant="warning"
      />

      <EmptyState
        icon={Shield}
        title={`Role Specification Matrix (${id})`}
        description="Permission check lists, resource scope limits, and user assignments will be defined in Phase 3."
        notice="API Contract Ready. No dummy role permissions payload."
      />
    </div>
  );
};
