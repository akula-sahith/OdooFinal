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
  Percent,
  GitMerge,
  Key,
  Inbox,
  MessageSquare,
  BarChart3,
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
      {
        id: 'analytics',
        label: 'Analytics & Reports',
        route: '/company/analytics',
        icon: BarChart3,
        permission: 'analytics.view',
        matchRoutes: ['/company/analytics'],
        description: 'Role-based commercial reporting and executive analytics',
      },
    ],
  },
  {
    id: 'sales',
    title: 'SALES WORKSPACE',
    items: [
      {
        id: 'sales-dashboard',
        label: 'Sales Dashboard',
        route: '/company/sales/dashboard',
        icon: LayoutDashboard,
        permission: 'requests.view',
        matchRoutes: ['/company/sales/dashboard'],
        description: 'Salesperson workspace overview and assigned requirement pipeline',
      },
      {
        id: 'sales-requests',
        label: 'Requirement Requests',
        route: '/company/sales/requests',
        icon: Inbox,
        permission: 'requests.view',
        matchRoutes: ['/company/sales/requests'],
        badge: 'Requests',
        description: 'Customer B2B commercial requirement requests and review queue',
      },
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
      {
        id: 'discount-tiers',
        label: 'Discount Tiers',
        route: '/company/discount-tiers',
        icon: Percent,
        permission: 'discounts.view',
        matchRoutes: ['/company/discount-tiers'],
        description: 'Configure permitted discount percentage bounds and escalation tiers',
      },
    ],
  },
  {
    id: 'management',
    title: 'MANAGEMENT',
    items: [
      {
        id: 'admin-governance',
        label: 'Admin Governance',
        route: '/company/admin',
        icon: ShieldAlert,
        permission: 'roles.view',
        matchRoutes: ['/company/admin'],
        description: 'Centralized admin governance dashboard, approval rules, tax config, and settings',
      },
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
        id: 'permissions',
        label: 'Permission Catalogue',
        route: '/company/permissions',
        icon: Key,
        permission: 'permissions.view',
        matchRoutes: ['/company/permissions'],
        description: 'Master enterprise capability catalog and RBAC domain tokens',
      },
      {
        id: 'approval-chain',
        label: 'Approval Chain',
        route: '/company/approval-chain',
        icon: GitMerge,
        permission: 'approvals.view',
        matchRoutes: ['/company/approval-chain'],
        description: 'Configure discount escalation threshold sequence',
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
