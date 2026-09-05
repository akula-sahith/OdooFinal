import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from '../../components/navigation/Sidebar/Sidebar';
import { Topbar } from '../../components/navigation/Topbar/Topbar';
import { MobileNav } from '../../components/navigation/MobileNav/MobileNav';
import { AccountStatusModal } from '../../components/ui/AccountStatusModal';
import { useAuth } from '../../hooks/auth/useAuth';

export const CompanyLayout = ({ children }) => {
  const { sessionState } = useAuth();
  const location = useLocation();

  // Desktop sidebar collapse state persisted in localStorage
  const [collapsed, setCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem('dealflow360_sidebar_collapsed');
      return saved ? JSON.parse(saved) : false;
    } catch (e) {
      return false;
    }
  });

  // Mobile navigation drawer open state
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Persist sidebar collapsed preference
  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('dealflow360_sidebar_collapsed', JSON.stringify(next));
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

  // Close mobile drawer automatically when route changes
  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-slate-900 flex flex-col md:flex-row relative overflow-x-hidden selection:bg-teal-500 selection:text-white">
      {/* Account Status Modal (Session Expired / Account Disabled warnings) */}
      <AccountStatusModal state={sessionState} />

      {/* Desktop Permanent Sidebar */}
      <div className="hidden md:block shrink-0 h-screen sticky top-0 z-40">
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={toggleCollapse}
        />
      </div>

      {/* Mobile Navigation Drawer */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      {/* Main Content Viewport Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Topbar */}
        <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} />

        {/* Dynamic Page Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
