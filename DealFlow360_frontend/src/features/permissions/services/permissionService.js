import { apiClient } from '../../../services/api/apiClient';
import { PERMISSIONS, PERMISSION_GROUPS } from '../types/permissionTypes';

/**
 * Permission Service
 * Provides access to the centralized enterprise permission catalog and domain capability definitions.
 */
export const permissionService = {
  /**
   * Fetch all registered fine-grained permission tokens.
   */
  async getPermissions() {
    try {
      return await apiClient.get('/permissions');
    } catch (err) {
      console.warn('[permissionService] Backend API offline. Returning centralized catalog.');
      return Object.values(PERMISSIONS);
    }
  },

  /**
   * Fetch grouped domain capabilities for matrix rendering and catalog reference.
   */
  async getPermissionGroups() {
    try {
      return await apiClient.get('/permissions/groups');
    } catch (err) {
      console.warn('[permissionService] Backend API offline. Returning catalog groups.');
      return PERMISSION_GROUPS;
    }
  },
};

export default permissionService;
