import { apiClient } from '../../../services/api/apiClient';
import { EVENT_VISIBILITY } from '../types/requestEventTypes';

/**
 * Fallback preview store for request lifecycle audit events.
 */
let mockRequestEvents = {
  'REQ-10025': [
    {
      eventId: 'evt_101',
      requestId: 'REQ-10025',
      eventType: 'REQUEST_SUBMITTED',
      actorName: 'Acme Procurement Team',
      actorRole: 'CUSTOMER',
      visibility: EVENT_VISIBILITY.CUSTOMER_VISIBLE,
      createdAt: '2026-09-05T10:00:00.000Z',
      metadata: { description: 'Commercial request submitted for 50 Enterprise Server Rack units.' },
    },
    {
      eventId: 'evt_102',
      requestId: 'REQ-10025',
      eventType: 'REQUEST_ASSIGNED',
      actorName: 'System Automated Router',
      actorRole: 'SYSTEM',
      visibility: EVENT_VISIBILITY.CUSTOMER_VISIBLE,
      createdAt: '2026-09-05T10:05:00.000Z',
      metadata: { assignedSalespersonName: 'Sarah Jenkins' },
    },
  ],
  'REQ-10026': [
    {
      eventId: 'evt_201',
      requestId: 'REQ-10026',
      eventType: 'REQUEST_SUBMITTED',
      actorName: 'Global Logistics Procurement',
      actorRole: 'CUSTOMER',
      visibility: EVENT_VISIBILITY.CUSTOMER_VISIBLE,
      createdAt: '2026-09-04T14:30:00.000Z',
      metadata: { description: 'Request submitted for 100 Industrial Barcode Scanners.' },
    },
    {
      eventId: 'evt_202',
      requestId: 'REQ-10026',
      eventType: 'REVIEW_STARTED',
      actorName: 'Sarah Jenkins',
      actorRole: 'SALESPERSON',
      visibility: EVENT_VISIBILITY.CUSTOMER_VISIBLE,
      createdAt: '2026-09-05T08:30:00.000Z',
      metadata: { note: 'Initial specification analysis started.' },
    },
    {
      eventId: 'evt_203',
      requestId: 'REQ-10026',
      eventType: 'CLARIFICATION_REQUESTED',
      actorName: 'Sarah Jenkins',
      actorRole: 'SALESPERSON',
      visibility: EVENT_VISIBILITY.CUSTOMER_VISIBLE,
      createdAt: '2026-09-05T09:15:00.000Z',
      metadata: { question: 'Please confirm required barcode scanning engine frequency and drop spec.' },
    },
  ],
  'REQ-10027': [
    {
      eventId: 'evt_301',
      requestId: 'REQ-10027',
      eventType: 'REQUEST_SUBMITTED',
      actorName: 'Apex Purchasing Lead',
      actorRole: 'CUSTOMER',
      visibility: EVENT_VISIBILITY.CUSTOMER_VISIBLE,
      createdAt: '2026-09-05T11:45:00.000Z',
      metadata: { description: 'Request submitted for 20 Workstation Pro Ultra units.' },
    },
  ],
};

export const requestEventService = {
  /**
   * Fetch lifecycle events for a specific request.
   */
  async getRequestEvents(requestId, isCustomer = false) {
    if (!requestId) throw new Error('Request ID is required.');
    try {
      const events = await apiClient.get(`/requests/${requestId}/events`);
      if (isCustomer) {
        return events.filter((e) => e.visibility === EVENT_VISIBILITY.CUSTOMER_VISIBLE);
      }
      return events;
    } catch (err) {
      console.warn('[requestEventService] API offline. Operating on preview events store.');
      const list = mockRequestEvents[requestId] || [];
      if (isCustomer) {
        return list.filter((e) => e.visibility === EVENT_VISIBILITY.CUSTOMER_VISIBLE);
      }
      return list;
    }
  },

  /**
   * Log a new lifecycle audit event.
   */
  async addRequestEvent(requestId, eventData) {
    if (!requestId) throw new Error('Request ID is required.');
    const newEvent = {
      eventId: `evt_${Date.now()}`,
      requestId,
      eventType: eventData.eventType,
      actorName: eventData.actorName || 'Authorized User',
      actorRole: eventData.actorRole || 'SYSTEM',
      visibility: eventData.visibility || EVENT_VISIBILITY.CUSTOMER_VISIBLE,
      createdAt: new Date().toISOString(),
      metadata: eventData.metadata || {},
    };

    try {
      return await apiClient.post(`/requests/${requestId}/events`, newEvent);
    } catch (err) {
      if (!mockRequestEvents[requestId]) {
        mockRequestEvents[requestId] = [];
      }
      mockRequestEvents[requestId].push(newEvent);
      return newEvent;
    }
  },
};

export default requestEventService;
