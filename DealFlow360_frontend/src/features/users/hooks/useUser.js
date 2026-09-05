import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';

/**
 * Custom Hook for fetching and mutating a single Staff User record.
 */
export const useUser = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchUser = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUserById(userId);
      setUser(data);
    } catch (err) {
      console.error('[useUser] Failed to fetch staff user:', err);
      setError(err.message || 'Staff user record not found.');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const createUser = async (formData) => {
    setSaving(true);
    try {
      const created = await userService.createUser(formData);
      setSaving(false);
      return { success: true, data: created };
    } catch (err) {
      setSaving(false);
      return {
        success: false,
        error: err.message || 'Failed to create staff user.',
        errors: err.errors || {},
      };
    }
  };

  const updateUser = async (formData) => {
    if (!userId) return { success: false, error: 'User ID is required.' };
    setSaving(true);
    try {
      const updated = await userService.updateUser(userId, formData);
      setUser((prev) => ({ ...prev, ...updated }));
      setSaving(false);
      return { success: true, data: updated };
    } catch (err) {
      setSaving(false);
      return {
        success: false,
        error: err.message || 'Failed to update staff user.',
        errors: err.errors || {},
      };
    }
  };

  const updateStatus = async (newStatus) => {
    if (!userId) return { success: false, error: 'User ID is required.' };
    setSaving(true);
    try {
      const updated = await userService.updateUserStatus(userId, newStatus);
      setUser((prev) => ({ ...prev, status: updated.status, updatedAt: updated.updatedAt }));
      setSaving(false);
      return { success: true, data: updated };
    } catch (err) {
      setSaving(false);
      return {
        success: false,
        error: err.message || 'Failed to update user status.',
      };
    }
  };

  return {
    user,
    loading,
    error,
    saving,
    fetchUser,
    createUser,
    updateUser,
    updateStatus,
  };
};

export default useUser;
