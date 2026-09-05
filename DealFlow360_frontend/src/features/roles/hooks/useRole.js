import { useState, useEffect, useCallback } from 'react';
import { roleService } from '../services/roleService';

/**
 * Custom hook to fetch a single role by ID and execute role mutations (create, update, status toggle, permissions update).
 */
export const useRole = (roleId) => {
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(roleId));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const fetchRole = useCallback(async () => {
    if (!roleId) {
      setIsLoading(false);
      setRole(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await roleService.getRoleById(roleId);
      const record = data?.data || data;
      setRole(record);
    } catch (err) {
      setError(err?.message || 'Failed to load role details.');
      setRole(null);
    } finally {
      setIsLoading(false);
    }
  }, [roleId]);

  useEffect(() => {
    fetchRole();
  }, [fetchRole]);

  const createRole = async (formData) => {
    setIsSaving(true);
    setError(null);
    setFieldErrors({});

    try {
      const response = await roleService.createRole(formData);
      const created = response?.data || response;
      setRole(created);
      return { success: true, data: created };
    } catch (err) {
      const msg = err?.data?.message || err?.message || 'Failed to create security role.';
      if (err?.errors || err?.data?.errors) {
        setFieldErrors(err.errors || err.data.errors);
      }
      setError(msg);
      return { success: false, error: msg, fieldErrors: err?.errors || err?.data?.errors };
    } finally {
      setIsSaving(false);
    }
  };

  const updateRole = async (formData) => {
    if (!roleId) return { success: false, error: 'Role ID is required.' };

    setIsSaving(true);
    setError(null);
    setFieldErrors({});

    try {
      const response = await roleService.updateRole(roleId, formData);
      const updated = response?.data || response;
      setRole(updated);
      return { success: true, data: updated };
    } catch (err) {
      const msg = err?.data?.message || err?.message || 'Failed to update security role.';
      if (err?.errors || err?.data?.errors) {
        setFieldErrors(err.errors || err.data.errors);
      }
      setError(msg);
      return { success: false, error: msg, fieldErrors: err?.errors || err?.data?.errors };
    } finally {
      setIsSaving(false);
    }
  };

  const toggleStatus = async () => {
    if (!role) return { success: false, error: 'No role loaded.' };
    const targetStatus = role.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    setIsSaving(true);
    try {
      const response = await roleService.updateRoleStatus(role.id, targetStatus);
      const updated = response?.data || response;
      setRole((prev) => ({ ...prev, status: targetStatus }));
      return { success: true, data: updated, newStatus: targetStatus };
    } catch (err) {
      const msg = err?.message || 'Failed to update role status.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsSaving(false);
    }
  };

  const updatePermissions = async (permissionKeys = []) => {
    if (!roleId) return { success: false, error: 'Role ID is required.' };

    setIsSaving(true);
    setError(null);

    try {
      const response = await roleService.updateRolePermissions(roleId, permissionKeys);
      const updated = response?.data || response;
      setRole((prev) => ({ ...prev, permissions: [...permissionKeys] }));
      return { success: true, data: updated };
    } catch (err) {
      const msg = err?.message || 'Failed to update role permissions.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsSaving(false);
    }
  };

  return {
    role,
    isLoading,
    loading: isLoading,
    isSaving,
    saving: isSaving,
    error,
    fieldErrors,
    refetch: fetchRole,
    createRole,
    updateRole,
    toggleStatus,
    updatePermissions,
  };
};

export default useRole;
