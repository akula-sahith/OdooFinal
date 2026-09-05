import { apiClient } from '../../../services/api/apiClient';
import { quotationService } from '../../quotations/services/quotationService';
import { mapInternalToCustomerStatus } from '../types/customerQuotationTypes';
import { validateRejectionReason, validateChangeRequest } from '../validation/customerQuotationValidation';

/**
 * Customer Identity Helper
 * Resolves current customer account identity from localStorage / auth context.
 * Server is the ultimate source of truth, but preview mode requires local context.
 */
const getCurrentCustomerContext = () => {
  try {
    const userStr = localStorage.getItem('df360_user') || localStorage.getItem('customer_user');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      return {
        customerId: userObj.customerId || userObj.id || 'CUST-001',
        customerName: userObj.name || userObj.customerName || 'Acme Corporation',
        customerEmail: userObj.email || 'procurement@acme.com',
      };
    }
  } catch (err) {
    // Fallback
  }
  return {
    customerId: 'CUST-001',
    customerName: 'Acme Corporation',
    customerEmail: 'procurement@acme.com',
  };
};

/**
 * Explicit DTO Boundary: Strips sensitive internal governance fields before returning data to Customer UI.
 */
const sanitizeCustomerQuotationDTO = (quotation) => {
  if (!quotation) return null;

  // Clone object to prevent mutating source record directly
  const copy = JSON.parse(JSON.stringify(quotation));

  // Determine customer-facing status
  const customerStatus = copy.customerStatus || mapInternalToCustomerStatus(copy.status);

  // Return clean, customer-authorized schema
  return {
    quotationId: copy.quotationId,
    quotationNumber: copy.quotationNumber,
    requestId: copy.requestId,
    requestTitle: copy.requestTitle || 'B2B Commercial Requirement',
    customerId: copy.customerId,
    customerName: copy.customerName,
    companyName: copy.companyName,
    customerEmail: copy.customerEmail,
    salespersonName: copy.salespersonName || 'Sarah Jenkins',
    salespersonEmail: copy.salespersonEmail || 's.jenkins@dealflow360.com',
    salespersonPhone: copy.salespersonPhone || '+1 (555) 019-2831',
    status: customerStatus,
    rawInternalStatus: copy.status, // Internal reference if needed for state checks
    title: copy.title,
    description: copy.description,
    currency: copy.currency || 'INR',
    validFrom: copy.validFrom,
    validUntil: copy.validUntil,
    subtotal: copy.subtotal,
    discountTotal: copy.discountTotal,
    discountPercentage: copy.discountPercentage,
    taxTotal: copy.taxTotal || 0,
    grandTotal: copy.grandTotal,
    version: copy.version || 1,
    publishedAt: copy.publishedAt || copy.createdAt,
    acceptedAt: copy.acceptedAt || null,
    acceptedBy: copy.acceptedBy || null,
    rejectedAt: copy.rejectedAt || null,
    rejectedBy: copy.rejectedBy || null,
    rejectionReason: copy.rejectionReason || null,
    items: (copy.items || []).map((item) => ({
      quotationItemId: item.quotationItemId,
      productId: item.productId,
      productNameSnapshot: item.productNameSnapshot || item.productName,
      skuSnapshot: item.skuSnapshot || item.sku,
      categorySnapshot: item.categorySnapshot || item.category,
      quantity: item.quantity,
      unitBasePrice: item.unitBasePrice,
      discountAmount: item.discountAmount,
      netLineAmount: item.netLineAmount,
      lineSubtotal: item.lineSubtotal,
      lineTotal: item.lineTotal,
      currency: item.currency || copy.currency,
    })),

    // STRICT EXCLUSIONS — Explicitly set to undefined so they never appear in JSON payload
    approvalLevel: undefined,
    internalApprovalStatus: undefined,
    discountStatus: undefined,
    discountAuthority: undefined,
    approvalRequired: undefined,
    riskLevel: undefined,
    managerComments: undefined,
    financeComments: undefined,
    internalUserIds: undefined,
    internalAuditEvents: undefined,
  };
};

/**
 * Customer Quotation API Service
 */
