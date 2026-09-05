import React, { useState } from 'react';
import { Menu, Search, Command } from 'lucide-react';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs';
import { UserMenu } from './UserMenu';
import { NotificationBell } from '../../../features/notifications/components/NotificationBell';
import { useAuth } from '../../../hooks/auth/useAuth';

export const Topbar = ({ onOpenMobileNav }) => {
  const { role, switchRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchQuery('');
  };

  return (
    <header className="h-20 px-6 bg-white border-b border-slate-200/90 flex items-center justify-between gap-4 sticky top-0 z-30 shrink-0 select-none shadow-2xs">
      {/* Left: Mobile Nav Toggle & Breadcrumbs */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:text-[#714B67] hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#714B67]/20"
          aria-label="Open navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <Breadcrumbs />
        </div>
      </div>

      {/* Right: Search, Notifications & User Menu */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Global Search Entry Point */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search accounts, quotes, orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-72 h-10 pl-10 pr-12 text-xs font-medium text-slate-900 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-slate-300 rounded-xl transition-all outline-none"
          />
          <div className="absolute right-3 flex items-center gap-0.5 text-[10px] font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 pointer-events-none">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </form>

        <NotificationBell userType="SALESPERSON" />

        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

        <UserMenu />
      </div>
    </header>
  );
};
