import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../../../context/AuthContext';
import { customerAccountService } from '../services/customerAccountService';

/**
 * Custom Hook for managing customer profile and account security settings.
 */
export const useCustomerAccount = () => {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState(user || null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        firstName: user.firstName || (user.name ? user.name.split(' ')[0] : 'Client'),
        lastName: user.lastName || (user.name ? user.name.split(' ').slice(1).join(' ') : 'User'),
        email: user.email || '',
        phone: user.phone || '',
        companyName: user.companyName || user.company || 'Enterprise Account',
        accountStatus: user.accountStatus || 'ACTIVE',
        customerId: user.id || 'CUST-001',
        createdAt: user.createdAt || new Date().toISOString(),
        ...prev,
      }));
    }
  }, [user]);

  const updateProfile = useCallback(async (formData) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await customerAccountService.updateProfile(formData);
      setProfile((prev) => ({ ...prev, ...formData, ...updated }));
      setSaving(false);
      return { success: true };
    } catch (err) {
      setSaving(false);
      const message = err.message || 'Failed to update profile details.';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  return {
    profile,
    loading,
    saving,
    error,
    updateProfile,
  };
};

export default useCustomerAccount;
