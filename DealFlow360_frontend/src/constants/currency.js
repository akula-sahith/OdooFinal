/**
 * Centralized Supported Currency Configuration
 * Provides application-wide currency definitions and symbol formatting.
 */
export const SUPPORTED_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
];

/**
 * Formats a numeric amount using the specified currency code.
 *
 * @param {number|string} amount
 * @param {string} [currencyCode='USD']
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currencyCode = 'USD') => {
  if (amount === undefined || amount === null || amount === '' || isNaN(Number(amount))) {
    return '-';
  }

  const num = Number(amount);
  const code = (currencyCode || 'USD').toUpperCase();

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    const currencyObj = SUPPORTED_CURRENCIES.find((c) => c.code === code);
    const symbol = currencyObj ? currencyObj.symbol : code;
    return `${symbol} ${num.toFixed(2)}`;
  }
};
