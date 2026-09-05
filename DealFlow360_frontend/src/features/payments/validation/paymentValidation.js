/**
 * Payment Input & Eligibility Validation
 * Phase 15 — DealFlow360
 */

export const validatePaymentInput = (paymentData, targetInvoice) => {
  const errors = [];

  if (!targetInvoice) {
    errors.push('Valid invoice reference is required to record a payment.');
    return { isValid: false, errors };
  }

  // Invoice status check
  if (targetInvoice.status === 'VOID' || targetInvoice.status === 'CANCELLED') {
    errors.push(`Cannot record payment against an invoice with status ${targetInvoice.status}.`);
  }
  if (targetInvoice.status === 'PAID') {
    errors.push('Invoice is already fully PAID. No further payments can be accepted.');
  }

  // Amount validation
  const amount = Number(paymentData.amount);
  if (isNaN(amount) || amount <= 0) {
    errors.push('Payment amount must be a positive number greater than 0.');
  }

  const outstanding = Number(targetInvoice.amountDue !== undefined ? targetInvoice.amountDue : targetInvoice.grandTotal);
  if (!isNaN(amount) && amount > outstanding) {
    errors.push(
      `Payment amount ($${amount.toLocaleString()}) exceeds the invoice outstanding balance ($${outstanding.toLocaleString()}).`
    );
  }

  // Currency matching rule
  if (paymentData.currency && targetInvoice.currency && paymentData.currency !== targetInvoice.currency) {
    errors.push(
      `Payment currency (${paymentData.currency}) does not match invoice currency (${targetInvoice.currency}).`
    );
  }

  // Date validation
  if (!paymentData.paymentDate) {
    errors.push('Payment date is required.');
  } else {
    const pDate = new Date(paymentData.paymentDate);
    if (isNaN(pDate.getTime())) {
      errors.push('Invalid payment date format.');
    }
  }

  // Payment Method
  if (!paymentData.paymentMethod) {
    errors.push('Payment method selection is required.');
  }

  return { isValid: errors.length === 0, errors };
};

export const validatePaymentCancellation = (reason) => {
  if (!reason || !reason.trim() || reason.trim().length < 5) {
    return {
      isValid: false,
      error: 'A detailed reason (at least 5 characters) is required to cancel a payment record.',
    };
  }
  return { isValid: true, error: null };
};
