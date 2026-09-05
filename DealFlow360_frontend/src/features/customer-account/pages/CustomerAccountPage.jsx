import React from 'react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { useCustomerAccount } from '../hooks/useCustomerAccount';
import { CustomerAccountSummary } from '../components/CustomerAccountSummary';

export const CustomerAccountPage = () => {
  const { profile } = useCustomerAccount();

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <PageHeader
        title="Account Security & Identity Parameters"
        description="Inspect customer account status, unique identity key, and encryption parameters."
      />

      <CustomerAccountSummary profile={profile} />
    </div>
  );
};

export default CustomerAccountPage;
