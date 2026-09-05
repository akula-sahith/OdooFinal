import { useState, useEffect, useCallback } from 'react';
import { permissionService } from '../services/permissionService';

/**
 * Hook to load permission groups catalog for governance inspection.
 */
export const usePermissionsCatalogue = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await permissionService.getPermissionGroups();
      setGroups(result || []);
    } catch (err) {
      console.error('[usePermissionsCatalogue] Failed to fetch permission catalog:', err);
      setError(err.message || 'Failed to load permission catalog.');
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const filteredGroups = groups
    .map((group) => {
      if (!search.trim()) return group;
      const term = search.toLowerCase();
      const groupMatches =
        group.title.toLowerCase().includes(term) || group.description.toLowerCase().includes(term);

      const matchingPermissions = group.permissions.filter(
        (p) =>
          p.label.toLowerCase().includes(term) ||
          p.key.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.action.toLowerCase().includes(term)
      );

      if (groupMatches || matchingPermissions.length > 0) {
        return {
          ...group,
          permissions: groupMatches ? group.permissions : matchingPermissions,
        };
      }
      return null;
    })
    .filter(Boolean);

  return {
    groups: filteredGroups,
    rawGroups: groups,
    loading,
    error,
    search,
    setSearch,
    refetch: fetchCatalog,
  };
};

export default usePermissionsCatalogue;
