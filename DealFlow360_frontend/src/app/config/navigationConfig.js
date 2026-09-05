import {
  LayoutDashboard,
  Users,
  FileText,
  ShoppingCart,
  Package,
  Tag,
  UserCheck,
  ShieldAlert,
  CheckCircle2,
  Lock,
  FileSpreadsheet,
  Sliders,
} from 'lucide-react';

/**
 * Centralized Enterprise Navigation Architecture
 * Defines all sidebar sections, items, routes, and required permissions.
 */
export const navigationSections = [
  {
    id: 'workspace',
    title: 'WORKSPACE',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        route: '/company/dashboard',
        icon: LayoutDashboard,
        permission: 'dashboard.view',
        description: 'Executive overview and real-time operational metrics',
      },
    ],
  },
  {
    id: 'sales',
    title: 'SALES',
    items: [
      {
        id: 'customers',
        label: 'Customers',
        route: '/company/customers',
        icon: Users,
        permission: 'customers.view',
        matchRoutes: ['/company/customers'],
        description: 'B2B client relationships and enterprise accounts',
      },
      {
        id: 'quotations',
        label: 'Quotations',
        route: '/company/quotations',
        icon: FileText,
        permission: 'quotations.view',
        matchRoutes: ['/company/quotations'],
        badge: 'Drafts',
        description: 'B2B pricing proposals and quotation approvals',
      },
      {
        id: 'orders',
        label: 'Orders',
        route: '/company/orders',
        icon: ShoppingCart,
        permission: 'orders.view',
        matchRoutes: ['/company/orders'],
        description: 'Confirmed sales orders and fulfillment pipelines',
      },
    ],
  },
  {
    id: 'catalog',
    title: 'CATALOG',
    items: [
      {
        id: 'products',
        label: 'Products',
        route: '/company/products',
        icon: Package,
        permission: 'products.view',
        matchRoutes: ['/company/products'],
        description: 'Master product catalog, inventory units, and SKUs',
      },
      {
        id: 'pricing',
        label: 'Price Lists',
        route: '/company/price-lists',
        icon: Tag,
        permission: 'pricing.view',
        matchRoutes: ['/company/price-lists', '/company/pricing'],
        description: 'Configure base product price lists and currency catalogs',
      },
    ],
  },
  {
    id: 'management',
    title: 'MANAGEMENT',
    items: [
      {
        id: 'users',
        label: 'Staff Users',
        route: '/company/users',
        icon: UserCheck,
        permission: 'users.view',
        matchRoutes: ['/company/users'],
        description: 'Internal staff profiles, status, and department access',
      },
      {
        id: 'roles',
        label: 'Roles & Permissions',
        route: '/company/roles',
        icon: ShieldAlert,
        permission: 'roles.view',
        matchRoutes: ['/company/roles'],
        description: 'RBAC role assignments and security policies',
      },
      {
        id: 'approvals',
        label: 'Approvals',
        route: '/company/approvals',
        icon: CheckCircle2,
        permission: 'approvals.view',
        description: 'Discount, credit limit, and workflow approval queue',
      },
    ],
  },
  {
    id: 'system',
    title: 'SYSTEM',
    items: [
      {
        id: 'security',
        label: 'Security Center',
        route: '/company/security',
        icon: Lock,
        permission: 'security.view',
        description: 'MFA status, active sessions, and TLS enforcement',
      },
      {
        id: 'audit-logs',
        label: 'Audit Logs',
        route: '/company/audit-logs',
        icon: FileSpreadsheet,
        permission: 'audit_logs.view',
        description: 'Immutable system audit trails and compliance logs',
      },
      {
        id: 'settings',
        label: 'Company Settings',
        route: '/company/settings',
        icon: Sliders,
        permission: 'settings.view',
        description: 'Platform preferences, legal entity info, and integrations',
      },
    ],
  },
];

/**
 * Checks if a user possesses a required permission.
 */
export function hasPermission(userPermissions = [], requiredPermission) {
  if (!requiredPermission) return true;
  if (userPermissions.includes('*') || userPermissions.includes('admin.all')) return true;
  return userPermissions.includes(requiredPermission);
}

/**
 * Filters navigation architecture based on authorized permissions.
 */
export function getAuthorizedNavigation(userPermissions = []) {
  return navigationSections
    .map((section) => {
      const filteredItems = section.items.filter((item) =>
        hasPermission(userPermissions, item.permission)
      );
      return {
        ...section,
        items: filteredItems,
      };
    })
    .filter((section) => section.items.length > 0);
}
