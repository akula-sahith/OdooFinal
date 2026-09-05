/**
 * Customer Portal Service Layer
 * Phase 16 — DealFlow360
 *
 * Provides customer visibility & self-service data methods:
 * - getDashboard()
 * - getOrders(params)
 * - getOrderById(id)
 * - getShipments(params)
 * - getShipmentById(id)
 * - getInvoices(params)
 * - getInvoiceById(id)
 * - getPayments(params)
 * - getPaymentById(id)
 * - getBalanceSummary()
 * - getCommercialTimeline(orderId)
 * - getNotifications(params)
 * - markNotificationRead(id)
 * - getInvoiceDocument(id)
 *
 * Consumes apiClient with deterministic fallback to Phase 10-15 stores.
 */

import { apiClient } from '../../../services/api/apiClient';
import { invoiceService } from '../../invoices/services/invoiceService';
import { paymentService } from '../../payments/services/paymentService';
import { fulfillmentService } from '../../fulfillment/services/fulfillmentService';

// Default Seed Customer Orders for deterministic offline preview
const SEED_CUSTOMER_ORDERS = [
  {
    id: 'ORD-2026-8912',
    orderNumber: 'ORD-2026-8912',
    quotationId: 'QT-2026-1004',
    quotationNumber: 'QT-2026-1004',
    customerId: 'CUST-001',
    customerName: 'Apex Global Logistics',
    orderDate: '2026-08-15',
    status: 'FULFILLMENT_IN_PROGRESS',
    fulfillmentStatus: 'READY',
    shipmentStatus: 'IN_TRANSIT',
    currency: 'USD',
    subtotal: 150000,
    discountTotal: 15000,
    taxTotal: 10800,
    grandTotal: 145800,
    expectedDelivery: '2026-09-10',
    shippingAddress: {
      recipientName: 'Apex Receivings Dock 12',
      companyName: 'Apex Global Logistics',
      addressLine1: '742 Commerce Blvd, Suite 400',
      addressLine2: 'Dock 12',
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      postalCode: '60607',
    },
    items: [
      {
        id: 'OITEM-101',
        productId: 'PROD-001',
        productName: 'Enterprise Server Blade X9',
        sku: 'SKU-SRV-X9',
        quantity: 50,
        unitPrice: 1200,
        discount: 6000,
        tax: 4320,
        lineTotal: 58320,
      },
      {
        id: 'OITEM-102',
        productId: 'PROD-002',
        productName: '100Gbps Fibre Channel Switch',
        sku: 'SKU-[#SW-100G]',
        quantity: 20,
        unitPrice: 4500,
        discount: 9000,
        tax: 6480,
        lineTotal: 87480,
      },
    ],
    invoices: ['INV-2026-000001'],
    payments: ['PAY-2026-000001'],
  },
  {
    id: 'ORD-2026-4410',
    orderNumber: 'ORD-2026-4410',
    quotationId: 'QT-2026-1008',
    quotationNumber: 'QT-2026-1008',
    customerId: 'CUST-001',
    customerName: 'Apex Global Logistics',
    orderDate: '2026-08-28',
    status: 'CONFIRMED',
    fulfillmentStatus: 'PICKING',
    shipmentStatus: 'PROCESSING',
    currency: 'USD',
    subtotal: 80000,
    discountTotal: 4000,
    taxTotal: 6080,
    grandTotal: 82080,
    expectedDelivery: '2026-09-18',
    shippingAddress: {
      recipientName: 'Apex Receivings Dock 12',
      companyName: 'Apex Global Logistics',
      addressLine1: '742 Commerce Blvd, Suite 400',
      addressLine2: 'Dock 12',
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      postalCode: '60607',
    },
    items: [
      {
        id: 'OITEM-201',
        productId: 'PROD-003',
        productName: 'High Density SAN Storage Rack',
        sku: 'SKU-SAN-RACK',
        quantity: 4,
        unitPrice: 20000,
        discount: 4000,
        tax: 6080,
        lineTotal: 82080,
      },
    ],
    invoices: ['INV-2026-000002'],
    payments: [],
  },
];

const getStoredOrders = () => {
  try {
    const raw = localStorage.getItem('dealflow360_orders');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    // fallback
  }
  return SEED_CUSTOMER_ORDERS;
};

