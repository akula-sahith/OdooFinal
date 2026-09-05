/**
 * Authoritative Commercial Invoicing & Historical Snapshot Service
 * Phase 14 — DealFlow360
 */

import { INVOICE_STATUS } from '../types/invoiceTypes';
import {
  validateInvoiceCreation,
  validateInvoiceStatusTransition,
  validateVoidReason,
} from '../validation/invoiceValidation';

const STORAGE_KEY = 'dealflow360_invoices';
const AUDIT_KEY = 'dealflow360_invoice_audit';

// Initial realistic seed data for instant operational preview
const SEED_INVOICES = [
  {
    id: 'INV-2026-000001',
    invoiceNumber: 'INV-2026-000001',
    organizationId: 'ORG-360-ALPHA',
    customerId: 'CUST-001',
    customerName: 'Apex Global Logistics',
    orderId: 'ORD-2026-8912',
    quotationId: 'QT-2026-1004',
    fulfillmentId: 'FUL-2026-001',
    currency: 'USD',
    status: INVOICE_STATUS.ISSUED,
    issueDate: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 86400000 * 25).toISOString().split('T')[0],
    billingAddress: {
      recipientName: 'Accounts Payable Dept',
      companyName: 'Apex Global Logistics',
      addressLine1: '742 Commerce Blvd, Suite 400',
      addressLine2: 'Finance Tower',
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      postalCode: '60607',
    },
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
        id: 'INVITEM-101',
        productId: 'PROD-001',
        productNameSnapshot: 'Enterprise Server Blade X9',
        skuSnapshot: 'SKU-SRV-X9',
        descriptionSnapshot: 'High-performance 128-core blade compute node with redundant power',
        quantity: 50,
        unitPrice: 1200,
        discount: 6000, // 10% discount on total
        taxRate: 8,
        taxAmount: 4320,
        lineSubtotal: 60000,
        lineTotal: 58320,
      },
      {
        id: 'INVITEM-102',
        productId: 'PROD-002',
        productNameSnapshot: '100Gbps Fibre Channel Switch',
        skuSnapshot: 'SKU-[#SW-100G]',
        descriptionSnapshot: 'Ultra-low latency datacenter fibre switch',
        quantity: 20,
        unitPrice: 4500,
        discount: 9000, // 10% discount
        taxRate: 8,
        taxAmount: 6480,
        lineSubtotal: 90000,
        lineTotal: 87480,
      },
    ],
    subtotal: 150000,
    discountTotal: 15000,
    taxTotal: 10800,
    grandTotal: 145800,
    amountPaid: 0,
    amountDue: 145800,
    notes: 'Payment terms: Net 30. Wire transfer instructions on document footer.',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'INV-2026-000002',
    invoiceNumber: 'INV-2026-000002',
    organizationId: 'ORG-360-ALPHA',
    customerId: 'CUST-002',
    customerName: 'Titan Enterprise Tech',
    orderId: 'ORD-2026-4410',
    quotationId: 'QT-2026-1008',
    fulfillmentId: 'FUL-2026-002',
    currency: 'USD',
    status: INVOICE_STATUS.DRAFT,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
    billingAddress: {
      recipientName: 'Titan Finance & Billing',
      companyName: 'Titan Enterprise Tech',
      addressLine1: '1200 Innovation Way',
      addressLine2: 'Building B',
      city: 'Boston',
      state: 'MA',
      country: 'USA',
      postalCode: '02110',
    },
    shippingAddress: {
      recipientName: 'Titan Data Depot',
      companyName: 'Titan Enterprise Tech',
      addressLine1: '1200 Innovation Way',
      addressLine2: 'Building B',
      city: 'Boston',
      state: 'MA',
      country: 'USA',
      postalCode: '02110',
    },
    items: [
      {
        id: 'INVITEM-201',
        productId: 'PROD-003',
        productNameSnapshot: 'Rack Cabinet 42U Heavy Duty',
        skuSnapshot: 'SKU-RCK-42U',
        descriptionSnapshot: 'Heavy duty server rack cabinet with airflow door sensors',
        quantity: 10,
        unitPrice: 1500,
        discount: 750,
        taxRate: 5,
        taxAmount: 712.5,
        lineSubtotal: 15000,
        lineTotal: 14962.5,
      },
    ],
    subtotal: 15000,
    discountTotal: 750,
    taxTotal: 712.5,
    grandTotal: 14962.5,
    amountPaid: 0,
    amountDue: 14962.5,
    notes: 'Draft invoice under finance review.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const SEED_AUDIT = [
  {
    auditId: 'INVAUD-001',
    invoiceId: 'INV-2026-000001',
    action: 'INVOICE_ISSUED',
    actor: 'Finance Officer (Sarah Jenkins)',
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
    previousStatus: 'DRAFT',
    newStatus: 'ISSUED',
    reason: 'Issued invoice upon shipping confirmation.',
  },
];

