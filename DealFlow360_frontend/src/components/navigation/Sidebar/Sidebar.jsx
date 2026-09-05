import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { getAuthorizedNavigation } from '../../../app/config/navigationConfig';
import { SidebarSection } from './SidebarSection';
import { usePermissions } from '../../../hooks/auth/usePermissions';
import { useAuth } from '../../../hooks/auth/useAuth';

export const Sidebar = ({ collapsed, onToggleCollapse, onItemClick }) => {
  const navigate = useNavigate();
  const { user, permissions, role } = usePermissions();
  const { logout } = useAuth();

  const navSections = getAuthorizedNavigation(permissions);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside
      className={`relative flex flex-col h-full bg-white border-r border-slate-200/90 transition-all duration-300 ease-in-out select-none ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="h-20 px-5 flex items-center justify-between border-b border-slate-200/80 shrink-0">
        <Link
          to="/company/dashboard"
          className="flex items-center gap-3 overflow-hidden focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-[#714B67] text-white flex items-center justify-center font-extrabold text-sm tracking-widest shrink-0 shadow-sm">
            DF
          </div>

          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-heading font-extrabold text-lg text-slate-900 tracking-tight leading-none">
                DealFlow<span className="text-[#714B67]">360</span>
              </span>
              <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mt-1 truncate">
                Sales Operations
              </span>
            </div>
          )}
        </Link>

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-xl text-slate-400 hover:text-[#714B67] hover:bg-slate-100 transition-colors cursor-pointer"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 custom-scrollbar">
        {navSections.map((section) => (
          <SidebarSection
            key={section.id}
            section={section}
            collapsed={collapsed}
            onItemClick={onItemClick}
          />
        ))}
      </div>

      {/* User Profile & Logout Bottom Bar */}
      <div className="p-4 border-t border-slate-200/80 bg-slate-50/50 shrink-0">
        {!collapsed ? (
          <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#714B67] text-white font-bold flex items-center justify-center shrink-0 text-xs border border-slate-200">
                {user?.fullName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || <UserIcon className="w-4 h-4" />}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {user?.fullName || 'Company Staff'}
                </span>
                <span className="text-[10px] font-semibold text-[#714B67] truncate">
                  {role || 'Authorized Personnel'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Sign out of company workspace"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2.5 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            title="Sign out"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};
