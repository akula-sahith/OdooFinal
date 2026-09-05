import { apiClient } from '../../../services/api/apiClient';
import { getSharedRequestsStore } from '../../customer-requests/services/customerRequestService';
import { conversationService } from '../../conversations/services/conversationService';
import { requestEventService } from '../../requests/services/requestEventService';
import { notificationService } from '../../notifications/services/notificationService';

/**
 * Salesperson Request Service Layer
 * Interacts with backend sales endpoints or shared in-memory preview store.
 * Operates on the SAME Request and Conversation resources as Customer Portal.
 */
export const salespersonRequestService = {
  /**
   * Fetch requests assigned to or accessible by the authenticated salesperson.
   */
  async getAssignedRequests(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.pageSize) queryParams.append('limit', params.pageSize);
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.priority) queryParams.append('priority', params.priority);
      if (params.assignment) queryParams.append('assignment', params.assignment);

      const queryString = queryParams.toString();
      const endpoint = `/sales/requests${queryString ? `?${queryString}` : ''}`;
      return await apiClient.get(endpoint);
    } catch (err) {
      console.warn('[salespersonRequestService] Backend API offline. Operating on shared preview store.');
      return this.handleFallbackGetRequests(params);
    }
  },

  /**
   * Fetch single request detail by ID.
   */
  async getRequestById(requestId) {
    if (!requestId) throw new Error('Request ID is required.');
    try {
      return await apiClient.get(`/sales/requests/${requestId}`);
    } catch (err) {
      console.warn('[salespersonRequestService] Backend API offline. Operating on shared preview store.');
      const store = getSharedRequestsStore();
      const record = store.find((r) => r.id === requestId || r.requestId === requestId);
      if (!record) {
        const error = new Error('Requirement request not found or access denied.');
        error.status = 404;
        throw error;
      }
      return record;
    }
  },

  /**
   * Claim an unassigned request for the authenticated salesperson.
   */
  async claimRequest(requestId, salespersonInfo = {}) {
    if (!requestId) throw new Error('Request ID is required.');
    try {
      return await apiClient.post(`/sales/requests/${requestId}/claim`);
    } catch (err) {
      console.warn('[salespersonRequestService] Backend API offline. Claiming in shared preview store.');
      const store = getSharedRequestsStore();
      const record = store.find((r) => r.id === requestId || r.requestId === requestId);
      if (!record) {
        throw new Error('Requirement request not found.');
      }

      record.assignedSalespersonId = salespersonInfo.id || 'SP-014';
      record.assignedSalespersonName = salespersonInfo.name || 'Sarah Jenkins (You)';
      record.updatedAt = new Date().toISOString();
      return record;
    }
  },

  /**
   * Start reviewing a request (Transition SUBMITTED -> UNDER_REVIEW).
   */
  async startReview(requestId) {
    if (!requestId) throw new Error('Request ID is required.');
    try {
      return await apiClient.post(`/sales/requests/${requestId}/start-review`);
    } catch (err) {
      console.warn('[salespersonRequestService] Backend API offline. Transitioning to UNDER_REVIEW.');
      const store = getSharedRequestsStore();
      const record = store.find((r) => r.id === requestId || r.requestId === requestId);
      if (!record) {
        throw new Error('Requirement request not found.');
      }

      record.status = 'UNDER_REVIEW';
      record.updatedAt = new Date().toISOString();

      // Log request event
      requestEventService.addRequestEvent(requestId, {
        eventType: 'REVIEW_STARTED',
        actorName: record.assignedSalespersonName || 'Sales Lead',
        actorRole: 'SALESPERSON',
        visibility: 'CUSTOMER_VISIBLE',
        metadata: { description: 'Sales Engineer initiated requirement review.' },
      });

      // Send notification to Customer
      notificationService.createNotification({
        userType: 'CUSTOMER',
        recipientId: record.customerId,
        type: 'REQUEST_STATUS_CHANGED',
        title: 'Sales Review Started',
        message: `Your request ${record.requestId} is now under active review by ${record.assignedSalespersonName || 'Sales Team'}.`,
        requestId: record.requestId,
      });

      return record;
    }
  },

  /**
   * Request clarification from customer (Transition UNDER_REVIEW -> REQUIREMENT_CLARIFICATION + send message).
   */
  async requestClarification(requestId, messageContent, salespersonInfo = {}) {
    if (!requestId) throw new Error('Request ID is required.');
    if (!messageContent || !messageContent.trim()) {
      throw new Error('Clarification message content is required.');
    }

    try {
      return await apiClient.post(`/sales/requests/${requestId}/clarification`, {
        message: messageContent.trim(),
      });
    } catch (err) {
      console.warn('[salespersonRequestService] Backend API offline. Requesting clarification in preview store.');
      const store = getSharedRequestsStore();
      const record = store.find((r) => r.id === requestId || r.requestId === requestId);
      if (!record) {
        throw new Error('Requirement request not found.');
      }

      record.status = 'REQUIREMENT_CLARIFICATION';
      record.updatedAt = new Date().toISOString();

      // Send clarification message to the customer in the shared conversation
      const conv = await conversationService.getConversation(requestId);
      await conversationService.sendMessage(conv.id, messageContent.trim(), {
        senderType: 'SALESPERSON',
        senderName: salespersonInfo.name || 'Sarah Jenkins (Sales Representative)',
      });

      // Log request event
      requestEventService.addRequestEvent(requestId, {
        eventType: 'CLARIFICATION_REQUESTED',
        actorName: salespersonInfo.name || 'Sarah Jenkins',
        actorRole: 'SALESPERSON',
        visibility: 'CUSTOMER_VISIBLE',
        metadata: { question: messageContent.trim() },
      });

      // Send notification to Customer
      notificationService.createNotification({
        userType: 'CUSTOMER',
        recipientId: record.customerId,
        type: 'CLARIFICATION_REQUESTED',
        title: 'Requirement Clarification Requested',
        message: `Sales Engineer requested details on ${record.requestId}: "${messageContent.trim().substring(0, 50)}..."`,
        requestId: record.requestId,
      });

      return record;
    }
  },

  /**
   * Confirm customer requirement (Transition UNDER_REVIEW / REQUIREMENT_CLARIFICATION -> REQUIREMENT_CONFIRMED).
   * Handoff point for future quotation creation.
   */
  async confirmRequirement(requestId, notes = '') {
    if (!requestId) throw new Error('Request ID is required.');
    try {
      return await apiClient.post(`/sales/requests/${requestId}/confirm`, { notes });
    } catch (err) {
      console.warn('[salespersonRequestService] Backend API offline. Confirming requirement in preview store.');
      const store = getSharedRequestsStore();
      const record = store.find((r) => r.id === requestId || r.requestId === requestId);
      if (!record) {
        throw new Error('Requirement request not found.');
      }

      record.status = 'REQUIREMENT_CONFIRMED';
      record.confirmedAt = new Date().toISOString();
      record.updatedAt = new Date().toISOString();
      if (notes) {
        record.confirmationNotes = notes;
      }

      // Log request event
      requestEventService.addRequestEvent(requestId, {
        eventType: 'REQUIREMENT_CONFIRMED',
        actorName: record.assignedSalespersonName || 'Sales Lead',
        actorRole: 'SALESPERSON',
        visibility: 'CUSTOMER_VISIBLE',
        metadata: { description: 'Commercial requirement specifications confirmed and verified.' },
      });

      // Send notification to Customer
      notificationService.createNotification({
        userType: 'CUSTOMER',
        recipientId: record.customerId,
        type: 'REQUIREMENT_CONFIRMED',
        title: 'Requirement Specifications Confirmed',
        message: `Requirement specifications for ${record.requestId} have been confirmed. Ready for quotation drafting.`,
        requestId: record.requestId,
      });

      // Add system announcement message into shared conversation
      try {
        const conv = await conversationService.getConversation(requestId);
        await conversationService.sendMessage(conv.id, `[SYSTEM] Commercial requirements have been confirmed by Sales Engineer. This request is ready for quotation generation.`, {
          senderType: 'SYSTEM',
          senderName: 'DealFlow360 Workflow',
        });
      } catch (e) {
        // ignore
      }

      return record;
    }
  },

  /**
   * Close requirement request.
   */
  async closeRequest(requestId, reason = '') {
    if (!requestId) throw new Error('Request ID is required.');
    try {
      return await apiClient.post(`/sales/requests/${requestId}/close`, { reason });
    } catch (err) {
      console.warn('[salespersonRequestService] Backend API offline. Closing request in preview store.');
      const store = getSharedRequestsStore();
      const record = store.find((r) => r.id === requestId || r.requestId === requestId);
      if (!record) {
        throw new Error('Requirement request not found.');
      }

      record.status = 'CLOSED';
      record.updatedAt = new Date().toISOString();
      return record;
    }
  },

  handleFallbackGetRequests(params) {
    const store = getSharedRequestsStore();
    let filtered = [...store];

    // Filter assigned vs unassigned vs all
    if (params.assignment === 'MINE') {
      filtered = filtered.filter((r) => r.assignedSalespersonId === 'SP-014');
    } else if (params.assignment === 'UNASSIGNED') {
      filtered = filtered.filter((r) => !r.assignedSalespersonId);
    }

    if (params.search) {
      const term = params.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(term) ||
          r.requestId.toLowerCase().includes(term) ||
          (r.customerName && r.customerName.toLowerCase().includes(term)) ||
          (r.companyName && r.companyName.toLowerCase().includes(term)) ||
          r.description.toLowerCase().includes(term)
      );
    }

    if (params.status && params.status !== 'ALL') {
      filtered = filtered.filter((r) => r.status === params.status);
    }

    if (params.priority && params.priority !== 'ALL') {
      filtered = filtered.filter((r) => r.priority === params.priority);
    }

    const page = parseInt(params.page || 1, 10);
    const limit = parseInt(params.pageSize || 10, 10);
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      meta: {
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit) || 1,
      },
    };
  },
};

export default salespersonRequestService;
