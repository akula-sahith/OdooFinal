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
  '/company/sales/dashboard': {
    title: 'Salesperson Workspace Dashboard',
    subtitle: 'Track assigned requirement requests, active clarifications, and requirement confirmations.',
    breadcrumb: [{ label: 'Sales Workspace', path: '/company/sales/dashboard' }, { label: 'Dashboard' }],
    permission: 'requests.view',
  },
  '/company/sales/requests': {
    title: 'Requirement Requests Workspace',
    subtitle: 'Review customer commercial requests, initiate clarifications, and confirm requirements.',
    breadcrumb: [{ label: 'Sales Workspace', path: '/company/sales/dashboard' }, { label: 'Requirement Requests' }],
    permission: 'requests.view',
  },
  '/company/sales/requests/:id': {
    title: 'Requirement Request Detail',
    subtitle: 'Inspect customer specifications, communicate in real-time, and manage requirement lifecycle.',
    breadcrumb: [
      { label: 'Sales Workspace', path: '/company/sales/dashboard' },
      { label: 'Requests', path: '/company/sales/requests' },
      { label: 'Request Detail' },
    ],
    permission: 'requests.view',
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
  '/company/users/new': {
    title: 'Provision Staff User',
    subtitle: 'Create a new internal staff member profile and assign a security role identity.',
    breadcrumb: [
      { label: 'Company', path: '/company/dashboard' },
      { label: 'Staff Users', path: '/company/users' },
      { label: 'Provision User' },
    ],
    permission: 'users.create',
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
  '/company/users/:id/edit': {
    title: 'Edit Staff Profile',
    subtitle: 'Update staff profile details, role identity assignment, or access governance status.',
    breadcrumb: [
      { label: 'Company', path: '/company/dashboard' },
      { label: 'Staff Users', path: '/company/users' },
      { label: 'Edit Profile' },
    ],
    permission: 'users.update',
  },
  '/company/roles': {
    title: 'Roles & Access Control',
    subtitle: 'Role-based access control (RBAC) definitions and permission matrices.',
    breadcrumb: [{ label: 'Company', path: '/company/dashboard' }, { label: 'Roles & Permissions' }],
    permission: 'roles.view',
  },
  '/company/roles/new': {
    title: 'Create Security Role',
    subtitle: 'Define a new RBAC security role and assign fine-grained action capabilities.',
    breadcrumb: [
      { label: 'Company', path: '/company/dashboard' },
      { label: 'Roles', path: '/company/roles' },
      { label: 'Create Role' },
    ],
    permission: 'roles.create',
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
  '/company/roles/:id/edit': {
    title: 'Edit Security Role',
    subtitle: 'Modify security role details, description, or assigned capability matrix.',
    breadcrumb: [
      { label: 'Company', path: '/company/dashboard' },
      { label: 'Roles', path: '/company/roles' },
      { label: 'Edit Role' },
    ],
    permission: 'roles.update',
  },
  '/company/permissions': {
    title: 'Permission Reference Catalogue',
    subtitle: 'Centralized master repository of fine-grained capability tokens governing DealFlow360 RBAC policy.',
    breadcrumb: [
      { label: 'Company', path: '/company/dashboard' },
      { label: 'Roles', path: '/company/roles' },
      { label: 'Permission Catalogue' },
    ],
    permission: 'permissions.view',
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
  '/company/discount-tiers': {
    title: 'Discount Tiers Governance',
    subtitle: 'Configure permitted discount percentages, role-based thresholds, and approval escalation tiers.',
    breadcrumb: [{ label: 'Company', path: '/company/dashboard' }, { label: 'Discount Tiers' }],
    permission: 'discounts.view',
  },
  '/company/discount-tiers/new': {
    title: 'Create Discount Tier',
    subtitle: 'Define a new discount threshold rule, permitted percentage bounds, and required approval role.',
    breadcrumb: [
      { label: 'Company', path: '/company/dashboard' },
      { label: 'Discount Tiers', path: '/company/discount-tiers' },
      { label: 'Create Tier' },
    ],
    permission: 'discounts.create',
  },
  '/company/discount-tiers/:id': {
    title: 'Discount Tier Specifications',
    subtitle: 'Detailed view of discount threshold parameters, approval escalation rules, and status.',
    breadcrumb: [
      { label: 'Company', path: '/company/dashboard' },
      { label: 'Discount Tiers', path: '/company/discount-tiers' },
      { label: 'Tier Specifications' },
    ],
    permission: 'discounts.view',
  },
  '/company/discount-tiers/:id/edit': {
    title: 'Edit Discount Tier',
    subtitle: 'Modify governance thresholds, approval level, or active dates for discount tier rule.',
    breadcrumb: [
      { label: 'Company', path: '/company/dashboard' },
      { label: 'Discount Tiers', path: '/company/discount-tiers' },
      { label: 'Edit Tier' },
    ],
    permission: 'discounts.update',
  },
  '/company/approval-chain': {
    title: 'Approval Chain Governance',
    subtitle: 'Configure discount escalation thresholds, authorized review roles, and multi-tier approval sequence.',
    breadcrumb: [{ label: 'Company', path: '/company/dashboard' }, { label: 'Approval Chain' }],
    permission: 'approvals.view',
  },
  '/company/quotations': {
    title: 'Sales Quotations Workspace',
    subtitle: 'Draft commercial proposals, associate price list catalogs, and track proposal governance.',
    breadcrumb: [{ label: 'Company', path: '/company/dashboard' }, { label: 'Quotations' }],
    permission: 'quotations.view',
  },
  '/company/quotations/new': {
    title: 'Draft Sales Quotation',
    subtitle: 'Select confirmed customer requirement, associate commercial price list, and specify line items.',
    breadcrumb: [
      { label: 'Company', path: '/company/dashboard' },
      { label: 'Quotations', path: '/company/quotations' },
      { label: 'Create Quotation' },
    ],
    permission: 'quotations.create',
  },
  '/company/quotations/:id': {
    title: 'Sales Quotation Detail',
    subtitle: 'Inspect commercial proposal line items, customer specifications, and preliminary totals.',
    breadcrumb: [
      { label: 'Company', path: '/company/dashboard' },
      { label: 'Quotations', path: '/company/quotations' },
      { label: 'Quotation Detail' },
    ],
    permission: 'quotations.view',
  },
  '/company/quotations/:id/edit': {
    title: 'Edit Draft Quotation',
    subtitle: 'Modify line items, quantities, proposal title, or validity period for draft proposal.',
    breadcrumb: [
      { label: 'Company', path: '/company/dashboard' },
      { label: 'Quotations', path: '/company/quotations' },
      { label: 'Edit Draft' },
    ],
    permission: 'quotations.update',
  },
  '/company/approvals': {
    title: 'Proposal Approval Workspace',
    subtitle: 'Review commercial proposals, authorize discount exceptions, or request revisions.',
    breadcrumb: [{ label: 'Company', path: '/company/dashboard' }, { label: 'Approvals' }],
    permission: 'approvals.view',
  },
  '/company/approvals/:id': {
    title: 'Commercial Proposal Approval Review',
    subtitle: 'Inspect submitted commercial specifications, governance risk classification, and execute decision.',
    breadcrumb: [
      { label: 'Company', path: '/company/dashboard' },
      { label: 'Approvals', path: '/company/approvals' },
      { label: 'Approval Review' },
    ],
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