export const customerPortalService = {
  /**
   * Fetch customer dashboard summary metrics
   */
  async getDashboard() {
    try {
      const res = await apiClient.get('/customer/dashboard');
      if (res && res.data) return res.data;
    } catch (e) {
      console.warn('[customerPortalService] Backend offline. Generating fallback dashboard metrics.');
    }

    // Offline fallback calculations from Phase 10-15 local stores
    const orders = getStoredOrders();
    const invoices = await invoiceService.getInvoices();
    const payments = await paymentService.getPayments();
    const shipments = await fulfillmentService.getShipments();

    const totalInvoiced = invoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + (inv.amountPaid || 0), 0);
    const amountDue = invoices.reduce((sum, inv) => sum + (inv.amountDue || 0), 0);

    const activeQuotationsCount = 3;
    const acceptedQuotationsCount = 2;
    const activeOrdersCount = orders.filter((o) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length;
    const pendingDeliveriesCount = shipments.filter((s) => s.status !== 'DELIVERED' && s.status !== 'CANCELLED').length;
    const outstandingInvoicesCount = invoices.filter((i) => i.amountDue > 0).length;

    const recentActivities = [
      {
        id: 'ACT-005',
        type: 'PAYMENT_RECEIVED',
        title: 'Payment Received',
        description: 'Payment PAY-2026-000001 of $50,000.00 processed for Invoice INV-2026-000001',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        link: '/customer/payments/PAY-2026-000001',
      },
      {
        id: 'ACT-004',
        type: 'INVOICE_ISSUED',
        title: 'Invoice Issued',
        description: 'Commercial Invoice INV-2026-000001 generated for Order ORD-2026-8912',
        timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
        link: '/customer/invoices/INV-2026-000001',
      },
      {
        id: 'ACT-003',
        type: 'SHIPMENT_DISPATCHED',
        title: 'Shipment Dispatched',
        description: 'Consignment SHP-2026-001 in transit via FedEx Freight Express',
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
        link: '/customer/shipments/SHP-2026-001',
      },
      {
        id: 'ACT-002',
        type: 'ORDER_CONFIRMED',
        title: 'Order Confirmed',
        description: 'Sales Order ORD-2026-8912 confirmed and dispatched to warehouse',
        timestamp: new Date(Date.now() - 86400000 * 6).toISOString(),
        link: '/customer/orders/ORD-2026-8912',
      },
      {
        id: 'ACT-001',
        type: 'QUOTATION_ACCEPTED',
        title: 'Quotation Accepted',
        description: 'Commercial Quotation QT-2026-1004 accepted by client signoff',
        timestamp: new Date(Date.now() - 86400000 * 7).toISOString(),
        link: '/customer/quotations/QT-2026-1004',
      },
    ];

    return {
      activeQuotations: activeQuotationsCount,
      acceptedQuotations: acceptedQuotationsCount,
      activeOrders: activeOrdersCount,
      pendingDeliveries: pendingDeliveriesCount,
      outstandingInvoicesCount,
      totalInvoiced,
      totalPaid,
      amountDue,
      recentPaymentsCount: payments.length,
      recentActivities,
    };
  },

  /**
   * Fetch customer orders list with optional search & filters
   */
  async getOrders(params = {}) {
    const { search = '', status = '', dateFrom = '', dateTo = '' } = params;
    try {
      const res = await apiClient.get('/customer/orders', { params });
      if (res && res.data) return res.data;
    } catch (e) {
      console.warn('[customerPortalService] Backend offline. Using stored order list.');
    }

    let list = getStoredOrders();

    if (search) {
      const query = search.toLowerCase();
      list = list.filter(
        (o) =>
          (o.orderNumber || o.id || '').toLowerCase().includes(query) ||
          (o.quotationNumber || o.quotationId || '').toLowerCase().includes(query)
      );
    }

    if (status && status !== 'ALL') {
      list = list.filter((o) => o.status === status);
    }

    return list;
  },

  /**
   * Fetch single order by ID
   */
  async getOrderById(id) {
    try {
      const res = await apiClient.get(`/customer/orders/${id}`);
      if (res && res.data) return res.data;
    } catch (e) {
      console.warn(`[customerPortalService] Backend offline. Resolving order ${id} from store.`);
    }

    const orders = getStoredOrders();
    const found = orders.find((o) => o.id === id || o.orderNumber === id);
    if (!found) {
      const err = new Error('Order not found or access denied.');
      err.status = 404;
      throw err;
    }
    return found;
  },

  /**
   * Fetch customer shipments list
   */
  async getShipments(params = {}) {
    const { search = '', status = '' } = params;
    try {
      const res = await apiClient.get('/customer/shipments', { params });
      if (res && res.data) return res.data;
    } catch (e) {
      console.warn('[customerPortalService] Backend offline. Using fulfillment service shipments.');
    }

    let shipments = await fulfillmentService.getShipments();

    if (search) {
      const query = search.toLowerCase();
      shipments = shipments.filter(
        (s) =>
          (s.shipmentNumber || s.shipmentId || '').toLowerCase().includes(query) ||
          (s.orderId || '').toLowerCase().includes(query) ||
          (s.trackingNumber || '').toLowerCase().includes(query)
      );
    }

    if (status && status !== 'ALL') {
      shipments = shipments.filter((s) => s.status === status);
    }

    return shipments;
  },

  /**
   * Fetch single shipment detail by ID
   */
  async getShipmentById(id) {
    try {
      const res = await apiClient.get(`/customer/shipments/${id}`);
      if (res && res.data) return res.data;
    } catch (e) {
      console.warn(`[customerPortalService] Backend offline. Resolving shipment ${id}.`);
    }

    const shipments = await fulfillmentService.getShipments();
    const found = shipments.find((s) => s.shipmentId === id || s.shipmentNumber === id);
    if (!found) {
      const err = new Error('Shipment record not found or unauthorized.');
      err.status = 404;
      throw err;
    }
    return found;
  },

  /**
   * Fetch customer invoices list
   */
  async getInvoices(params = {}) {
    const { search = '', status = '' } = params;
    try {
      const res = await apiClient.get('/customer/invoices', { params });
      if (res && res.data) return res.data;
    } catch (e) {
      console.warn('[customerPortalService] Backend offline. Using invoiceService store.');
    }

    let invoices = await invoiceService.getInvoices();

    if (search) {
      const query = search.toLowerCase();
      invoices = invoices.filter(
        (i) =>
          (i.invoiceNumber || i.id || '').toLowerCase().includes(query) ||
          (i.orderId || '').toLowerCase().includes(query)
      );
    }

    if (status && status !== 'ALL') {
      invoices = invoices.filter((i) => i.status === status);
    }

    return invoices;
  },

  /**
   * Fetch single invoice by ID
   */
  async getInvoiceById(id) {
    try {
      const res = await apiClient.get(`/customer/invoices/${id}`);
      if (res && res.data) return res.data;
    } catch (e) {
      console.warn(`[customerPortalService] Backend offline. Resolving invoice ${id}.`);
    }

    return await invoiceService.getInvoiceById(id);
  },

  /**
   * Fetch customer payments list
   */
  async getPayments(params = {}) {
    const { search = '', status = '' } = params;
    try {
      const res = await apiClient.get('/customer/payments', { params });
      if (res && res.data) return res.data;
    } catch (e) {
      console.warn('[customerPortalService] Backend offline. Using paymentService store.');
    }

    let payments = await paymentService.getPayments();

    if (search) {
      const query = search.toLowerCase();
      payments = payments.filter(
        (p) =>
          (p.paymentNumber || p.id || '').toLowerCase().includes(query) ||
          (p.invoiceId || '').toLowerCase().includes(query) ||
          (p.referenceNumber || '').toLowerCase().includes(query)
      );
    }

    if (status && status !== 'ALL') {
      payments = payments.filter((p) => p.status === status);
    }

    return payments;
  },

  /**
   * Fetch single payment detail by ID
   */
  async getPaymentById(id) {
    try {
      const res = await apiClient.get(`/customer/payments/${id}`);
      if (res && res.data) return res.data;
    } catch (e) {
      console.warn(`[customerPortalService] Backend offline. Resolving payment ${id}.`);
    }

    return await paymentService.getPaymentById(id);
  },

  /**
   * Fetch customer financial balance summary
   */
  async getBalanceSummary() {
    try {
      const res = await apiClient.get('/customer/balance-summary');
      if (res && res.data) return res.data;
    } catch (e) {
      console.warn('[customerPortalService] Backend offline. Computing balance summary from invoices.');
    }

    const invoices = await invoiceService.getInvoices();
    const totalInvoiced = invoices.reduce((sum, i) => sum + (i.grandTotal || 0), 0);
    const totalPaid = invoices.reduce((sum, i) => sum + (i.amountPaid || 0), 0);
    const totalOutstanding = invoices.reduce((sum, i) => sum + (i.amountDue || 0), 0);

    const todayStr = new Date().toISOString().split('T')[0];
    const overdueAmount = invoices
      .filter((i) => i.amountDue > 0 && i.dueDate && i.dueDate < todayStr)
      .reduce((sum, i) => sum + (i.amountDue || 0), 0);

    return {
      totalInvoiced,
      totalPaid,
      totalOutstanding,
      overdueAmount,
      currency: 'USD',
    };
  },

  /**
   * Fetch commercial timeline for a customer order or general lifecycle
   */
  async getCommercialTimeline(orderId) {
    try {
      const res = await apiClient.get(`/customer/orders/${orderId}/timeline`);
      if (res && res.data) return res.data;
    } catch (e) {
      console.warn('[customerPortalService] Backend offline. Synthesizing commercial timeline.');
    }

    return [
      { id: '1', step: 'QUOTATION', title: 'Quotation Created', ref: 'QT-2026-1004', status: 'COMPLETED', link: '/customer/quotations/QT-2026-1004' },
      { id: '2', step: 'ACCEPTANCE', title: 'Quotation Accepted', ref: 'QT-2026-1004', status: 'COMPLETED', link: '/customer/quotations/QT-2026-1004' },
      { id: '3', step: 'ORDER', title: 'Order Confirmed', ref: 'ORD-2026-8912', status: 'COMPLETED', link: '/customer/orders/ORD-2026-8912' },
      { id: '4', step: 'FULFILLMENT', title: 'Picking & Packing', ref: 'FUL-2026-001', status: 'COMPLETED', link: '/customer/orders/ORD-2026-8912' },
      { id: '5', step: 'SHIPMENT', title: 'Shipment Dispatched', ref: 'SHP-2026-001', status: 'IN_PROGRESS', link: '/customer/shipments/SHP-2026-001' },
      { id: '6', step: 'DELIVERY', title: 'Out For Delivery', ref: 'SHP-2026-001', status: 'PENDING', link: '/customer/shipments/SHP-2026-001' },
      { id: '7', step: 'INVOICE', title: 'Invoice Issued', ref: 'INV-2026-000001', status: 'COMPLETED', link: '/customer/invoices/INV-2026-000001' },
      { id: '8', step: 'PAYMENT', title: 'Partially Paid ($50,000)', ref: 'PAY-2026-000001', status: 'IN_PROGRESS', link: '/customer/payments/PAY-2026-000001' },
    ];
  },

  /**
   * Fetch customer notifications
   */
  async getNotifications(params = {}) {
    try {
      const res = await apiClient.get('/customer/notifications', { params });
      if (res && res.data) return res.data;
    } catch (e) {
      console.warn('[customerPortalService] Backend offline. Returning notifications placeholder.');
    }

    return [
      { id: 'N1', title: 'Payment Confirmed', message: 'Payment PAY-2026-000001 of $50,000 received.', isRead: false, createdAt: new Date().toISOString() },
      { id: 'N2', title: 'Shipment Update', message: 'Consignment SHP-2026-001 handed to carrier FedEx.', isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
    ];
  },

  /**
   * Mark customer notification as read
   */
  async markNotificationRead(id) {
    try {
      await apiClient.patch(`/customer/notifications/${id}/read`);
    } catch (e) {
      // offline silent ok
    }
    return true;
  },

  /**
   * Authorized Customer Invoice Document Download/Print
   */
  async getInvoiceDocument(invoiceId) {
    try {
      const res = await apiClient.get(`/customer/invoices/${invoiceId}/document`, {
        responseType: 'blob',
      });
      return res.data;
    } catch (e) {
      console.warn(`[customerPortalService] Backend document endpoint offline. Generating client print payload for ${invoiceId}.`);
      return null;
    }
  },
};

export default customerPortalService;
