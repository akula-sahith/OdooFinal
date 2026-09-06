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
import { apiClient } from '../../../services/api/apiClient';

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
  // 1. Query Invoices from Backend
  getInvoices: async (params = {}) => {
    const res = await apiClient.get('/billing/invoices');
    let list = Array.isArray(res) ? res : (res?.data || []);
    list = list.map(i => ({
      ...i,
      invoiceNumber: i.invoiceNumber || `INV-2026-${String(i.id).padStart(6, '0')}`,
      currency: i.currency || 'USD',
      grandTotal: Number(i.totalAmount || i.grandTotal || 0),
      subtotal: Number(i.subtotalAmount || i.subtotal || 0),
      taxTotal: Number(i.taxAmount || i.taxTotal || 0),
      amountDue: Number(i.totalAmount || 0),
      issueDate: i.createdAt ? new Date(i.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      dueDate: i.dueDate ? new Date(i.dueDate).toISOString().split('T')[0] : new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
    }));

    if (params.status) {
      list = list.filter((i) => i.status === params.status);
    }
    if (params.customerId) {
      list = list.filter((i) => String(i.customerId) === String(params.customerId));
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (i) =>
          (i.invoiceNumber && i.invoiceNumber.toLowerCase().includes(q)) ||
          (i.orderId && String(i.orderId).toLowerCase().includes(q)) ||
          (i.customerName && i.customerName.toLowerCase().includes(q))
      );
    }
    return list;
  },

  getInvoiceById: async (id) => {
    const numericId = String(id).replace(/[^0-9]/g, '');
    const res = await apiClient.get(`/billing/invoices/${numericId || id}`);
    const inv = res?.invoice || res;
    if (!inv) return null;
    return {
      ...inv,
      invoiceNumber: inv.invoiceNumber || `INV-2026-${String(inv.id).padStart(6, '0')}`,
      grandTotal: Number(inv.totalAmount || inv.grandTotal || 0),
      subtotal: Number(inv.subtotalAmount || inv.subtotal || 0),
      taxTotal: Number(inv.taxAmount || inv.taxTotal || 0),
      amountDue: Number(inv.totalAmount || 0),
      payments: res.payments || [],
      creditNotes: res.creditNotes || [],
    };
  },

  getInvoicesByCustomer: async (customerId) => {
    const invoices = await invoiceService.getInvoices();
    return invoices.filter((i) => String(i.customerId) === String(customerId));
  },

  // 2. Query Billable Orders
  getBillableOrders: async () => {
    const ordersRes = await apiClient.get('/orders');
    const orders = Array.isArray(ordersRes) ? ordersRes : (ordersRes?.data || []);
    const existingInvoices = await invoiceService.getInvoices();
    const invoicedOrderIds = new Set(existingInvoices.map((i) => String(i.orderId)));

    return orders.map((o) => ({
      ...o,
      isInvoiced: invoicedOrderIds.has(String(o.id)),
    }));
  },

  // 3. Create Invoice from Order (calls backend /billing/invoices/generate/{orderId})
  createInvoiceFromOrder: async (orderData, customOptions = {}) => {
    const orderId = orderData.rawId || orderData.id;
    const res = await apiClient.post(`/billing/invoices/generate/${orderId}`);
    return {
      ...res,
      invoiceNumber: `INV-2026-${String(res.id).padStart(6, '0')}`,
      grandTotal: Number(res.totalAmount || 0),
      subtotal: Number(res.subtotalAmount || 0),
      taxTotal: Number(res.taxAmount || 0),
      amountDue: Number(res.totalAmount || 0),
    };
  },

  // 4. Audit Logs
  getInvoiceAuditLogs: async (invoiceId = null) => {
    const logs = await apiClient.get('/audit-logs');
    const list = Array.isArray(logs) ? logs : [];
    if (invoiceId) {
      return list.filter((l) => String(l.entityId) === String(invoiceId) && l.entityType === 'INVOICE');
    }
    return list;
  },
};
