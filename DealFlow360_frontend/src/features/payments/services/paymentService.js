/**
 * Authoritative Payment Management & Invoice Financial Balance Service
 * Phase 15 — DealFlow360
 */

import { PAYMENT_STATUS, PAYMENT_METHOD } from '../types/paymentTypes';
import { validatePaymentInput, validatePaymentCancellation } from '../validation/paymentValidation';
import { invoiceService } from '../../invoices/services/invoiceService';
import { INVOICE_STATUS } from '../../invoices/types/invoiceTypes';

const STORAGE_KEY = 'dealflow360_payments';
const AUDIT_KEY = 'dealflow360_payment_audit';

// Initial realistic seed payment records
const SEED_PAYMENTS = [
  {
    id: 'PAY-2026-000001',
    paymentNumber: 'PAY-2026-000001',
    organizationId: 'ORG-360-ALPHA',
    invoiceId: 'INV-2026-000001',
    customerId: 'CUST-001',
    customerName: 'Apex Global Logistics',
    orderId: 'ORD-2026-8912',
    amount: 50000,
    currency: 'USD',
    paymentDate: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    paymentMethod: PAYMENT_METHOD.BANK_TRANSFER,
    status: PAYMENT_STATUS.COMPLETED,
    referenceNumber: 'WIRE-JPMC-99812-X',
    notes: 'Initial partial payment wire received at JPMC.',
    createdBy: 'Finance Manager (Sarah Jenkins)',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const SEED_AUDIT = [
  {
    auditId: 'PAYAUD-001',
    paymentId: 'PAY-2026-000001',
    invoiceId: 'INV-2026-000001',
    action: 'PAYMENT_COMPLETED',
    actor: 'Finance Manager (Sarah Jenkins)',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    previousStatus: 'PENDING',
    newStatus: 'COMPLETED',
    amount: 50000,
    reason: 'Wire transfer confirmed by bank statement.',
  },
];

// LocalStorage Helper Getters
const getStoredPayments = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_PAYMENTS));
    return SEED_PAYMENTS;
  } catch (e) {
    return SEED_PAYMENTS;
  }
};

const savePayments = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed saving payments', e);
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

