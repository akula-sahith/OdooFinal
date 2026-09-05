/**
 * Invoicing Input & Status Transition Validation
 * Phase 14 — DealFlow360
 */

import { INVOICE_TRANSITIONS } from '../types/invoiceTypes';

export const validateInvoiceDates = (issueDate, dueDate) => {
  const errors = [];
  const issue = new Date(issueDate);
  const due = new Date(dueDate);

  if (isNaN(issue.getTime())) {
    errors.push('Invalid issue date format.');
  }
  if (isNaN(due.getTime())) {
    errors.push('Invalid due date format.');
  }
  if (!isNaN(issue.getTime()) && !isNaN(due.getTime()) && due < issue) {
    errors.push('Due date cannot be earlier than issue date.');
  }

  return { isValid: errors.length === 0, errors };
};

export const validateInvoiceItems = (items) => {
  const errors = [];
  if (!Array.isArray(items) || items.length === 0) {
    errors.push('Invoice must contain at least one line item.');
    return { isValid: false, errors };
  }

  items.forEach((item, idx) => {
    const qty = Number(item.quantity);
    const price = Number(item.unitPrice);
    const disc = Number(item.discount || 0);
    const tax = Number(item.taxRate || 0);

    if (isNaN(qty) || qty <= 0) {
      errors.push(`Line item #${idx + 1} (${item.productNameSnapshot || 'Item'}): Quantity must be greater than 0.`);
    }
    if (isNaN(price) || price < 0) {
      errors.push(`Line item #${idx + 1}: Unit price cannot be negative.`);
    }
    if (isNaN(disc) || disc < 0) {
      errors.push(`Line item #${idx + 1}: Discount cannot be negative.`);
    }
    if (isNaN(tax) || tax < 0) {
      errors.push(`Line item #${idx + 1}: Tax rate cannot be negative.`);
    }
  });

  return { isValid: errors.length === 0, errors };
};

export const validateInvoiceCreation = (invoiceData) => {
  const errors = [];

  if (!invoiceData.orderId) {
    errors.push('Originating Sales Order ID is required for invoice creation.');
  }
  if (!invoiceData.customerName && !invoiceData.customerId) {
    errors.push('Customer account reference is required.');
  }

  const dateCheck = validateInvoiceDates(invoiceData.issueDate, invoiceData.dueDate);
  if (!dateCheck.isValid) {
    errors.push(...dateCheck.errors);
  }

  const itemsCheck = validateInvoiceItems(invoiceData.items);
  if (!itemsCheck.isValid) {
    errors.push(...itemsCheck.errors);
  }

  return { isValid: errors.length === 0, errors };
};

export const validateInvoiceStatusTransition = (currentStatus, targetStatus) => {
  const allowed = INVOICE_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(targetStatus)) {
    return {
      isValid: false,
      error: `Invalid invoice status transition from ${currentStatus} to ${targetStatus}.`,
    };
  }
  return { isValid: true, error: null };
};

export const validateVoidReason = (reason) => {
  if (!reason || !reason.trim() || reason.trim().length < 5) {
    return {
      isValid: false,
      error: 'A detailed reason (at least 5 characters) is required to void or cancel an invoice.',
    };
  }
  return { isValid: true, error: null };
};
