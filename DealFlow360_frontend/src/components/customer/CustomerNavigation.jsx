import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Tag,
  ShoppingCart,
  Truck,
  Receipt,
  CreditCard,
  FileText,
  Bell,
  User,
} from 'lucide-react';

/**
 * Customer Navigation Links
 * Dedicated navigation items for B2B Client Portal (Phase 16).
 */
export const CUSTOMER_NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    route: '/customer/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'quotations',
    label: 'Quotations',
    route: '/customer/quotations',
    icon: Tag,
  },
  {
    id: 'orders',
    label: 'Orders',
    route: '/customer/orders',
    icon: ShoppingCart,
  },
  {
    id: 'shipments',
    label: 'Shipments',
    route: '/customer/shipments',
    icon: Truck,
  },
  {
    id: 'invoices',
    label: 'Invoices',
    route: '/customer/invoices',
    icon: Receipt,
  },
  {
    id: 'payments',
    label: 'Payments',
    route: '/customer/payments',
    icon: CreditCard,
  },
  {
    id: 'requests',
    label: 'My Requests',
    route: '/customer/requests',
    icon: FileText,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    route: '/customer/notifications',
    icon: Bell,
  },
  {
    id: 'profile',
    label: 'Profile',
    route: '/customer/profile',
    icon: User,
  },
];

export const CustomerNavigation = () => {
  return (
    <nav className="space-y-1">
      {CUSTOMER_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.id}
            to={item.route}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-purple-100/80 text-[#714B67] shadow-2xs font-bold border border-purple-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0 text-[#714B67]" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default CustomerNavigation;
