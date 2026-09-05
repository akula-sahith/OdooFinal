/**
 * Centralized Monetary & Quotation Calculation Utility
 * Enforces safe precision arithmetic (preventing floating-point issues).
 * Production authoritative totals must eventually be verified by backend.
 */

/**
 * Safely parses and rounds a monetary amount to 2 decimal places using minor units.
 * @param {number|string} val
 * @returns {number}
 */
export const roundMoney = (val) => {
  const num = Number(val);
  if (isNaN(num) || !isFinite(num)) return 0;
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

/**
 * Calculates line subtotal from quantity and unit base price.
 * @param {number|string} quantity
 * @param {number|string} unitBasePrice
 * @returns {number}
 */
export const calculateLineSubtotal = (quantity, unitBasePrice) => {
  const qty = Number(quantity);
  const price = Number(unitBasePrice);

  if (isNaN(qty) || qty <= 0 || !isFinite(qty)) return 0;
  if (isNaN(price) || price < 0 || !isFinite(price)) return 0;

  const qtyInCents = Math.round(qty * 100);
  const priceInCents = Math.round(price * 100);
  const lineSubtotalCents = (qtyInCents * priceInCents) / 100;

  return roundMoney(lineSubtotalCents / 100);
};

/**
 * Calculates line discount amount from line subtotal and requested discount percentage.
 * @param {number|string} lineSubtotal
 * @param {number|string} discountPercentage
 * @returns {number}
 */
export const calculateLineDiscountAmount = (lineSubtotal, discountPercentage) => {
  const sub = Number(lineSubtotal);
  const pct = Number(discountPercentage);

  if (isNaN(sub) || sub <= 0 || isNaN(pct) || pct <= 0) return 0;

  const subCents = Math.round(sub * 100);
  const discountCents = Math.round(subCents * (pct / 100));

  return roundMoney(discountCents / 100);
};

/**
 * Calculates net line amount (line subtotal minus discount amount).
 * @param {number|string} lineSubtotal
 * @param {number|string} discountAmount
 * @returns {number}
 */
export const calculateNetLineAmount = (lineSubtotal, discountAmount) => {
  const sub = Math.round(Number(lineSubtotal || 0) * 100);
  const disc = Math.round(Number(discountAmount || 0) * 100);
  const netCents = Math.max(0, sub - disc);

  return roundMoney(netCents / 100);
};

/**
 * Calculates sum of all line subtotals in a quotation.
 * @param {Array} items
 * @returns {number}
 */
export const calculateSubtotal = (items = []) => {
  if (!Array.isArray(items)) return 0;
  const subtotalCents = items.reduce((sum, item) => {
    const lineSubtotal = item.lineSubtotal ?? calculateLineSubtotal(item.quantity, item.unitBasePrice);
    return sum + Math.round(Number(lineSubtotal) * 100);
  }, 0);
  return roundMoney(subtotalCents / 100);
};

/**
 * Calculates discount total from item line discounts.
 * @param {Array} items
 * @returns {number}
 */
export const calculateDiscountTotal = (items = []) => {
  if (!Array.isArray(items)) return 0;
  const discountCents = items.reduce((sum, item) => {
    const disc = item.discountAmount ?? calculateLineDiscountAmount(item.lineSubtotal, item.requestedDiscountPercentage);
    return sum + Math.round(Number(disc) * 100);
  }, 0);
  return roundMoney(discountCents / 100);
};

/**
 * Calculates net subtotal (subtotal minus total discounts).
 * @param {number} subtotal
 * @param {number} discountTotal
 * @returns {number}
 */
export const calculateNetSubtotal = (subtotal = 0, discountTotal = 0) => {
  const sub = Math.round(Number(subtotal) * 100);
  const disc = Math.round(Number(discountTotal) * 100);
  const netCents = Math.max(0, sub - disc);
  return roundMoney(netCents / 100);
};

/**
 * Calculates tax total.
 * @param {Array} items
 * @returns {number}
 */
export const calculateTaxTotal = (items = []) => {
  if (!Array.isArray(items)) return 0;
  const taxCents = items.reduce((sum, item) => {
    return sum + Math.round(Number(item.taxAmount || 0) * 100);
  }, 0);
  return roundMoney(taxCents / 100);
};

/**
 * Calculates effective average discount percentage across the quotation.
 * @param {number} subtotal
 * @param {number} discountTotal
 * @returns {number}
 */
export const calculateEffectiveDiscountPercentage = (subtotal = 0, discountTotal = 0) => {
  const sub = Number(subtotal);
  const disc = Number(discountTotal);
  if (sub <= 0 || disc <= 0) return 0;
  return roundMoney((disc / sub) * 100);
};

/**
 * Calculates grand total based on subtotal, discountTotal, and taxTotal.
 * @param {number} subtotal
 * @param {number} discountTotal
 * @param {number} taxTotal
 * @returns {number}
 */
export const calculateGrandTotal = (subtotal = 0, discountTotal = 0, taxTotal = 0) => {
  const sub = Math.round(Number(subtotal) * 100);
  const disc = Math.round(Number(discountTotal) * 100);
  const tax = Math.round(Number(taxTotal) * 100);

  const grandCents = Math.max(0, sub - disc + tax);
  return roundMoney(grandCents / 100);
};
