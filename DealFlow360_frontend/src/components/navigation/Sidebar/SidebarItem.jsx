import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export const SidebarItem = ({ item, collapsed = false, onClick }) => {
  const location = useLocation();
  const Icon = item.icon;

  const isActive =
    location.pathname === item.route ||
    (item.matchRoutes && item.matchRoutes.some((base) => location.pathname.startsWith(base)));

  return (
    <NavLink
      to={item.route}
      onClick={onClick}
      title={collapsed ? `${item.label}${item.description ? ` - ${item.description}` : ''}` : undefined}
      className={({ isActive: directActive }) => {
        const active = directActive || isActive;
        return `relative flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 group focus:outline-none focus:ring-2 focus:ring-[#714B67]/20 ${
          active
            ? 'bg-[#714B67] text-white shadow-sm font-bold'
            : 'text-slate-600 hover:bg-[#F7F2F5] hover:text-[#714B67]'
        } ${collapsed ? 'justify-center px-0' : ''}`;
      }}
    >
      {/* Active Indicator Bar */}
      {isActive && (
        <motion.div
          layoutId="sidebar-active-indicator"
          className="absolute left-0 top-1.5 bottom-1.5 w-1.5 bg-[#56384E] rounded-r-full"
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />
      )}

      <Icon
        className={`w-4.5 h-4.5 shrink-0 transition-transform group-hover:scale-110 ${
          isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#714B67]'
        }`}
      />

      {!collapsed && (
        <span className="truncate flex-1 font-medium">{item.label}</span>
      )}

      {!collapsed && item.badge && (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
            isActive ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'
          }`}
        >
          {item.badge}
        </span>
      )}
    </NavLink>
  );
};
