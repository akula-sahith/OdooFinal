/**
 * Fulfillment & Shipping Input & Transition Validation
 * Phase 13 — DealFlow360
 */

import { FULFILLMENT_TRANSITIONS, SHIPMENT_TRANSITIONS } from '../types/fulfillmentTypes';

export const validatePickQuantity = (pickedQty, allocatedQty, remainingQty) => {
  const errors = [];
  const qty = Number(pickedQty);
  if (isNaN(qty) || qty <= 0) {
    errors.push('Pick quantity must be a positive number greater than 0.');
  }
  if (qty > remainingQty) {
    errors.push(`Cannot pick ${qty} units. Only ${remainingQty} units remaining to pick.`);
  }
  if (qty > allocatedQty) {
    errors.push(`Cannot pick ${qty} units. Maximum allocated quantity is ${allocatedQty}.`);
  }
  return { isValid: errors.length === 0, errors };
};

export const validatePackageDimensions = (pkgData) => {
  const errors = [];
  const weight = Number(pkgData.weight);
  const length = Number(pkgData.length);
  const width = Number(pkgData.width);
  const height = Number(pkgData.height);

  if (isNaN(weight) || weight < 0) {
    errors.push('Package weight must be 0 or greater.');
  }
  if (isNaN(length) || length < 0 || isNaN(width) || width < 0 || isNaN(height) || height < 0) {
    errors.push('Package dimensions must be 0 or greater.');
  }
  if (!pkgData.packageNumber || !pkgData.packageNumber.trim()) {
    errors.push('Package number/identifier is required.');
  }
  return { isValid: errors.length === 0, errors };
};

export const validatePackageItemQuantity = (packedQty, pickedQtyRemaining) => {
  const errors = [];
  const qty = Number(packedQty);
  if (isNaN(qty) || qty <= 0) {
    errors.push('Package item quantity must be greater than 0.');
  }
  if (qty > pickedQtyRemaining) {
    errors.push(`Cannot pack ${qty} units. Only ${pickedQtyRemaining} picked units remain unassigned.`);
  }
  return { isValid: errors.length === 0, errors };
};

export const validateShippingAddressSnapshot = (address) => {
  const errors = [];
  if (!address) {
    errors.push('Shipping address snapshot is required.');
    return { isValid: false, errors };
  }
  if (!address.recipientName || !address.recipientName.trim()) {
    errors.push('Recipient name is required.');
  }
  if (!address.addressLine1 || !address.addressLine1.trim()) {
    errors.push('Address Line 1 is required.');
  }
  if (!address.city || !address.city.trim()) {
    errors.push('City is required.');
  }
  if (!address.country || !address.country.trim()) {
    errors.push('Country is required.');
  }
  if (!address.postalCode || !address.postalCode.trim()) {
    errors.push('Postal code is required.');
  }
  return { isValid: errors.length === 0, errors };
};

export const validateCarrierInput = (carrierData) => {
  const errors = [];
  if (!carrierData.name || !carrierData.name.trim()) {
    errors.push('Carrier name is required.');
  }
  if (!carrierData.carrierCode || !carrierData.carrierCode.trim()) {
    errors.push('Carrier code (e.g., FEDEX, DHL) is required.');
  }
  return { isValid: errors.length === 0, errors };
};

export const validateFulfillmentStatusTransition = (currentStatus, targetStatus) => {
  const allowed = FULFILLMENT_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(targetStatus)) {
    return {
      isValid: false,
      error: `Invalid status transition from ${currentStatus} to ${targetStatus}.`,
    };
  }
  return { isValid: true, error: null };
};

export const validateShipmentStatusTransition = (currentStatus, targetStatus) => {
  const allowed = SHIPMENT_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(targetStatus)) {
    return {
      isValid: false,
      error: `Invalid shipment status transition from ${currentStatus} to ${targetStatus}.`,
    };
  }
  return { isValid: true, error: null };
};
