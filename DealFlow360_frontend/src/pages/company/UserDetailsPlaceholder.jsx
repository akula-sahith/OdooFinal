import React from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { EmptyState } from '../../components/ui/EmptyState';
import { User } from 'lucide-react';

export const UserDetailsPlaceholder = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Staff Profile: ${id}`}
        subtitle="Individual staff member details, assigned security roles, and active sessions."
        badgeText={`Staff ID: ${id}`}
        badgeVariant="purple"
      />

      <EmptyState
        icon={User}
        title={`Staff Member Profile (${id})`}
        description="Detailed permission overrides, MFA status, and activity logs for this user will load from the backend API."
        notice="API Contract Ready. No dummy user payload."
      />
    </div>
  );
};
