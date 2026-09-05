import { apiClient } from '../../../services/api/apiClient';
import { requestEventService } from '../../requests/services/requestEventService';
import { notificationService } from '../../notifications/services/notificationService';

/**
 * Fallback preview store for customer requests when backend API is offline.
 * SINGLE SOURCE OF TRUTH shared between Customer Portal & Salesperson Workspace.
 */
let mockRequests = [
  {
    id: 'REQ-10025',
    requestId: 'REQ-10025',
    customerId: 'CUST-001',
    customerName: 'Acme Corporation',
    companyName: 'Acme Corporation',
    customerEmail: 'procurement@acme.com',
    customerPhone: '+1 (555) 234-5678',
    assignedSalespersonId: 'SP-014',
    assignedSalespersonName: 'Sarah Jenkins',
    title: 'Bulk Enterprise Server Rack Procurement',
    description: 'Requires 50 units of high-density server rack units with dual power supplies for Q4 deployment.',
    productId: 'PROD-001',
    productName: 'Enterprise Server Rack Tier 4',
    quantity: 50,
    priority: 'HIGH',
    status: 'SUBMITTED',
    createdAt: '2026-09-05T10:00:00.000Z',
    updatedAt: '2026-09-05T10:00:00.000Z',
  },
  {
    id: 'REQ-10026',
    requestId: 'REQ-10026',
    customerId: 'CUST-002',
    customerName: 'Global Logistics Inc',
    companyName: 'Global Logistics Inc',
    customerEmail: 'supplies@globallogistics.com',
    customerPhone: '+1 (555) 876-5432',
    assignedSalespersonId: 'SP-014',
    assignedSalespersonName: 'Sarah Jenkins',
    title: 'Industrial Barcode Scanners Pack',
    description: 'Need quotation for 100 rugged wireless handheld barcode scanners with charging docks.',
    productId: 'PROD-004',
    productName: 'Rugged Handheld Barcode Scanner X-200',
    quantity: 100,
    priority: 'URGENT',
    status: 'REQUIREMENT_CLARIFICATION',
    createdAt: '2026-09-04T14:30:00.000Z',
    updatedAt: '2026-09-05T09:15:00.000Z',
  },
  {
    id: 'REQ-10027',
    requestId: 'REQ-10027',
    customerId: 'CUST-003',
    customerName: 'Apex Tech Solutions',
    companyName: 'Apex Tech Solutions',
    customerEmail: 'purchasing@apextech.com',
    customerPhone: '+1 (555) 999-1122',
    assignedSalespersonId: null,
    assignedSalespersonName: 'Unassigned',
    title: 'Cloud Workstation Infrastructure Hardware',
    description: 'Seeking hardware specs for 20 high-performance engineering workstations with liquid cooling.',
    productId: 'PROD-002',
    productName: 'Workstation Pro Ultra X9',
    quantity: 20,
    priority: 'NORMAL',
    status: 'SUBMITTED',
    createdAt: '2026-09-05T11:45:00.000Z',
    updatedAt: '2026-09-05T11:45:00.000Z',
  },
];

export const getSharedRequestsStore = () => mockRequests;

/**
 * Customer Request Service Layer
 * Manages B2B requirement requests, lifecycle transitions, and salesperson assignments.
 */
