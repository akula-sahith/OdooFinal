import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Building2, User, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/auth/useAuth';

export const CompanyWorkspacePreview = () => {
  const navigate = useNavigate();
  const { user, role, permissions, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/m-entry-z7829a/login');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 p-4 sm:p-8 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        <header className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#714B67] text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900">Internal Company Workspace</h2>
              <p className="text-xs text-[#714B67] font-mono font-bold">AUTHENTICATED STAFF SESSION</p>
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

        <main className="p-6 sm:p-8 rounded-3xl bg-white border border-purple-200 space-y-6 shadow-xl">
          <div className="pb-6 border-b border-slate-100">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
              Staff Member Workspace — {user?.name || 'Staff Member'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              Assigned Role: <strong className="text-[#714B67] font-mono font-bold">{role || 'Salesperson'}</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#714B67]" />
                Staff Member Name
              </span>
              <p className="text-sm sm:text-base font-bold text-slate-900">{user?.name || 'Rahul Kumar'}</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#714B67]" />
                Work Email Address
              </span>
              <p className="text-sm sm:text-base font-mono text-[#714B67] font-bold">{user?.email || 'rahul@dealflow360.com'}</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#714B67]" />
                Assigned Role (Read Only)
              </span>
              <p className="text-sm sm:text-base font-bold text-slate-900">{role || 'Salesperson'}</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
              Permissions Scope
            </span>
            <div className="flex flex-wrap gap-2">
              {permissions.map((perm, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-purple-50 border border-purple-200 text-[#714B67] font-mono text-xs font-bold"
                >
                  {perm}
                </span>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 text-xs sm:text-sm text-purple-950 space-y-2">
            <h4 className="font-extrabold flex items-center gap-2 text-[#714B67]">
              <CheckCircle2 className="w-4 h-4 text-[#714B67]" />
              Internal Company Authentication Ready
            </h4>
            <p className="text-slate-700 font-medium leading-relaxed">
              This screen verifies staff session state, invitation handling, read-only assigned roles, and route guards. Internal modules will hook directly into this context upon backend integration.
            </p>
          </div>
        </main>
      </div>

      <footer className="text-center text-xs text-slate-500 font-medium pt-8">
        Internal Staff Workspace Preview
      </footer>
    </div>
  );
};
