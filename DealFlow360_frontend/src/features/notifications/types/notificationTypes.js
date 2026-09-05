/**
 * Centralized Notification Types & Target Route Resolvers
 * Phase 17 — DealFlow360
 */

export const NOTIFICATION_TYPES = {
  // Quotation Events
  QUOTATION_RECEIVED: 'QUOTATION_RECEIVED',
  QUOTATION_REVISION_REQUESTED: 'QUOTATION_REVISION_REQUESTED',
  QUOTATION_APPROVED: 'QUOTATION_APPROVED',
  QUOTATION_REJECTED: 'QUOTATION_REJECTED',
  QUOTATION_ACCEPTED: 'QUOTATION_ACCEPTED',

  // Order Events
  ORDER_CREATED: 'ORDER_CREATED',
  ORDER_CONFIRMED: 'ORDER_CONFIRMED',
  ORDER_PROCESSING: 'ORDER_PROCESSING',
  ORDER_SHIPPED: 'ORDER_SHIPPED',
  ORDER_DELIVERED: 'ORDER_DELIVERED',

  // Invoice Events
  INVOICE_ISSUED: 'INVOICE_ISSUED',
  INVOICE_OVERDUE: 'INVOICE_OVERDUE',

  // Payment Events
  PAYMENT_RECEIVED: 'PAYMENT_RECEIVED',
  PAYMENT_FAILED: 'PAYMENT_FAILED',

  // Shipment Events
  SHIPMENT_CREATED: 'SHIPMENT_CREATED',
  SHIPMENT_DISPATCHED: 'SHIPMENT_DISPATCHED',
  SHIPMENT_DELIVERED: 'SHIPMENT_DELIVERED',

  // Messaging & Requests
  MESSAGE_RECEIVED: 'MESSAGE_RECEIVED',
  NEW_REQUEST: 'NEW_REQUEST',
  REQUEST_ASSIGNED: 'REQUEST_ASSIGNED',
  CLARIFICATION_REQUESTED: 'CLARIFICATION_REQUESTED',
  CUSTOMER_REPLY: 'CUSTOMER_REPLY',
  REQUIREMENT_CONFIRMED: 'REQUIREMENT_CONFIRMED',
};

export const NOTIFICATION_METADATA = {
  QUOTATION_RECEIVED: { title: 'Quotation Proposal Sent', variant: 'purple' },
  QUOTATION_REVISION_REQUESTED: { title: 'Quotation Revision Requested', variant: 'amber' },
  QUOTATION_ACCEPTED: { title: 'Quotation Accepted by Client', variant: 'success' },
  ORDER_CREATED: { title: 'New Sales Order Created', variant: 'info' },
  ORDER_CONFIRMED: { title: 'Sales Order Confirmed', variant: 'purple' },
  ORDER_SHIPPED: { title: 'Order Dispatched to Carrier', variant: 'amber' },
  ORDER_DELIVERED: { title: 'Order Delivered Successfully', variant: 'success' },
  INVOICE_ISSUED: { title: 'Commercial Invoice Issued', variant: 'info' },
  INVOICE_OVERDUE: { title: 'Invoice Overdue Warning', variant: 'rose' },
  PAYMENT_RECEIVED: { title: 'Payment Remittance Received', variant: 'success' },
  PAYMENT_FAILED: { title: 'Payment Remittance Failed', variant: 'rose' },
  SHIPMENT_DISPATCHED: { title: 'Consignment Dispatched', variant: 'amber' },
  SHIPMENT_DELIVERED: { title: 'Consignment Delivered', variant: 'success' },
  MESSAGE_RECEIVED: { title: 'New Contextual Message', variant: 'purple' },
};

/**
 * Resolves the authorized destination path based on user role and notification payload.
 */
export function resolveNotificationRoute(notification, userType = 'CUSTOMER') {
  if (!notification) {
    return userType === 'SALESPERSON' ? '/company/dashboard' : '/customer/dashboard';
  }

  const isCustomer = userType === 'CUSTOMER';
  const { entityType, entityId, requestId } = notification;

  if (entityType === 'QUOTATION' && entityId) {
    return isCustomer ? `/customer/quotations/${entityId}` : `/company/quotations/${entityId}`;
  }
  if (entityType === 'ORDER' && entityId) {
    return isCustomer ? `/customer/orders/${entityId}` : `/company/orders/${entityId}`;
  }
  if (entityType === 'INVOICE' && entityId) {
    return isCustomer ? `/customer/invoices/${entityId}` : `/company/invoices/${entityId}`;
  }
  if (entityType === 'PAYMENT' && entityId) {
    return isCustomer ? `/customer/payments/${entityId}` : `/company/payments/${entityId}`;
  }
  if (entityType === 'SHIPMENT' && entityId) {
    return isCustomer ? `/customer/shipments/${entityId}` : `/company/fulfillment/shipments/${entityId}`;
  }

  if (requestId) {
    return isCustomer ? `/customer/requests/${requestId}` : `/company/sales/requests/${requestId}`;
  }

  return isCustomer ? '/customer/messages' : '/company/messages';
}
