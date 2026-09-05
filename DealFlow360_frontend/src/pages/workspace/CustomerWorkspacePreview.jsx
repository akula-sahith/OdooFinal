import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, Building, User, Mail, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/auth/useAuth';

export const CustomerWorkspacePreview = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/c-entry-x9283f/login');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 p-4 sm:p-8 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        <header className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900">Customer Workspace</h2>
              <p className="text-xs text-blue-600 font-mono font-bold">AUTHENTICATED SESSION</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </header>

        <main className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-200 space-y-6 shadow-xl">
          <div className="pb-6 border-b border-slate-100">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
              Welcome back, {user?.name || 'Valued Client'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              You are securely signed in to your business portal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                <Building className="w-4 h-4 text-blue-600" />
                Company Name
              </span>
              <p className="text-sm sm:text-base font-bold text-slate-900">{user?.companyName || 'Acme Global Corp'}</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-blue-600" />
                Business Email
              </span>
              <p className="text-sm sm:text-base font-mono text-blue-700 font-bold">{user?.email || 'customer@acme.com'}</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-600" />
                Primary Contact
              </span>
              <p className="text-sm sm:text-base font-bold text-slate-900">{user?.name || 'Primary Contact'}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 text-xs sm:text-sm text-blue-950 space-y-2">
            <h4 className="font-extrabold flex items-center gap-2 text-blue-900">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Frontend Authentication Layer Ready
            </h4>
            <p className="text-slate-700 font-medium leading-relaxed">
              This workspace confirms authenticated state, session handling, and API readiness. Business modules will connect to this context upon backend integration.
            </p>
          </div>
        </main>
      </div>

      <footer className="text-center text-xs text-slate-500 font-medium pt-8">
        Customer Portal Workspace Preview
      </footer>
    </div>
  );
};
