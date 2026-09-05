import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, MessageSquare, Tag, User, ShieldCheck } from 'lucide-react';

/**
 * Customer Navigation Links
 * Dedicated navigation items for B2B Client Portal.
 */
export const CUSTOMER_NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    route: '/customer/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'requests',
    label: 'My Requests',
    route: '/customer/requests',
    icon: FileText,
  },
  {
    id: 'conversations',
    label: 'Conversations',
    route: '/customer/conversations',
    icon: MessageSquare,
  },
  {
    id: 'quotations',
    label: 'My Quotations',
    route: '/customer/quotations',
    icon: Tag,
  },
  {
    id: 'profile',
    label: 'Profile',
    route: '/customer/profile',
    icon: User,
  },
  {
    id: 'account',
    label: 'Account',
    route: '/customer/account',
    icon: ShieldCheck,
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
