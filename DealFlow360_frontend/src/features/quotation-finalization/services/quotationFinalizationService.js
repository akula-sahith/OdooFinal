import { apiClient } from '../../../services/api/apiClient';
import { quotationService } from '../../quotations/services/quotationService';
import { ORDER_READINESS_STATUS } from '../types/quotationFinalizationTypes';
import { validateFinalizationState } from '../validation/quotationFinalizationValidation';

/**
 * Preview store for immutable commercial snapshots keyed by quotationId.
 */
let mockCommercialSnapshots = {};

/**
 * Helper to construct an immutable snapshot object from an accepted quotation.
 */
const buildCommercialSnapshot = (quotation) => {
  return {
    snapshotId: `snap_${quotation.quotationId}_v${quotation.version}`,
    quotationId: quotation.quotationId,
    quotationNumber: quotation.quotationNumber,
    quotationVersion: quotation.version,
    requestId: quotation.requestId,
    requestTitle: quotation.requestTitle || 'B2B Commercial Requirement',
    customerId: quotation.customerId,
    customerName: quotation.customerName,
    companyName: quotation.companyName,
    customerEmail: quotation.customerEmail,
    salespersonId: quotation.salespersonId,
    salespersonName: quotation.salespersonName || 'Sarah Jenkins',
    salespersonEmail: quotation.salespersonEmail || 's.jenkins@dealflow360.com',
    currency: quotation.currency || 'INR',
    subtotal: quotation.subtotal,
    discountTotal: quotation.discountTotal,
    discountPercentage: quotation.discountPercentage,
    taxTotal: quotation.taxTotal || 0,
    grandTotal: quotation.grandTotal,
    validFrom: quotation.validFrom,
    validUntil: quotation.validUntil,
    acceptedAt: quotation.acceptedAt || new Date().toISOString(),
    acceptedBy: quotation.acceptedBy || quotation.customerName || 'Customer Authorized Representative',
    commercialTerms: quotation.description || 'Standard Net 30 Commercial Agreement',
    status: 'COMMERCIALLY_CLOSED',
    orderReadinessStatus: ORDER_READINESS_STATUS.READY_FOR_ORDER,
    frozenAt: new Date().toISOString(),
    items: (quotation.items || []).map((item) => ({
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
      currency: item.currency || quotation.currency,
    })),
  };
};

