/**
 * Payment Domain Types & Method Enums
 * Phase 15 — DealFlow360
 */

// Payment Status Enum
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
};

// Payment Method Enum
export const PAYMENT_METHOD = {
  BANK_TRANSFER: 'BANK_TRANSFER',
  CARD: 'CARD',
  CASH: 'CASH',
  CHEQUE: 'CHEQUE',
  ONLINE: 'ONLINE',
  OTHER: 'OTHER',
};

// Payment Method Display Labels
export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHOD.BANK_TRANSFER]: 'Bank Wire / ACH Transfer',
  [PAYMENT_METHOD.CARD]: 'Credit / Debit Card',
  [PAYMENT_METHOD.CASH]: 'Cash Deposit',
  [PAYMENT_METHOD.CHEQUE]: 'Bank Cheque / Draft',
  [PAYMENT_METHOD.ONLINE]: 'Online Payment Gateway',
  [PAYMENT_METHOD.OTHER]: 'Other Method',
};
