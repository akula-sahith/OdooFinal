import { apiClient } from '../../../services/api/apiClient';
import { getSharedRequestsStore } from '../../customer-requests/services/customerRequestService';
import { priceListService } from '../../price-lists/services/priceListService';
import { productService } from '../../products/services/productService';
import { discountGovernanceService } from './discountGovernanceService';
import {
  calculateLineSubtotal,
  calculateLineDiscountAmount,
  calculateNetLineAmount,
  calculateSubtotal,
  calculateDiscountTotal,
  calculateGrandTotal,
  calculateEffectiveDiscountPercentage,
} from '../utils/quotationCalculations';

/**
 * Master Price List to Product Price Mapping (Fallback Data Source)
 */
const MOCK_PRICE_LIST_ENTRIES = {
  'PL-001': {
    'PROD-001': 50000,
    'PROD-002': 120000,
    'PROD-003': 35000,
    'PROD-004': 18000,
  },
  'PL-002': {
    'PROD-001': 650,
    'PROD-002': 1500,
    'PROD-003': 450,
    'PROD-004': 220,
  },
};

/**
 * Fallback preview store for quotations.
 */
let mockQuotations = [
  {
    quotationId: 'QTN-2026-00001',
    quotationNumber: 'QTN-2026-00001',
    requestId: 'REQ-10025',
    requestTitle: 'Bulk Enterprise Server Rack Procurement',
    customerId: 'CUST-001',
    customerName: 'Acme Corporation',
    companyName: 'Acme Corporation',
    customerEmail: 'procurement@acme.com',
    salespersonId: 'SP-014',
    salespersonName: 'Sarah Jenkins',
    priceListId: 'PL-001',
    priceListName: 'Standard INR Commercial Catalog',
    status: 'DRAFT',
    title: 'Commercial Proposal for 50 Server Rack Units',
    description: 'Preliminary pricing offer based on confirmed requirement specs.',
    currency: 'INR',
    validFrom: '2026-09-05',
    validUntil: '2026-10-05',
    subtotal: 2500000,
    discountTotal: 0,
    discountPercentage: 0,
    discountStatus: 'WITHIN_AUTHORITY',
    discountAuthority: 'Salesperson',
    approvalRequired: false,
    approvalLevel: 'NONE',
    riskLevel: 'NORMAL',
    taxTotal: 0,
    grandTotal: 2500000,
    version: 1,
    createdAt: '2026-09-05T12:00:00.000Z',
    updatedAt: '2026-09-05T12:00:00.000Z',
    items: [
      {
        quotationItemId: 'qitem_101',
        quotationId: 'QTN-2026-00001',
        productId: 'PROD-001',
        productNameSnapshot: 'Enterprise Server Rack Tier 4',
        skuSnapshot: 'SKU-SRV-001',
        categorySnapshot: 'Hardware Infrastructure',
        quantity: 50,
        unitBasePrice: 50000,
        requestedDiscountPercentage: 0,
        requestedDiscountAmount: 0,
        discountAmount: 0,
        netLineAmount: 2500000,
        taxAmount: 0,
        lineSubtotal: 2500000,
        lineTotal: 2500000,
        currency: 'INR',
        createdAt: '2026-09-05T12:00:00.000Z',
        updatedAt: '2026-09-05T12:00:00.000Z',
      },
    ],
  },
];