export const customerRequestService = {
  /**
   * Fetch paginated list of requirement requests for the authenticated customer.
   */
  async getRequests(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.pageSize) queryParams.append('limit', params.pageSize);
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.priority) queryParams.append('priority', params.priority);

      const queryString = queryParams.toString();
      const endpoint = `/customer/requests${queryString ? `?${queryString}` : ''}`;
      return await apiClient.get(endpoint);
    } catch (err) {
      console.warn('[customerRequestService] Backend API offline. Operating in preview mode.');
      return this.handleFallbackGetRequests(params);
    }
  },

  /**
   * Fetch single request detail by ID.
   */
  async getRequestById(requestId) {
    if (!requestId) throw new Error('Request ID is required.');
    try {
      return await apiClient.get(`/customer/requests/${requestId}`);
    } catch (err) {
      console.warn('[customerRequestService] Backend API offline. Operating in preview mode.');
      const record = mockRequests.find((r) => r.id === requestId || r.requestId === requestId);
      if (!record) {
        const error = new Error('Requirement request not found or access denied.');
        error.status = 404;
        throw error;
      }
      return record;
    }
  },

  /**
   * Create a new requirement request (as DRAFT or SUBMITTED).
   */
  async createRequest(requestData) {
    try {
      return await apiClient.post('/customer/requests', requestData);
    } catch (err) {
      console.warn('[customerRequestService] Backend API offline. Creating in preview store.');

      const newId = `REQ-${1000 + mockRequests.length + 1}`;
      const status = requestData.isSubmit ? 'SUBMITTED' : requestData.status || 'DRAFT';

      const newRecord = {
        id: newId,
        requestId: newId,
        customerId: requestData.customerId || 'CUST-001',
        assignedSalespersonId: null,
        assignedSalespersonName: 'Unassigned',
        title: requestData.title.trim(),
        description: requestData.description.trim(),
        productId: requestData.productId || null,
        productName: requestData.productName || null,
        quantity: requestData.quantity ? Number(requestData.quantity) : null,
        priority: requestData.priority || 'NORMAL',
        status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockRequests.unshift(newRecord);
      return newRecord;
    }
  },

  /**
   * Update existing draft request.
   */
  async updateRequest(requestId, requestData) {
    if (!requestId) throw new Error('Request ID is required.');
    try {
      return await apiClient.put(`/customer/requests/${requestId}`, requestData);
    } catch (err) {
      console.warn('[customerRequestService] Backend API offline. Updating in preview store.');
      const index = mockRequests.findIndex((r) => r.id === requestId || r.requestId === requestId);
      if (index === -1) {
        const error = new Error('Requirement request not found.');
        error.status = 404;
        throw error;
      }

      const updatedRecord = {
        ...mockRequests[index],
        ...requestData,
        updatedAt: new Date().toISOString(),
      };

      mockRequests[index] = updatedRecord;
      return updatedRecord;
    }
  },

  /**
   * Transition request from DRAFT to SUBMITTED.
   */
  async submitRequest(requestId) {
    if (!requestId) throw new Error('Request ID is required.');
    try {
      return await apiClient.post(`/customer/requests/${requestId}/submit`);
    } catch (err) {
      console.warn('[customerRequestService] Backend API offline. Submitting in preview store.');
      const record = mockRequests.find((r) => r.id === requestId || r.requestId === requestId);
      if (!record) {
        const error = new Error('Requirement request not found.');
        error.status = 404;
        throw error;
      }

      record.status = 'SUBMITTED';
      record.updatedAt = new Date().toISOString();

      // Log request event
      requestEventService.addRequestEvent(requestId, {
        eventType: 'REQUEST_SUBMITTED',
        actorName: record.customerName || 'Customer Client',
        actorRole: 'CUSTOMER',
        visibility: 'CUSTOMER_VISIBLE',
        metadata: { description: `Submitted requirement "${record.title}".` },
      });

      // Send notification to Sales Team
      notificationService.createNotification({
        userType: 'SALESPERSON',
        type: 'NEW_REQUEST',
        title: 'New Commercial Request Submitted',
        message: `Request ${record.requestId} "${record.title}" was submitted by ${record.companyName || record.customerName}.`,
        requestId: record.requestId,
      });

      return record;
    }
  },

  /**
   * Transition request to CANCELLED state.
   */
  async cancelRequest(requestId) {
    if (!requestId) throw new Error('Request ID is required.');
    try {
      return await apiClient.post(`/customer/requests/${requestId}/cancel`);
    } catch (err) {
      console.warn('[customerRequestService] Backend API offline. Cancelling in preview store.');
      const record = mockRequests.find((r) => r.id === requestId || r.requestId === requestId);
      if (!record) {
        const error = new Error('Requirement request not found.');
        error.status = 404;
        throw error;
      }

      record.status = 'CANCELLED';
      record.updatedAt = new Date().toISOString();
      return record;
    }
  },

  handleFallbackGetRequests(params) {
    let filtered = [...mockRequests];

    if (params.search) {
      const term = params.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(term) ||
          r.requestId.toLowerCase().includes(term) ||
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

export default customerRequestService;
