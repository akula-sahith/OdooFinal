/**
 * Phase 18 — Reporting & Analytics Types & Constants
 */

export const DATE_RANGES = {
  TODAY: 'TODAY',
  THIS_WEEK: 'THIS_WEEK',
  THIS_MONTH: 'THIS_MONTH',
  THIS_QUARTER: 'THIS_QUARTER',
  THIS_YEAR: 'THIS_YEAR',
  CUSTOM: 'CUSTOM',
};

export const DATE_RANGE_LABELS = {
  TODAY: 'Today',
  THIS_WEEK: 'This Week',
  THIS_MONTH: 'This Month',
  THIS_QUARTER: 'This Quarter',
  THIS_YEAR: 'This Year',
  CUSTOM: 'Custom Range',
};

export const EXCHANGE_RATES = {
  USD: 1.0,
  INR: 0.012, // 1 INR = ~0.012 USD
  EUR: 1.09,  // 1 EUR = ~1.09 USD
  GBP: 1.27,  // 1 GBP = ~1.27 USD
  CAD: 0.74,  // 1 CAD = ~0.74 USD
};

export const convertToBaseUSD = (amount = 0, currency = 'USD') => {
  const rate = EXCHANGE_RATES[(currency || 'USD').toUpperCase()] || 1.0;
  return Number(amount || 0) * rate;
};

export const formatCurrencyUSD = (amount = 0) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

export const formatCurrencyINR = (amount = 0) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0);
};