export const quotationService = {
  /**
   * Fetch paginated list of sales quotations.
   */
  async getQuotations(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.pageSize) queryParams.append('limit', params.pageSize);
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.priceListId) queryParams.append('priceListId', params.priceListId);

      const queryString = queryParams.toString();
      const endpoint = `/company/quotations${queryString ? `?${queryString}` : ''}`;
      return await apiClient.get(endpoint);
    } catch (err) {
      console.warn('[quotationService] Backend API offline. Operating on preview store.');
      return this.handleFallbackGetQuotations(params);
    }
  },

  /**
   * Fetch single quotation by ID or quotationNumber.
   */
  async getQuotationById(id) {
    if (!id) throw new Error('Quotation ID is required.');
    try {
      return await apiClient.get(`/company/quotations/${id}`);
    } catch (err) {
      console.warn('[quotationService] Backend API offline. Searching preview store.');
      const found = mockQuotations.find((q) => q.quotationId === id || q.quotationNumber === id);
      if (!found) {
        const error = new Error('Sales quotation not found or access denied.');
        error.status = 404;
        throw error;
      }
      return found;
    }
  },

  /**
   * Fetch eligible customer requests for quotation creation (Status MUST be REQUIREMENT_CONFIRMED).
   */
  async getQuotationEligibleRequests() {
    try {
      return await apiClient.get('/company/quotations/eligible-requests');
    } catch (err) {
      const requests = getSharedRequestsStore();
      return requests.filter((r) => r.status === 'REQUIREMENT_CONFIRMED');
    }
  },

  /**
   * Fetch active commercial price lists.
   */
  async getQuotationEligiblePriceLists() {
    try {
      const res = await priceListService.getPriceLists({ status: 'ACTIVE' });
      return Array.isArray(res) ? res : res.data || [];
    } catch (err) {
      return [
        {
          id: 'PL-001',
          priceListId: 'PL-001',
          code: 'PL-INR-STD',
          name: 'Standard INR Commercial Catalog',
          currency: 'INR',
          status: 'ACTIVE',
          effectiveFrom: '2026-01-01',
          effectiveTo: '2026-12-31',
        },
        {
          id: 'PL-002',
          priceListId: 'PL-002',
          code: 'PL-USD-ENT',
          name: 'Enterprise USD Commercial Catalog',
          currency: 'USD',
          status: 'ACTIVE',
          effectiveFrom: '2026-01-01',
          effectiveTo: '2026-12-31',
        },
      ];
    }
  },

  /**
   * Validates if a price list exists, is active, and currently effective.
   */
  async validatePriceList(priceListId) {
    const eligible = await this.getQuotationEligiblePriceLists();
    const found = eligible.find((pl) => pl.id === priceListId || pl.priceListId === priceListId);
    if (!found) {
      throw new Error('Selected Price List does not exist or is inactive.');
    }
    return found;
  },

  /**
   * Fetch products with base prices derived from selected Price List.
   */
  async getProductsForPriceList(priceListId = 'PL-001', params = {}) {
    try {
      const endpoint = `/company/price-lists/${priceListId}/products`;
      return await apiClient.get(endpoint);
    } catch (err) {
      const priceMap = MOCK_PRICE_LIST_ENTRIES[priceListId] || MOCK_PRICE_LIST_ENTRIES['PL-001'];
      const currency = priceListId === 'PL-002' ? 'USD' : 'INR';

      let productsList = [
        { id: 'PROD-001', productId: 'PROD-001', name: 'Enterprise Server Rack Tier 4', sku: 'SKU-SRV-001', category: 'Infrastructure', status: 'ACTIVE' },
        { id: 'PROD-002', productId: 'PROD-002', name: 'Workstation Pro Ultra X9', sku: 'SKU-WKS-002', category: 'Hardware', status: 'ACTIVE' },
        { id: 'PROD-003', productId: 'PROD-003', name: 'Managed Fiber Router Array', sku: 'SKU-[#714B67]-003', category: 'Networking', status: 'ACTIVE' },
        { id: 'PROD-004', productId: 'PROD-004', name: 'Rugged Handheld Barcode Scanner X-200', sku: 'SKU-SCN-004', category: 'Peripherals', status: 'ACTIVE' },
      ];

      if (params.search) {
        const query = params.search.toLowerCase();
        productsList = productsList.filter(
          (p) => p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query)
        );
      }

      return productsList.map((p) => {
        const price = priceMap[p.productId];
        return {
          ...p,
          unitBasePrice: price !== undefined ? price : null,
          hasPriceInList: price !== undefined,
          currency,
        };
      });
    }
  },

  /**
   * Retrieves authoritative product base price for a given Price List.
   */
  async getProductPrice(priceListId, productId) {
    try {
      return await apiClient.get(`/company/price-lists/${priceListId}/products/${productId}/price`);
    } catch (err) {
      const priceMap = MOCK_PRICE_LIST_ENTRIES[priceListId] || MOCK_PRICE_LIST_ENTRIES['PL-001'];
      const price = priceMap[productId];
      const currency = priceListId === 'PL-002' ? 'USD' : 'INR';

      if (price === undefined) {
        throw new Error('This product does not have a base price in the selected price list.');
      }

      return {
        productId,
        priceListId,
        unitBasePrice: price,
        currency,
      };
    }
  },

  /**
   * Validate single product price in a price list.
   */
  async validateProductPrice(priceListId, productId) {
    return await this.getProductPrice(priceListId, productId);
  },

  /**
   * Create a new draft sales quotation.
   * REVALIDATES base prices & runs DISCOUNT GOVERNANCE evaluation on backend/store.
   */
  async createQuotation(quotationData) {
    if (!quotationData.requestId) throw new Error('Customer Request ID is required.');
    if (!quotationData.priceListId) throw new Error('Price List selection is required.');
    if (!quotationData.items || quotationData.items.length === 0) {
      throw new Error('At least one product line item is required.');
    }

    try {
      return await apiClient.post('/company/quotations', quotationData);
    } catch (err) {
      console.warn('[quotationService] Backend API offline. Creating quotation draft in preview store.');

      // Validate price list existence
      await this.validatePriceList(quotationData.priceListId);

      const nextNum = `QTN-2026-${String(mockQuotations.length + 1).padStart(5, '0')}`;
      const requestsStore = getSharedRequestsStore();
      const requestRecord = requestsStore.find((r) => r.id === quotationData.requestId || r.requestId === quotationData.requestId);

      // Re-resolve authoritative prices & calculate line discounts
      const items = await Promise.all(
        quotationData.items.map(async (item, idx) => {
          const qty = Number(item.quantity);
          if (isNaN(qty) || qty <= 0) throw new Error('Invalid quantity provided.');

          const priceInfo = await this.getProductPrice(quotationData.priceListId, item.productId);
          const authoritativeUnitPrice = priceInfo.unitBasePrice;
          const sub = calculateLineSubtotal(qty, authoritativeUnitPrice);
          const discPct = Number(item.requestedDiscountPercentage || quotationData.discountPercentage || 0);
          const discAmt = calculateLineDiscountAmount(sub, discPct);
          const netSub = calculateNetLineAmount(sub, discAmt);

          return {
            quotationItemId: `qitem_${Date.now()}_${idx}`,
            quotationId: nextNum,
            productId: item.productId,
            productNameSnapshot: item.productNameSnapshot || item.productName || 'Commercial Product',
            skuSnapshot: item.skuSnapshot || item.sku || 'SKU-DEFAULT',
            categorySnapshot: item.categorySnapshot || item.category || 'Standard Catalogue',
            quantity: qty,
            unitBasePrice: authoritativeUnitPrice,
            requestedDiscountPercentage: discPct,
            requestedDiscountAmount: discAmt,
            approvedDiscountPercentage: 0,
            discountAmount: discAmt,
            netLineAmount: netSub,
            taxAmount: 0,
            lineSubtotal: sub,
            lineTotal: netSub,
            currency: priceInfo.currency || quotationData.currency || 'INR',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        })
      );

      const subtotal = calculateSubtotal(items);
      const discountTotal = calculateDiscountTotal(items);
      const effectiveDiscountPct = calculateEffectiveDiscountPercentage(subtotal, discountTotal);

      // Evaluate discount governance against server authority
      const governance = await discountGovernanceService.evaluateDiscount({
        requestedDiscountPercentage: effectiveDiscountPct || quotationData.discountPercentage || 0,
        subtotal,
        userId: quotationData.salespersonId || 'SP-014',
        userRole: 'Salesperson',
      });

      const grandTotal = calculateGrandTotal(subtotal, discountTotal, 0);

      const newQuotation = {
        quotationId: nextNum,
        quotationNumber: nextNum,
        requestId: quotationData.requestId,
        requestTitle: requestRecord?.title || quotationData.requestTitle || 'B2B Commercial Requirement',
        customerId: requestRecord?.customerId || quotationData.customerId || 'CUST-001',
        customerName: requestRecord?.customerName || quotationData.customerName || 'Acme Corporation',
        companyName: requestRecord?.companyName || quotationData.companyName || 'Acme Corporation',
        customerEmail: requestRecord?.customerEmail || quotationData.customerEmail || 'procurement@acme.com',
        customerPhone: requestRecord?.customerPhone || '+1 (555) 234-5678',
        salespersonId: quotationData.salespersonId || 'SP-014',
        salespersonName: quotationData.salespersonName || 'Sarah Jenkins',
        priceListId: quotationData.priceListId,
        priceListName: quotationData.priceListName || 'Standard INR Commercial Catalog',
        status: 'DRAFT',
        title: quotationData.title ? quotationData.title.trim() : 'Sales Quotation Proposal',
        description: quotationData.description ? quotationData.description.trim() : '',
        currency: quotationData.currency || 'INR',
        validFrom: quotationData.validFrom || new Date().toISOString().split('T')[0],
        validUntil: quotationData.validUntil || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        subtotal,
        discountTotal,
        discountPercentage: effectiveDiscountPct,
        discountStatus: governance.governanceDecision,
        discountAuthority: governance.applicableTier?.approvalRole || 'Salesperson',
        approvalRequired: governance.approvalRequired,
        approvalLevel: governance.approvalLevel,
        riskLevel: governance.riskLevel,
        taxTotal: 0,
        grandTotal,
        items,
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: quotationData.salespersonName || 'Sarah Jenkins',
      };

      mockQuotations.unshift(newQuotation);
      return newQuotation;
    }
  },

  /**
   * Update existing draft quotation with discount governance re-evaluation.
   */
  async updateQuotation(id, quotationData) {
    if (!id) throw new Error('Quotation ID is required.');
    try {
      return await apiClient.put(`/company/quotations/${id}`, quotationData);
    } catch (err) {
      console.warn('[quotationService] Backend API offline. Updating in preview store.');
      const index = mockQuotations.findIndex((q) => q.quotationId === id || q.quotationNumber === id);
      if (index === -1) {
        throw new Error('Quotation not found.');
      }

      const existing = mockQuotations[index];
      if (existing.status !== 'DRAFT') {
        throw new Error(`Quotation in status ${existing.status} cannot be edited.`);
      }

      let updatedItems = existing.items;

      if (quotationData.items) {
        const targetPriceListId = quotationData.priceListId || existing.priceListId;
        updatedItems = await Promise.all(
          quotationData.items.map(async (item, idx) => {
            const qty = Number(item.quantity);
            const priceInfo = await this.getProductPrice(targetPriceListId, item.productId);
            const authoritativePrice = priceInfo.unitBasePrice;
            const sub = calculateLineSubtotal(qty, authoritativePrice);
            const discPct = Number(item.requestedDiscountPercentage || quotationData.discountPercentage || 0);
            const discAmt = calculateLineDiscountAmount(sub, discPct);
            const netSub = calculateNetLineAmount(sub, discAmt);

            return {
              ...item,
              quotationItemId: item.quotationItemId || `qitem_${Date.now()}_${idx}`,
              unitBasePrice: authoritativePrice,
              requestedDiscountPercentage: discPct,
              discountAmount: discAmt,
              lineSubtotal: sub,
              netLineAmount: netSub,
              lineTotal: netSub,
              updatedAt: new Date().toISOString(),
            };
          })
        );
      }

      const subtotal = calculateSubtotal(updatedItems);
      const discountTotal = calculateDiscountTotal(updatedItems);
      const effectiveDiscountPct = calculateEffectiveDiscountPercentage(subtotal, discountTotal);

      // Governance evaluation
      const governance = await discountGovernanceService.evaluateDiscount({
        requestedDiscountPercentage: effectiveDiscountPct || quotationData.discountPercentage || 0,
        subtotal,
        userId: existing.salespersonId,
        userRole: 'Salesperson',
      });

      const grandTotal = calculateGrandTotal(subtotal, discountTotal, 0);

      const updatedRecord = {
        ...existing,
        ...quotationData,
        items: updatedItems,
        subtotal,
        discountTotal,
        discountPercentage: effectiveDiscountPct,
        discountStatus: governance.governanceDecision,
        discountAuthority: governance.applicableTier?.approvalRole || 'Salesperson',
        approvalRequired: governance.approvalRequired,
        approvalLevel: governance.approvalLevel,
        riskLevel: governance.riskLevel,
        grandTotal,
        updatedAt: new Date().toISOString(),
      };

      mockQuotations[index] = updatedRecord;
      return updatedRecord;
    }
  },

  /**
   * Send/Publish an APPROVED quotation to the Customer Portal.
   * Status MUST be APPROVED. Transitions status to SENT and creates published customer snapshot.
   */
  async sendToCustomer(quotationId) {
    if (!quotationId) throw new Error('Quotation ID is required.');
    try {
      return await apiClient.post(`/company/quotations/${quotationId}/send-to-customer`);
    } catch (err) {
      console.warn('[quotationService] Backend API offline. Publishing quotation in preview store.');
      const index = mockQuotations.findIndex((q) => q.quotationId === quotationId || q.quotationNumber === quotationId);
      if (index === -1) throw new Error('Quotation not found.');

      const existing = mockQuotations[index];

      // Validate that only APPROVED quotations can be sent to customer
      if (existing.status !== 'APPROVED' && existing.status !== 'SENT') {
        throw new Error(`Only APPROVED quotations can be sent to customer. Current status is ${existing.status}.`);
      }

      const updated = {
        ...existing,
        status: 'SENT',
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockQuotations[index] = updated;
      return updated;
    }
  },

  handleFallbackGetQuotations(params) {
    let filtered = [...mockQuotations];

    if (params.search) {
      const term = params.search.toLowerCase();
      filtered = filtered.filter(
        (q) =>
          q.quotationNumber.toLowerCase().includes(term) ||
          q.title.toLowerCase().includes(term) ||
          q.companyName.toLowerCase().includes(term) ||
          q.requestId.toLowerCase().includes(term)
      );
    }

    if (params.status && params.status !== 'ALL') {
      filtered = filtered.filter((q) => q.status === params.status);
    }

    if (params.priceListId && params.priceListId !== 'ALL') {
      filtered = filtered.filter((q) => q.priceListId === params.priceListId);
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

export default quotationService;
