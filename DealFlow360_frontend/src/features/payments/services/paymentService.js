/**
 * Authoritative Payment Management & Invoice Financial Balance Service
 * Phase 15 — DealFlow360
 */

import { PAYMENT_STATUS, PAYMENT_METHOD } from '../types/paymentTypes';
import { validatePaymentInput, validatePaymentCancellation } from '../validation/paymentValidation';
import { invoiceService } from '../../invoices/services/invoiceService';
import { INVOICE_STATUS } from '../../invoices/types/invoiceTypes';
import { apiClient } from '../../../services/api/apiClient';

export const paymentService = {
  // 1. Query Payments from Backend
  getPayments: async (params = {}) => {
    const res = await apiClient.get('/billing/payments');
    let list = Array.isArray(res) ? res : (res?.data || []);
    list = list.map(p => ({
      ...p,
      paymentNumber: p.paymentNumber || `PAY-2026-${String(p.id).padStart(6, '0')}`,
      amount: Number(p.amount || 0),
      currency: p.currency || 'USD',
      status: p.status || 'COMPLETED',
      paymentDate: p.processedAt ? new Date(p.processedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      referenceNumber: p.transactionReference || p.referenceNumber || 'N/A',
    }));

    if (params.status) {
      list = list.filter((p) => p.status === params.status);
    }
    if (params.invoiceId) {
      list = list.filter((p) => String(p.invoiceId) === String(params.invoiceId));
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (p) =>
          (p.paymentNumber && p.paymentNumber.toLowerCase().includes(q)) ||
          (p.invoiceId && String(p.invoiceId).toLowerCase().includes(q)) ||
          (p.referenceNumber && p.referenceNumber.toLowerCase().includes(q))
      );
    }
    return list;
  },

  getPaymentById: async (id) => {
    const list = await paymentService.getPayments();
    return list.find((p) => String(p.id) === String(id) || p.paymentNumber === id) || null;
  },

  getPaymentsByInvoice: async (invoiceId) => {
    const list = await paymentService.getPayments();
    return list.filter((p) => String(p.invoiceId) === String(invoiceId));
  },

  // 2. Query Payable Invoices
  getEligibleInvoices: async () => {
    const list = await invoiceService.getInvoices();
    return list.filter(
      (i) => i.status !== 'PAID' && i.status !== 'CANCELLED' && i.status !== 'VOID'
    );
  },

  // 3. Record Payment against Invoice
  createPayment: async (paymentData, user = 'Finance User') => {
    if (!paymentData.invoiceId) {
      throw new Error('Target invoice reference is required to record a payment.');
    }
    const numericInvoiceId = String(paymentData.invoiceId).replace(/[^0-9]/g, '');

    const payload = {
      invoiceId: Number(numericInvoiceId || paymentData.invoiceId),
      paymentMethod: paymentData.paymentMethod || PAYMENT_METHOD.BANK_TRANSFER,
      amount: Number(paymentData.amount),
      reference: paymentData.referenceNumber || `REF-${Date.now()}`,
    };

    const res = await apiClient.post('/billing/payments', payload);
    return {
      ...res,
      paymentNumber: `PAY-2026-${String(res.id).padStart(6, '0')}`,
      amount: Number(res.amount || paymentData.amount),
      currency: 'USD',
      status: res.status || 'COMPLETED',
      paymentDate: new Date().toISOString().split('T')[0],
    };
  },

  // 4. Issue Credit Note
  issueCreditNote: async (invoiceId, amount, reason) => {
    const numericInvoiceId = String(invoiceId).replace(/[^0-9]/g, '');
    return await apiClient.post('/billing/credit-notes', {
      invoiceId: Number(numericInvoiceId || invoiceId),
      amount: Number(amount),
      reason,
    });
  },

  // 5. Payment Audit Logs
  getPaymentAuditLogs: async (paymentId = null) => {
    const logs = await apiClient.get('/audit-logs');
    const list = Array.isArray(logs) ? logs : [];
    if (paymentId) {
      return list.filter((l) => String(l.entityId) === String(paymentId) && l.entityType === 'PAYMENT');
    }
    return list;
  },
};
