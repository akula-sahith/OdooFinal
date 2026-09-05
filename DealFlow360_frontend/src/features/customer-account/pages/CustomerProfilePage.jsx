import React from 'react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { useToast } from '../../../components/feedback/Toast';
import { useCustomerAccount } from '../hooks/useCustomerAccount';
import { CustomerProfileForm } from '../components/CustomerProfileForm';

export const CustomerProfilePage = () => {
  const toast = useToast();
  const { profile, updateProfile, saving } = useCustomerAccount();

  const handleSubmit = async (formData) => {
    const result = await updateProfile(formData);
    if (result.success) {
      toast.success('Contact profile updated successfully.');
    } else {
      toast.error(result.error || 'Failed to update profile.');
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <PageHeader
        title="Commercial Profile"
        description="Manage your enterprise contact details and corporate identity parameters."
      />

      <CustomerProfileForm
        initialValues={profile}
        onSubmit={handleSubmit}
        isSubmitting={saving}
      />
    </div>
  );
};

export default CustomerProfilePage;