// Helper Storage Getters
const getStoredInvoices = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_INVOICES));
    return SEED_INVOICES;
  } catch (e) {
    return SEED_INVOICES;
  }
};

const saveInvoices = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed saving invoices', e);
  }
};

const getStoredAuditLogs = () => {
  try {
    const data = localStorage.getItem(AUDIT_KEY);
    if (data) return JSON.parse(data);
    localStorage.setItem(AUDIT_KEY, JSON.stringify(SEED_AUDIT));
    return SEED_AUDIT;
  } catch (e) {
    return SEED_AUDIT;
  }
};

const logInvoiceAudit = (invoiceId, action, actor, previousStatus, newStatus, reason = '') => {
  const logs = getStoredAuditLogs();
  const entry = {
    auditId: `INVAUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    invoiceId,
    action,
    actor: actor || 'Finance User',
    timestamp: new Date().toISOString(),
    previousStatus,
    newStatus,
    reason,
  };
  const updated = [entry, ...logs];
  try {
    localStorage.setItem(AUDIT_KEY, JSON.stringify(updated));
  } catch (e) {
    // ignore
  }
  return entry;
};

// Financial Precision Calculator
export const calculateInvoiceFinancials = (items = [], globalTaxRate = 0) => {
  let subtotal = 0;
  let discountTotal = 0;
  let taxTotal = 0;

  const processedItems = items.map((item, idx) => {
    const qty = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    const discount = Number(item.discount) || 0;
    const taxRate = Number(item.taxRate !== undefined ? item.taxRate : globalTaxRate);

    const lineSubtotal = qty * unitPrice;
    const taxableAmount = Math.max(0, lineSubtotal - discount);
    const taxAmount = taxableAmount * (taxRate / 100);
    const lineTotal = taxableAmount + taxAmount;

    subtotal += lineSubtotal;
    discountTotal += discount;
    taxTotal += taxAmount;

    return {
      id: item.id || `INVITEM-${Date.now()}-${idx}`,
      productId: item.productId || `PROD-${idx + 1}`,
      productNameSnapshot: item.productNameSnapshot || item.name || 'Product',
      skuSnapshot: item.skuSnapshot || item.sku || 'SKU-GEN',
      descriptionSnapshot: item.descriptionSnapshot || item.description || '',
      quantity: qty,
      unitPrice,
      discount,
      taxRate,
      taxAmount,
      lineSubtotal,
      lineTotal,
    };
  });

  const grandTotal = subtotal - discountTotal + taxTotal;

  return {
    items: processedItems,
    subtotal: Math.round(subtotal * 100) / 100,
    discountTotal: Math.round(discountTotal * 100) / 100,
    taxTotal: Math.round(taxTotal * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100,
  };
};

export const invoiceService = {
  // 1. Query Invoices
  getInvoices: async (params = {}) => {
    let list = getStoredInvoices();
    if (params.status) {
      list = list.filter((i) => i.status === params.status);
    }
    if (params.customerId) {
      list = list.filter((i) => i.customerId === params.customerId);
    }
    if (params.currency) {
      list = list.filter((i) => i.currency === params.currency);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (i) =>
          i.invoiceNumber.toLowerCase().includes(q) ||
          i.orderId.toLowerCase().includes(q) ||
          i.customerName.toLowerCase().includes(q)
      );
    }
    return list;
  },

  getInvoiceById: async (id) => {
    const list = getStoredInvoices();
    return list.find((i) => i.id === id || i.invoiceNumber === id) || null;
  },

  getInvoicesByCustomer: async (customerId) => {
    const list = getStoredInvoices();
    return list.filter((i) => i.customerId === customerId);
  },

  // 2. Query Billable Orders
  getBillableOrders: async () => {
    // Reads confirmed/delivered orders from localStorage or seed
    let orders = [];
    try {
      const saved = localStorage.getItem('dealflow360_orders');
      if (saved) orders = JSON.parse(saved);
    } catch (e) {
      orders = [];
    }

    // Default sample orders if empty
    if (!orders || orders.length === 0) {
      orders = [
        {
          id: 'ORD-2026-8912',
          customerName: 'Apex Global Logistics',
          customerId: 'CUST-001',
          totalAmount: 150000,
          currency: 'USD',
          stage: 'Ready for Billing',
          createdDate: '2026-09-01',
          items: [
            {
              productId: 'PROD-001',
              productName: 'Enterprise Server Blade X9',
              sku: 'SKU-SRV-X9',
              description: 'Compute node',
              quantity: 50,
              unitPrice: 1200,
            },
            {
              productId: 'PROD-002',
              productName: '100Gbps Fibre Channel Switch',
              sku: 'SKU-[#SW-100G]',
              description: 'Switch',
              quantity: 20,
              unitPrice: 4500,
            },
          ],
        },
        {
          id: 'ORD-2026-9921',
          customerName: 'Quantum Robotics Labs',
          customerId: 'CUST-003',
          totalAmount: 85000,
          currency: 'USD',
          stage: 'Processing',
          createdDate: '2026-09-03',
          items: [
            {
              productId: 'PROD-005',
              productName: 'Autonomous Mobile Robot Unit',
              sku: 'SKU-AMR-01',
              description: 'Warehouse AMR',
              quantity: 5,
              unitPrice: 17000,
            },
          ],
        },
      ];
    }

    // Check which orders already have active invoices
    const existingInvoices = getStoredInvoices().filter((i) => i.status !== INVOICE_STATUS.CANCELLED);
    const invoicedOrderIds = new Set(existingInvoices.map((i) => i.orderId));

    return orders.map((o) => ({
      ...o,
      isInvoiced: invoicedOrderIds.has(o.id),
    }));
  },

  // 3. Create Invoice from Order (Historical Commercial Snapshot)
  createInvoiceFromOrder: async (orderData, customOptions = {}) => {
    if (!orderData || !orderData.id) {
      throw new Error('Valid originating Sales Order is required to generate an invoice.');
    }

    const list = getStoredInvoices();

    // Duplicate Invoice Check (409 Conflict Protection)
    const existing = list.find(
      (i) => i.orderId === orderData.id && i.status !== INVOICE_STATUS.CANCELLED && i.status !== INVOICE_STATUS.VOID
    );
    if (existing) {
      const err = new Error(`409 Conflict: An invoice (${existing.invoiceNumber}) already exists for Order #${orderData.id}.`);
      err.status = 409;
      err.existingInvoice = existing;
      throw err;
    }

    const seqNum = String(list.length + 1).padStart(6, '0');
    const invoiceNumber = `INV-2026-${seqNum}`;

    // Extract line items & snapshot details
    const rawItems = orderData.items || [
      {
        productId: 'PROD-001',
        productName: 'Industrial Controller Unit M3',
        sku: 'SKU-MCU-03',
        description: 'Standard M3 Industrial Controller',
        quantity: 10,
        unitPrice: 1500,
      },
    ];

    const financial = calculateInvoiceFinancials(rawItems, customOptions.taxRate || 8);

    const issueDate = customOptions.issueDate || new Date().toISOString().split('T')[0];
    const dueDays = customOptions.paymentTermsDays || 30;
    const dueObj = new Date(new Date(issueDate).getTime() + 86400000 * dueDays);
    const dueDate = customOptions.dueDate || dueObj.toISOString().split('T')[0];

    const newInvoice = {
      id: invoiceNumber,
      invoiceNumber,
      organizationId: orderData.organizationId || 'ORG-360-ALPHA',
      customerId: orderData.customerId || 'CUST-GENERIC',
      customerName: orderData.customerName || orderData.clientName || 'Enterprise Account',
      orderId: orderData.id,
      quotationId: orderData.quotationId || null,
      fulfillmentId: orderData.fulfillmentId || null,
      currency: orderData.currency || 'USD',
      status: INVOICE_STATUS.DRAFT,
      issueDate,
      dueDate,
      billingAddress: orderData.billingAddress || orderData.shippingAddress || {
        recipientName: orderData.customerName || 'Accounts Payable',
        companyName: orderData.customerName || 'Enterprise Account',
        addressLine1: '100 Commercial Blvd',
        addressLine2: '',
        city: 'Chicago',
        state: 'IL',
        country: 'USA',
        postalCode: '60601',
      },
      shippingAddress: orderData.shippingAddress || {
        recipientName: orderData.customerName || 'Receiving Dock',
        companyName: orderData.customerName || 'Enterprise Account',
        addressLine1: '100 Commercial Blvd',
        addressLine2: '',
        city: 'Chicago',
        state: 'IL',
        country: 'USA',
        postalCode: '60601',
      },
      items: financial.items,
      subtotal: financial.subtotal,
      discountTotal: financial.discountTotal,
      taxTotal: financial.taxTotal,
      grandTotal: financial.grandTotal,
      amountPaid: 0,
      amountDue: financial.grandTotal,
      notes: customOptions.notes || `Invoice generated for Sales Order #${orderData.id}. Payment terms: Net ${dueDays}.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const valCheck = validateInvoiceCreation(newInvoice);
    if (!valCheck.isValid) {
      throw new Error(valCheck.errors.join(' '));
    }

    const updatedList = [newInvoice, ...list];
    saveInvoices(updatedList);

    logInvoiceAudit(newInvoice.id, 'INVOICE_CREATED', customOptions.actor || 'Finance User', '', INVOICE_STATUS.DRAFT, `Draft invoice generated from Order #${orderData.id}.`);

    return newInvoice;
  },

  // 4. Update Draft Invoice
  updateDraftInvoice: async (id, updateData, user = 'Finance User') => {
    const list = getStoredInvoices();
    const index = list.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Invoice record not found.');

    const current = list[index];
    if (current.status !== INVOICE_STATUS.DRAFT) {
      throw new Error('Only DRAFT invoices can be edited.');
    }

    const updatedItems = updateData.items || current.items;
    const financial = calculateInvoiceFinancials(updatedItems);

    const updatedInvoice = {
      ...current,
      ...updateData,
      items: financial.items,
      subtotal: financial.subtotal,
      discountTotal: financial.discountTotal,
      taxTotal: financial.taxTotal,
      grandTotal: financial.grandTotal,
      amountDue: financial.grandTotal - (current.amountPaid || 0),
      updatedAt: new Date().toISOString(),
    };

    const valCheck = validateInvoiceCreation(updatedInvoice);
    if (!valCheck.isValid) throw new Error(valCheck.errors.join(' '));

    list[index] = updatedInvoice;
    saveInvoices(list);

    logInvoiceAudit(id, 'INVOICE_UPDATED', user, INVOICE_STATUS.DRAFT, INVOICE_STATUS.DRAFT, 'Draft invoice values updated.');
    return updatedInvoice;
  },

  // 5. Issue Invoice
  issueInvoice: async (id, user = 'Finance Officer') => {
    const list = getStoredInvoices();
    const index = list.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Invoice record not found.');

    const inv = list[index];
    const transCheck = validateInvoiceStatusTransition(inv.status, INVOICE_STATUS.ISSUED);
    if (!transCheck.isValid) throw new Error(transCheck.error);

    const prevStatus = inv.status;
    inv.status = INVOICE_STATUS.ISSUED;
    inv.updatedAt = new Date().toISOString();

    list[index] = inv;
    saveInvoices(list);

    logInvoiceAudit(id, 'INVOICE_ISSUED', user, prevStatus, INVOICE_STATUS.ISSUED, 'Invoice officially issued and locked for payment.');
    return inv;
  },

  // 6. Void Invoice
  voidInvoice: async (id, reason, user = 'Finance Manager') => {
    const reasonCheck = validateVoidReason(reason);
    if (!reasonCheck.isValid) throw new Error(reasonCheck.error);

    const list = getStoredInvoices();
    const index = list.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Invoice record not found.');

    const inv = list[index];
    const transCheck = validateInvoiceStatusTransition(inv.status, INVOICE_STATUS.VOID);
    if (!transCheck.isValid) throw new Error(transCheck.error);

    const prevStatus = inv.status;
    inv.status = INVOICE_STATUS.VOID;
    inv.updatedAt = new Date().toISOString();

    list[index] = inv;
    saveInvoices(list);

    logInvoiceAudit(id, 'INVOICE_VOIDED', user, prevStatus, INVOICE_STATUS.VOID, reason);
    return inv;
  },

  // 7. Cancel Invoice
  cancelInvoice: async (id, reason, user = 'Finance Admin') => {
    const reasonCheck = validateVoidReason(reason);
    if (!reasonCheck.isValid) throw new Error(reasonCheck.error);

    const list = getStoredInvoices();
    const index = list.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Invoice record not found.');

    const inv = list[index];
    const transCheck = validateInvoiceStatusTransition(inv.status, INVOICE_STATUS.CANCELLED);
    if (!transCheck.isValid) throw new Error(transCheck.error);

    const prevStatus = inv.status;
    inv.status = INVOICE_STATUS.CANCELLED;
    inv.updatedAt = new Date().toISOString();

    list[index] = inv;
    saveInvoices(list);

    logInvoiceAudit(id, 'INVOICE_CANCELLED', user, prevStatus, INVOICE_STATUS.CANCELLED, reason);
    return inv;
  },

  // 8. Audit Logs
  getInvoiceAuditLogs: async (invoiceId = null) => {
    const logs = getStoredAuditLogs();
    if (invoiceId) {
      return logs.filter((l) => l.invoiceId === invoiceId);
    }
    return logs;
  },
};