export const quotationFinalizationService = {
  /**
   * Fetch finalization overview for a quotation.
   */
  async getFinalizationDetails(quotationId) {
    if (!quotationId) throw new Error('Quotation ID is required.');

    try {
      return await apiClient.get(`/company/quotations/${quotationId}/finalization`);
    } catch (err) {
      console.warn('[quotationFinalizationService] Backend API offline. Fetching preview finalization.');
      const quotation = await quotationService.getQuotationById(quotationId);

      // Check if snapshot already exists
      let snapshot = mockCommercialSnapshots[quotationId];
      if (!snapshot && (quotation.status === 'ACCEPTED' || quotation.status === 'COMMERCIALLY_CLOSED')) {
        snapshot = buildCommercialSnapshot(quotation);
        mockCommercialSnapshots[quotationId] = snapshot;
      }

      const versions = await this.getQuotationVersions(quotationId);

      return {
        quotation,
        snapshot: snapshot || null,
        versions,
        orderReadinessStatus: snapshot ? ORDER_READINESS_STATUS.READY_FOR_ORDER : ORDER_READINESS_STATUS.NOT_READY,
      };
    }
  },

  /**
   * Fetch all historical versions of a quotation.
   */
  async getQuotationVersions(quotationId) {
    if (!quotationId) throw new Error('Quotation ID is required.');

    try {
      return await apiClient.get(`/company/quotations/${quotationId}/versions`);
    } catch (err) {
      const quotation = await quotationService.getQuotationById(quotationId);

      // Preview versions
      const list = [
        {
          quotationVersionId: `ver_${quotationId}_v1`,
          quotationId: quotation.quotationId,
          version: 1,
          grandTotal: quotation.grandTotal * 1.05, // Previous higher price
          discountPercentage: Math.max(0, quotation.discountPercentage - 2),
          status: quotation.version > 1 ? 'SUPERSEDED' : quotation.status,
          customerVisibility: 'PUBLISHED',
          createdAt: '2026-09-05T10:00:00.000Z',
          createdBy: quotation.salespersonName || 'Sarah Jenkins',
          isCurrent: quotation.version === 1,
        },
      ];

      if (quotation.version > 1) {
        list.unshift({
          quotationVersionId: `ver_${quotationId}_v${quotation.version}`,
          quotationId: quotation.quotationId,
          version: quotation.version,
          grandTotal: quotation.grandTotal,
          discountPercentage: quotation.discountPercentage,
          status: quotation.status === 'ACCEPTED' ? 'ACCEPTED' : 'CURRENT',
          customerVisibility: 'PUBLISHED',
          createdAt: quotation.updatedAt || new Date().toISOString(),
          createdBy: quotation.salespersonName || 'Sarah Jenkins',
          isCurrent: true,
        });
      }

      return list;
    }
  },

  /**
   * Compare two versions side-by-side and calculate delta.
   */
  async getVersionComparison(quotationId, versionANum, versionBNum) {
    if (!quotationId) throw new Error('Quotation ID is required.');

    try {
      return await apiClient.get(
        `/company/quotations/${quotationId}/compare?versionA=${versionANum}&versionB=${versionBNum}`
      );
    } catch (err) {
      console.warn('[quotationFinalizationService] Calculating version comparison locally.');
      const baseQuotation = await quotationService.getQuotationById(quotationId);

      const verAObj = {
        version: versionANum,
        subtotal: baseQuotation.subtotal * (versionANum === 1 ? 1.05 : 1),
        discountTotal: baseQuotation.discountTotal,
        discountPercentage: versionANum === 1 ? 5 : baseQuotation.discountPercentage,
        grandTotal: baseQuotation.grandTotal * (versionANum === 1 ? 1.05 : 1),
        items: baseQuotation.items || [],
      };

      const verBObj = {
        version: versionBNum,
        subtotal: baseQuotation.subtotal,
        discountTotal: baseQuotation.discountTotal,
        discountPercentage: baseQuotation.discountPercentage,
        grandTotal: baseQuotation.grandTotal,
        items: baseQuotation.items || [],
      };

      const totalDelta = verBObj.grandTotal - verAObj.grandTotal;
      const discountDelta = verBObj.discountPercentage - verAObj.discountPercentage;

      return {
        versionA: verAObj,
        versionB: verBObj,
        delta: {
          totalDelta,
          discountDelta,
          itemsChanged: 0,
        },
      };
    }
  },

  /**
   * Fetch frozen commercial snapshot.
   */
  async getCommercialSnapshot(quotationId) {
    if (!quotationId) throw new Error('Quotation ID is required.');

    try {
      return await apiClient.get(`/company/quotations/${quotationId}/snapshot`);
    } catch (err) {
      if (mockCommercialSnapshots[quotationId]) {
        return mockCommercialSnapshots[quotationId];
      }
      const quotation = await quotationService.getQuotationById(quotationId);
      if (quotation.status === 'ACCEPTED' || quotation.status === 'COMMERCIALLY_CLOSED') {
        const snap = buildCommercialSnapshot(quotation);
        mockCommercialSnapshots[quotationId] = snap;
        return snap;
      }
      throw new Error('No commercial snapshot exists for this quotation.');
    }
  },

  /**
   * Finalize an accepted quotation into an immutable commercial snapshot.
   */
  async finalizeAcceptedQuotation(quotationId) {
    if (!quotationId) throw new Error('Quotation ID is required.');

    try {
      return await apiClient.post(`/company/quotations/${quotationId}/finalize`);
    } catch (err) {
      console.warn('[quotationFinalizationService] Finalizing accepted quotation in preview store.');
      const quotation = await quotationService.getQuotationById(quotationId);

      const check = validateFinalizationState(quotation);
      if (!check.canFinalize) {
        throw new Error(check.error);
      }

      // Build & lock snapshot
      const snapshot = buildCommercialSnapshot(quotation);
      mockCommercialSnapshots[quotationId] = snapshot;

      // Update main quotation status to COMMERCIALLY_CLOSED
      const updatedQuotation = {
        ...quotation,
        status: 'COMMERCIALLY_CLOSED',
        orderReadinessStatus: ORDER_READINESS_STATUS.READY_FOR_ORDER,
        updatedAt: new Date().toISOString(),
      };

      await quotationService.updateQuotation(quotationId, updatedQuotation);

      return {
        quotation: updatedQuotation,
        snapshot,
        orderReadinessStatus: ORDER_READINESS_STATUS.READY_FOR_ORDER,
      };
    }
  },

  /**
   * Check order readiness status for a quotation.
   */
  async getOrderReadiness(quotationId) {
    const snapshot = await this.getCommercialSnapshot(quotationId).catch(() => null);
    if (!snapshot) {
      return {
        status: ORDER_READINESS_STATUS.NOT_READY,
        isReady: false,
        handoffPayload: null,
      };
    }

    return {
      status: ORDER_READINESS_STATUS.READY_FOR_ORDER,
      isReady: true,
      handoffPayload: {
        quotationId: snapshot.quotationId,
        quotationVersion: snapshot.quotationVersion,
        customerId: snapshot.customerId,
        customerName: snapshot.customerName,
        companyName: snapshot.companyName,
        currency: snapshot.currency,
        lineItems: snapshot.items,
        subtotal: snapshot.subtotal,
        discountTotal: snapshot.discountTotal,
        taxTotal: snapshot.taxTotal,
        grandTotal: snapshot.grandTotal,
        acceptedAt: snapshot.acceptedAt,
        commercialTerms: snapshot.commercialTerms,
      },
    };
  },
};
