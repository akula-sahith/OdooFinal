import { apiClient } from '../../../services/api/apiClient';
import { EVENT_VISIBILITY } from '../types/requestEventTypes';

export const requestEventService = {
  /**
   * Fetch lifecycle events for a specific request.
   */
  async getRequestEvents(requestId, isCustomer = false) {
    if (!requestId) throw new Error('Request ID is required.');
    const numericId = String(requestId).replace(/[^0-9]/g, '');
    const logs = await apiClient.get('/audit-logs');
    const list = Array.isArray(logs) ? logs : [];
    return list
      .filter(l => String(l.entityId) === String(numericId || requestId) || String(l.entityId) === String(requestId))
      .map(l => ({
        eventId: `evt_${l.id}`,
        requestId,
        eventType: l.action,
        actorName: `User #${l.userId || 'System'}`,
        actorRole: 'SYSTEM',
        visibility: EVENT_VISIBILITY.CUSTOMER_VISIBLE,
        createdAt: l.createdAt || new Date().toISOString(),
        metadata: { changes: l.changesJson },
      }));
  },

  /**
   * Log a new lifecycle audit event.
   */
  async addRequestEvent(requestId, eventData) {
    if (!requestId) throw new Error('Request ID is required.');
    const newEvent = {
      requestId,
      eventType: eventData.eventType,
      actorName: eventData.actorName || 'Authorized User',
      actorRole: eventData.actorRole || 'SYSTEM',
      visibility: eventData.visibility || EVENT_VISIBILITY.CUSTOMER_VISIBLE,
      createdAt: new Date().toISOString(),
      metadata: eventData.metadata || {},
    };
    return await apiClient.post(`/requests/${requestId}/events`, newEvent);
  },
};

export default requestEventService;
