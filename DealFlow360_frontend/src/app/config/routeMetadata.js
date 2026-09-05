/**
 * Route Metadata Mapping
 * Provides central route lookup for page titles, breadcrumbs, and permission guards.
 */
export const routeMetadataMap = {
  '/company/dashboard': {
    title: 'Executive Dashboard',
    subtitle: 'Real-time operational overview, key revenue indicators, and team activity.',
    breadcrumb: [{ label: 'Company', path: '/company/dashboard' }, { label: 'Dashboard' }],
    permission: 'dashboard.view',
  },
  '/company/customers': {
    title: 'Customer Accounts',
    subtitle: 'Manage enterprise B2B accounts, procurement contacts, and billing limits.',
    breadcrumb: [{ label: 'Company', path: '/company/dashboard' }, { label: 'Customers' }],
    permission: 'customers.view',
  },
  '/company/customers/:id': {
    title: 'Customer Account Details',
    subtitle: 'Detailed view of contract terms, assigned sales leads, and historical orders.',
    breadcrumb: [
      { label: 'Company', path: '/company/dashboard' },
      { label: 'Customers', path: '/company/customers' },
      { label: 'Account Profile' },
    ],
    permission: 'customers.view',
  },
  '/company/users': {
    title: 'Staff Management',
    subtitle: 'Authorized internal personnel, role assignments, and status management.',
    breadcrumb: [{ label: 'Company', path: '/company/dashboard' }, { label: 'Staff Users' }],
    permission: 'users.view',
  },
  '/company/users/:id': {
    title: 'Staff Member Profile',
    subtitle: 'Detailed permissions, assigned accounts, and security logs for staff.',
    breadcrumb: [
      { label: 'Company', path: '/company/dashboard' },
      { label: 'Staff Users', path: '/company/users' },
      { label: 'Profile' },
    ],
    permission: 'users.view',
  },
  '/company/roles': {
    title: 'Roles & Access Control',
    subtitle: 'Role-based access control (RBAC) definitions and permission matrices.',
    breadcrumb: [{ label: 'Company', path: '/company/dashboard' }, { label: 'Roles & Permissions' }],
    permission: 'roles.view',
  },
  '/company/roles/:id': {
    title: 'Role Specification',
    subtitle: 'Granular permissions and assigned staff for this security role.',
    breadcrumb: [
      { label: 'Company', path: '/company/dashboard' },
      { label: 'Roles', path: '/company/roles' },
      { label: 'Specification' },
    ],
    permission: 'roles.view',
  },
  '/company/products': {
    title: 'Product Catalog',
    subtitle: 'Master product listings, variants, unit specifications, and availability status.',
    breadcrumb: [{ label: 'Company', path: '/company/dashboard' }, { label: 'Products' }],
    permission: 'products.view',
  },
  '/company/products/:id': {
    title: 'Product Specification',
    subtitle: 'SKU attributes, pricing tiers, and inventory stock tracking.',
    breadcrumb: [
      { label: 'Company', path: '/company/dashboard' },
      { label: 'Products', path: '/company/products' },
      { label: 'Specification' },
    ],
    permission: 'products.view',
  },
  '/company/pricing': {
    title: 'Pricing & Contract Tiers',
    subtitle: 'Volume discount matrices, custom contract pricing, and currency rules.',
    breadcrumb: [{ label: 'Company', path: '/company/dashboard' }, { label: 'Pricing & Tiers' }],
    permission: 'pricing.view',
  },
  '/company/pricing/:id': {
    title: 'Contract Pricing Agreement',
    subtitle: 'Specific customer pricing tier details and margin requirements.',
    breadcrumb: [
      { label: 'Company', path: '/company/dashboard' },
      { label: 'Pricing', path: '/company/pricing' },
      { label: 'Agreement' },
    ],
    permission: 'pricing.view',
  },
  '/company/quotations': {
    title: 'Sales Quotations',
    subtitle: 'Draft, pending, and approved B2B sales proposals and discount requests.',
    breadcrumb: [{ label: 'Company', path: '/company/dashboard' }, { label: 'Quotations' }],
    permission: 'quotations.view',
  },
  '/company/quotations/:id': {
    title: 'Quotation Review',
    subtitle: 'Line item breakdown, approval workflow status, and customer agreement link.',
    breadcrumb: [
      { label: 'Company', path: '/company/dashboard' },
      { label: 'Quotations', path: '/company/quotations' },
      { label: 'Proposal Detail' },
    ],
    permission: 'quotations.view',
  },
  '/company/approvals': {
    title: 'Approval Queue',
    subtitle: 'Pending discount exceptions, credit limit extensions, and high-value orders.',
    breadcrumb: [{ label: 'Company', path: '/company/dashboard' }, { label: 'Approvals' }],
    permission: 'approvals.view',
  },
  '/company/orders': {
    title: 'Sales Orders',
    subtitle: 'Confirmed client orders, fulfillment stages, and billing milestones.',
    breadcrumb: [{ label: 'Company', path: '/company/dashboard' }, { label: 'Orders' }],
    permission: 'orders.view',
  },
  '/company/orders/:id': {
    title: 'Order Summary',
    subtitle: 'Order items, delivery status, invoice generation, and tracking details.',
    breadcrumb: [
      { label: 'Company', path: '/company/dashboard' },
      { label: 'Orders', path: '/company/orders' },
      { label: 'Order Summary' },
    ],
    permission: 'orders.view',
  },
  '/company/security': {
    title: 'Security Center',
    subtitle: 'Platform MFA enforcement, active staff sessions, and TLS security policy.',
    breadcrumb: [{ label: 'Company', path: '/company/dashboard' }, { label: 'Security' }],
    permission: 'security.view',
  },
  '/company/audit-logs': {
    title: 'Audit Logs',
    subtitle: 'Immutable system event records, authentication logs, and change history.',
    breadcrumb: [{ label: 'Company', path: '/company/dashboard' }, { label: 'Audit Logs' }],
    permission: 'audit_logs.view',
  },
  '/company/settings': {
    title: 'Company Settings',
    subtitle: 'Legal entity parameters, fiscal defaults, branding, and API webhooks.',
    breadcrumb: [{ label: 'Company', path: '/company/dashboard' }, { label: 'Settings' }],
    permission: 'settings.view',
  },
  '/company/profile': {
    title: 'Worker & Staff Profile',
    subtitle: 'Official employee record, security credentials, and workspace permissions.',
    breadcrumb: [{ label: 'Company', path: '/company/dashboard' }, { label: 'My Profile' }],
  },
  '/company/403': {
    title: 'Access Restricted',
    subtitle: 'You do not have the required permissions to view this resource.',
    breadcrumb: [{ label: 'Company', path: '/company/dashboard' }, { label: '403 Unauthorized' }],
  },
  '/company/404': {
    title: 'Page Not Found',
    subtitle: 'The requested route or resource does not exist.',
    breadcrumb: [{ label: 'Company', path: '/company/dashboard' }, { label: '404 Not Found' }],
  },
};

export function getRouteMetadata(pathname) {
  if (routeMetadataMap[pathname]) {
    return routeMetadataMap[pathname];
  }

  // Handle dynamic parameters like /company/customers/123
  const pattern = Object.keys(routeMetadataMap).find((key) => {
    if (!key.includes(':id')) return false;
    const base = key.replace('/:id', '');
    return pathname.startsWith(base) && pathname.split('/').length === key.split('/').length;
  });

  if (pattern) {
    return routeMetadataMap[pattern];
  }

  return {
    title: 'DealFlow360 Company Workspace',
    subtitle: 'Internal business management platform.',
    breadcrumb: [{ label: 'Company', path: '/company/dashboard' }, { label: 'Workspace' }],
  };
}