const logPaymentAudit = (paymentId, invoiceId, action, actor, previousStatus, newStatus, amount, reason = '') => {
  const logs = getStoredAuditLogs();
  const entry = {
    auditId: `PAYAUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    paymentId,
    invoiceId,
    action,
    actor: actor || 'Finance User',
    timestamp: new Date().toISOString(),
    previousStatus,
    newStatus,
    amount,
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

// Authoritative Balance Recalculation Engine for Invoice
const syncInvoiceFinancialState = async (invoiceId) => {
  const invoice = await invoiceService.getInvoiceById(invoiceId);
  if (!invoice) return;

  const payments = getStoredPayments();
  const completedPayments = payments.filter(
    (p) => p.invoiceId === invoiceId && p.status === PAYMENT_STATUS.COMPLETED
  );

  const amountPaid = completedPayments.reduce((acc, p) => acc + Number(p.amount || 0), 0);
  const amountDue = Math.max(0, Number(invoice.grandTotal || 0) - amountPaid);

  let newStatus = invoice.status;
  // Derive status from financial state if not void or cancelled
  if (invoice.status !== INVOICE_STATUS.VOID && invoice.status !== INVOICE_STATUS.CANCELLED) {
    if (amountDue === 0 && amountPaid > 0) {
      newStatus = INVOICE_STATUS.PAID;
    } else if (amountPaid > 0 && amountDue > 0) {
      newStatus = INVOICE_STATUS.PARTIALLY_PAID;
    } else if (amountPaid === 0 && invoice.status === INVOICE_STATUS.PARTIALLY_PAID) {
      newStatus = INVOICE_STATUS.ISSUED;
    }
  }

  // Update stored invoice via raw storage sync
  try {
    const rawInvoices = JSON.parse(localStorage.getItem('dealflow360_invoices') || '[]');
    const idx = rawInvoices.findIndex((i) => i.id === invoiceId);
    if (idx !== -1) {
      rawInvoices[idx].amountPaid = Math.round(amountPaid * 100) / 100;
      rawInvoices[idx].amountDue = Math.round(amountDue * 100) / 100;
      rawInvoices[idx].status = newStatus;
      rawInvoices[idx].updatedAt = new Date().toISOString();
      localStorage.setItem('dealflow360_invoices', JSON.stringify(rawInvoices));
    }
  } catch (e) {
    console.error('Failed syncing invoice financial state', e);
  }
};

export const paymentService = {
  // 1. Query Payments
  getPayments: async (params = {}) => {
    let list = getStoredPayments();
    if (params.status) {
      list = list.filter((p) => p.status === params.status);
    }
    if (params.customerId) {
      list = list.filter((p) => p.customerId === params.customerId);
    }
    if (params.invoiceId) {
      list = list.filter((p) => p.invoiceId === params.invoiceId);
    }
    if (params.paymentMethod) {
      list = list.filter((p) => p.paymentMethod === params.paymentMethod);
    }
    if (params.currency) {
      list = list.filter((p) => p.currency === params.currency);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.paymentNumber.toLowerCase().includes(q) ||
          p.invoiceId.toLowerCase().includes(q) ||
          p.customerName.toLowerCase().includes(q) ||
          (p.referenceNumber && p.referenceNumber.toLowerCase().includes(q))
      );
    }
    return list;
  },

  getPaymentById: async (id) => {
    const list = getStoredPayments();
    return list.find((p) => p.id === id || p.paymentNumber === id) || null;
  },

  getPaymentsByInvoice: async (invoiceId) => {
    const list = getStoredPayments();
    return list.filter((p) => p.invoiceId === invoiceId);
  },

  // 2. Query Payable Invoices
  getEligibleInvoices: async () => {
    const list = await invoiceService.getInvoices();
    return list.filter(
      (i) =>
        (i.status === INVOICE_STATUS.ISSUED ||
          i.status === INVOICE_STATUS.PARTIALLY_PAID ||
          i.status === INVOICE_STATUS.OVERDUE) &&
        (i.amountDue === undefined || i.amountDue > 0)
    );
  },

  // 3. Record Payment against Invoice
  createPayment: async (paymentData, user = 'Finance User') => {
    if (!paymentData.invoiceId) {
      throw new Error('Target invoice reference is required to record a payment.');
    }

    const targetInvoice = await invoiceService.getInvoiceById(paymentData.invoiceId);
    if (!targetInvoice) {
      throw new Error('Target commercial invoice record not found.');
    }

    const valCheck = validatePaymentInput(paymentData, targetInvoice);
    if (!valCheck.isValid) {
      throw new Error(valCheck.errors.join(' '));
    }

    const list = getStoredPayments();
    const seqNum = String(list.length + 1).padStart(6, '0');
    const paymentNumber = `PAY-2026-${seqNum}`;

    const amount = Number(paymentData.amount);

    const newPayment = {
      id: paymentNumber,
      paymentNumber,
      organizationId: targetInvoice.organizationId || 'ORG-360-ALPHA',
      invoiceId: targetInvoice.id,
      customerId: targetInvoice.customerId,
      customerName: targetInvoice.customerName,
      orderId: targetInvoice.orderId,
      amount,
      currency: targetInvoice.currency || 'USD',
      paymentDate: paymentData.paymentDate || new Date().toISOString().split('T')[0],
      paymentMethod: paymentData.paymentMethod || PAYMENT_METHOD.BANK_TRANSFER,
      status: PAYMENT_STATUS.COMPLETED,
      referenceNumber: paymentData.referenceNumber || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: paymentData.notes || 'Payment received and recorded.',
      createdBy: user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedList = [newPayment, ...list];
    savePayments(updatedList);

    // Sync financial state & update invoice balance
    await syncInvoiceFinancialState(targetInvoice.id);

    logPaymentAudit(
      newPayment.id,
      targetInvoice.id,
      'PAYMENT_COMPLETED',
      user,
      'PENDING',
      PAYMENT_STATUS.COMPLETED,
      amount,
      `Payment ${newPayment.paymentNumber} of ${newPayment.currency} $${amount} recorded.`
    );

    return newPayment;
  },

  // 4. Cancel Payment
  cancelPayment: async (id, reason, user = 'Finance Admin') => {
    const reasonCheck = validatePaymentCancellation(reason);
    if (!reasonCheck.isValid) throw new Error(reasonCheck.error);

    const list = getStoredPayments();
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Payment record not found.');

    const p = list[index];
    if (p.status === PAYMENT_STATUS.CANCELLED) {
      throw new Error('Payment record is already cancelled.');
    }

    const prevStatus = p.status;
    p.status = PAYMENT_STATUS.CANCELLED;
    p.updatedAt = new Date().toISOString();

    list[index] = p;
    savePayments(list);

    // Recalculate invoice balance upon cancellation
    await syncInvoiceFinancialState(p.invoiceId);

    logPaymentAudit(id, p.invoiceId, 'PAYMENT_CANCELLED', user, prevStatus, PAYMENT_STATUS.CANCELLED, p.amount, reason);
    return p;
  },

  // 5. Payment Audit Logs
  getPaymentAuditLogs: async (paymentId = null) => {
    const logs = getStoredAuditLogs();
    if (paymentId) {
      return logs.filter((l) => l.paymentId === paymentId);
    }
    return logs;
  },
};