export const customerQuotationService = {
  /**
   * Fetch customer's quotations with filters, pagination, and ownership checks.
   */
  async getCustomerQuotations(params = {}) {
    const customerContext = getCurrentCustomerContext();

    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.pageSize) queryParams.append('limit', params.pageSize);
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);

      const res = await apiClient.get(`/customer/quotations?${queryParams.toString()}`);
      return {
        ...res,
        data: (res.data || []).map(sanitizeCustomerQuotationDTO),
      };
    } catch (err) {
      console.warn('[customerQuotationService] Backend API offline. Searching preview store.');
      return this.handleFallbackGetCustomerQuotations(params, customerContext);
    }
  },

  /**
   * Fetch single customer quotation detail by ID. Enforces ownership & IDOR checks.
   */
  async getCustomerQuotationById(quotationId) {
    if (!quotationId) throw new Error('Quotation ID is required.');
    const customerContext = getCurrentCustomerContext();

    try {
      const res = await apiClient.get(`/customer/quotations/${quotationId}`);
      return sanitizeCustomerQuotationDTO(res);
    } catch (err) {
      console.warn('[customerQuotationService] Backend API offline. Fetching from preview store.');
      const allQuotations = await quotationService.getQuotations();
      const list = allQuotations.data || allQuotations;

      const found = list.find((q) => q.quotationId === quotationId || q.quotationNumber === quotationId);
      if (!found) {
        const error = new Error('Quotation not found.');
        error.status = 404;
        throw error;
      }

      // IDOR Security Check: Verify customer ownership
      if (found.customerId && found.customerId !== customerContext.customerId) {
        const error = new Error('You do not have permission to view this quotation.');
        error.status = 403;
        throw error;
      }

      return sanitizeCustomerQuotationDTO(found);
    }
  },

  /**
   * Fetch historical published versions for a quotation.
   */
  async getQuotationVersions(quotationId) {
    if (!quotationId) throw new Error('Quotation ID is required.');

    try {
      const res = await apiClient.get(`/customer/quotations/${quotationId}/versions`);
      return (res || []).map(sanitizeCustomerQuotationDTO);
    } catch (err) {
      console.warn('[customerQuotationService] Backend API offline. Returning preview version list.');
      const current = await this.getCustomerQuotationById(quotationId);
      
      // Construct historical snapshots if available
      const v1 = {
        ...current,
        version: 1,
        publishedAt: '2026-09-05T10:00:00.000Z',
        isCurrent: current.version === 1,
      };
      
      if (current.version > 1) {
        const v2 = {
          ...current,
          version: current.version,
          publishedAt: current.publishedAt || new Date().toISOString(),
          isCurrent: true,
        };
        return [v2, v1];
      }
      
      return [v1];
    }
  },

  /**
   * Customer Accept Quotation action. Enforces state validation and optimistic concurrency.
   */
  async acceptQuotation(quotationId, expectedVersion) {
    if (!quotationId) throw new Error('Quotation ID is required.');
    const customerContext = getCurrentCustomerContext();

    try {
      const res = await apiClient.post(`/customer/quotations/${quotationId}/accept`, {
        expectedVersion,
      });
      return sanitizeCustomerQuotationDTO(res);
    } catch (err) {
      console.warn('[customerQuotationService] Backend API offline. Processing accept in preview store.');
      const target = await quotationService.getQuotationById(quotationId);

      // Concurrency check
      if (expectedVersion && target.version !== expectedVersion) {
        const conflictErr = new Error('This quotation has been updated. Please refresh to view the latest version.');
        conflictErr.status = 409;
        throw conflictErr;
      }

      // Check state
      const currentCustomerStatus = mapInternalToCustomerStatus(target.status);
      if (currentCustomerStatus === 'ACCEPTED') {
        throw new Error('This quotation has already been accepted.');
      }
      if (currentCustomerStatus === 'REJECTED') {
        throw new Error('This quotation has been rejected and cannot be accepted.');
      }
      if (currentCustomerStatus === 'EXPIRED') {
        throw new Error('This quotation has expired and cannot be accepted.');
      }

      const updated = {
        ...target,
        status: 'ACCEPTED',
        customerStatus: 'ACCEPTED',
        acceptedAt: new Date().toISOString(),
        acceptedBy: customerContext.customerName,
        updatedAt: new Date().toISOString(),
      };

      await quotationService.updateQuotation(quotationId, updated);
      return sanitizeCustomerQuotationDTO(updated);
    }
  },

  /**
   * Customer Reject Quotation action. Mandatory non-empty reason required.
   */
  async rejectQuotation(quotationId, reason, expectedVersion) {
    if (!quotationId) throw new Error('Quotation ID is required.');

    const validation = validateRejectionReason(reason);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const customerContext = getCurrentCustomerContext();

    try {
      const res = await apiClient.post(`/customer/quotations/${quotationId}/reject`, {
        reason: reason.trim(),
        expectedVersion,
      });
      return sanitizeCustomerQuotationDTO(res);
    } catch (err) {
      console.warn('[customerQuotationService] Backend API offline. Processing rejection in preview store.');
      const target = await quotationService.getQuotationById(quotationId);

      if (expectedVersion && target.version !== expectedVersion) {
        const conflictErr = new Error('This quotation has been updated. Please refresh to view the latest version.');
        conflictErr.status = 409;
        throw conflictErr;
      }

      const currentCustomerStatus = mapInternalToCustomerStatus(target.status);
      if (currentCustomerStatus === 'ACCEPTED' || currentCustomerStatus === 'REJECTED') {
        throw new Error(`Quotation is already ${currentCustomerStatus.toLowerCase()}.`);
      }

      const updated = {
        ...target,
        status: 'REJECTED',
        customerStatus: 'REJECTED',
        rejectedAt: new Date().toISOString(),
        rejectedBy: customerContext.customerName,
        rejectionReason: reason.trim(),
        updatedAt: new Date().toISOString(),
      };

      await quotationService.updateQuotation(quotationId, updated);
      return sanitizeCustomerQuotationDTO(updated);
    }
  },

  /**
   * Customer Request Changes action. Mandatory message & category.
   * Transitions quotation state to NEGOTIATION. Does NOT mutate commercial values!
   */
  async requestQuotationChanges(quotationId, data = {}, expectedVersion) {
    if (!quotationId) throw new Error('Quotation ID is required.');

    const validation = validateChangeRequest(data);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const customerContext = getCurrentCustomerContext();

    try {
      const res = await apiClient.post(`/customer/quotations/${quotationId}/request-changes`, {
        message: data.message.trim(),
        category: data.category,
        expectedVersion,
      });
      return sanitizeCustomerQuotationDTO(res);
    } catch (err) {
      console.warn('[customerQuotationService] Backend API offline. Processing change request in preview store.');
      const target = await quotationService.getQuotationById(quotationId);

      if (expectedVersion && target.version !== expectedVersion) {
        const conflictErr = new Error('This quotation has been updated. Please refresh to view the latest version.');
        conflictErr.status = 409;
        throw conflictErr;
      }

      const updated = {
        ...target,
        status: 'NEGOTIATION',
        customerStatus: 'NEGOTIATION',
        negotiationRequestedAt: new Date().toISOString(),
        lastRequestedCategory: data.category,
        lastRequestedMessage: data.message.trim(),
        updatedAt: new Date().toISOString(),
      };

      await quotationService.updateQuotation(quotationId, updated);
      return sanitizeCustomerQuotationDTO(updated);
    }
  },

  /**
   * Fallback for querying preview customer store with filtering and ownership checks.
   */
  async handleFallbackGetCustomerQuotations(params, customerContext) {
    const rawQuotationsRes = await quotationService.getQuotations(params);
    let list = rawQuotationsRes.data || rawQuotationsRes || [];

    // Ownership check: Customer only sees quotations for their organization
    list = list.filter((q) => !q.customerId || q.customerId === customerContext.customerId);

    // Apply customer-facing filters
    if (params.search) {
      const term = params.search.toLowerCase();
      list = list.filter(
        (q) =>
          q.quotationNumber.toLowerCase().includes(term) ||
          (q.title && q.title.toLowerCase().includes(term)) ||
          (q.requestId && q.requestId.toLowerCase().includes(term))
      );
    }

    if (params.status && params.status !== 'ALL') {
      list = list.filter((q) => {
        const custStatus = mapInternalToCustomerStatus(q.status);
        return custStatus === params.status || q.status === params.status;
      });
    }

    // Map and sanitize output DTO
    const sanitizedList = list.map(sanitizeCustomerQuotationDTO);

    const page = parseInt(params.page || 1, 10);
    const limit = parseInt(params.pageSize || 10, 10);
    const startIndex = (page - 1) * limit;
    const paginated = sanitizedList.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      meta: {
        total: sanitizedList.length,
        page,
        limit,
        totalPages: Math.ceil(sanitizedList.length / limit) || 1,
      },
    };
  },
};
