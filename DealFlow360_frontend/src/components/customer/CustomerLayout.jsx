import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Building2, User as UserIcon } from 'lucide-react';
import { CustomerNavigation } from './CustomerNavigation';
import { NotificationBell } from '../../features/notifications/components/NotificationBell';
import { useCustomerAuth } from '../../features/customer-auth/hooks/useCustomerAuth';
import { useToast } from '../feedback/Toast';

/**
 * CustomerLayout Component
 * Application shell layout for the B2B Customer Portal.
 */
export const CustomerLayout = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { customerUser, logoutCustomer } = useCustomerAuth();

  const handleLogout = async () => {
    await logoutCustomer();
    toast.success('Signed out of Customer Portal.');
    navigate('/c-entry-x9283f/login', { replace: true });
  };

  const displayName = customerUser?.name || customerUser?.companyName || customerUser?.email || 'Client User';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Header */}
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#714B67] text-white flex items-center justify-center font-black text-sm shadow-md">
              D360
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-tight text-white flex items-center gap-2">
                DealFlow360
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-900/80 text-purple-200 border border-purple-700/60 uppercase">
                  Client Portal
                </span>
              </div>
              <p className="text-[10px] text-slate-400">B2B Procurement Workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell userType="CUSTOMER" />

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <UserIcon className="w-3.5 h-3.5 text-[#714B67]" />
              <span className="font-semibold text-slate-200">{displayName}</span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-rose-900/60 hover:border-rose-700 border border-slate-700 rounded-xl transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main App Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-start gap-6">
        {/* Customer Sidebar Navigation */}
        <aside className="w-full md:w-60 shrink-0 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Navigation
          </div>
          <CustomerNavigation />
        </aside>

        {/* Dynamic Route Content */}
        <main className="flex-1 w-full overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;
