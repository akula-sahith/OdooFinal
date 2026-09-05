/**
 * DEALFLOW360 Centralized Design Tokens
 * Single source of truth for colors, typography, spacing, radius, shadows, and status definitions.
 */

export const COLORS = {
  // Brand Colors (DealFlow360 Reference Architecture)
  brand: {
    plum: '#714B67',
    plumDark: '#56384E',
    plumLight: '#F7F2F5',
    teal: '#00A09D',
    tealLight: '#E6F6F6',
  },

  // Surfaces & Backgrounds
  background: '#F8FAFC', // slate-50
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceHover: '#F8FAFC',

  // Text Hierarchy
  text: {
    primary: '#0F172A',   // slate-900
    secondary: '#334155', // slate-700
    muted: '#64748B',     // slate-500
    inverse: '#FFFFFF',
    brand: '#714B67',
  },

  // Borders
  border: {
    subtle: '#F1F5F9', // slate-100
    default: '#E2E8F0', // slate-200
    strong: '#CBD5E1',  // slate-300
    focus: '#714B67',
  },

  // Interactive & Semantic States
  state: {
    accent: '#714B67',
    accentHover: '#56384E',
    success: '#059669', // emerald-600
    successBg: '#ECFDF5',
    warning: '#D97706', // amber-600
    warningBg: '#FFFBEB',
    error: '#DC2626',   // red-600
    errorBg: '#FEF2F2',
    info: '#2563EB',    // blue-600
    infoBg: '#EFF6FF',
  },
};

export const SPACING = {
  '3xs': '0.125rem', // 2px
  '2xs': '0.25rem',  // 4px
  xs: '0.5rem',    // 8px
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
};

export const RADIUS = {
  small: '0.375rem',  // rounded-md
  medium: '0.75rem',  // rounded-xl
  large: '1rem',      // rounded-2xl
  pill: '9999px',     // rounded-full
};

export const SHADOWS = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
  small: '0 1px 3px 0 rgba(15, 23, 42, 0.1), 0 1px 2px -1px rgba(15, 23, 42, 0.1)',
  medium: '0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -2px rgba(15, 23, 42, 0.1)',
  large: '0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.1)',
};

export const TYPOGRAPHY = {
  fonts: {
    heading: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    body: "'Aptos', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    handwritten: "'Caveat', cursive",
    mono: "'Fira Code', 'JetBrains Mono', monospace",
  },
  sizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
  },
};

/**
 * Centralized Status Definitions for DealFlow360 Workflows
 */
export const STATUS_DEFINITIONS = {
  ACTIVE: { label: 'Active', variant: 'success', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  INACTIVE: { label: 'Inactive', variant: 'neutral', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
  PENDING: { label: 'Pending', variant: 'warning', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  PENDING_MANAGER_APPROVAL: { label: 'Pending Manager Approval', variant: 'warning', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  PENDING_FINANCE_APPROVAL: { label: 'Pending Finance Approval', variant: 'warning', bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  REVISION_REQUESTED: { label: 'Revision Requested', variant: 'info', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  APPROVED: { label: 'Approved', variant: 'plum', bg: 'bg-[#F7F2F5]', text: 'text-[#714B67]', border: 'border-[#714B67]/30' },
  REJECTED: { label: 'Rejected', variant: 'error', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  DRAFT: { label: 'Draft', variant: 'neutral', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
  SENT: { label: 'Sent', variant: 'info', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  ACCEPTED: { label: 'Accepted', variant: 'plum', bg: 'bg-[#F7F2F5]', text: 'text-[#714B67]', border: 'border-[#714B67]/30' },
  EXPIRED: { label: 'Expired', variant: 'error', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  CANCELLED: { label: 'Cancelled', variant: 'error', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  PROCESSING: { label: 'Processing', variant: 'info', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  COMPLETED: { label: 'Completed', variant: 'plum', bg: 'bg-[#F7F2F5]', text: 'text-[#714B67]', border: 'border-[#714B67]/30' },
};
