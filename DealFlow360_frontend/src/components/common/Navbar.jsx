import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FileText, 
  Kanban, 
  CheckSquare, 
  Truck, 
  CreditCard, 
  Activity, 
  BarChart3, 
  Settings, 
  LogOut, 
  RefreshCw, 
  User, 
  ExternalLink,
  ShieldAlert,
  ShoppingBag
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isCustomer, isFinance, isSalesRep, isSalesManager, isAdmin, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleReload = () => {
    window.location.reload();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white text-slate-800 shadow-xs border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Logo */}
          <div className="flex items-center gap-3">
            <Link to="/workspace" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-sky-700 transition-colors">
                DF
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1">
                  DealFlow<span className="text-sky-600">360</span>
                </span>
                <span className="text-[10px] text-slate-500 block -mt-1 font-mono uppercase tracking-wider">
                  Self-Governing Engine
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          {!isCustomer && (
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <Link
                to="/quotations"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive('/quotations') || isActive('/workspace')
                    ? 'bg-sky-50 text-sky-700 border border-sky-200'
                    : 'text-slate-600 hover:text-sky-700 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-4 h-4 text-sky-600" />
                Quotations
              </Link>

              <Link
                to="/orders"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive('/orders')
                    ? 'bg-sky-50 text-sky-700 border border-sky-200'
                    : 'text-slate-600 hover:text-sky-700 hover:bg-slate-50'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-sky-600" />
                Orders
              </Link>

              <Link
                to="/pipeline"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive('/pipeline')
                    ? 'bg-sky-50 text-sky-700 border border-sky-200'
                    : 'text-slate-600 hover:text-sky-700 hover:bg-slate-50'
                }`}
              >
                <Kanban className="w-4 h-4 text-sky-600" />
                Pipeline
              </Link>

              {(isSalesManager || isFinance || isAdmin) && (
                <Link
                  to="/approvals"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive('/approvals')
                      ? 'bg-sky-50 text-sky-700 border border-sky-200'
                      : 'text-slate-600 hover:text-sky-700 hover:bg-slate-50'
                  }`}
                >
                  <CheckSquare className="w-4 h-4 text-sky-600" />
                  Approvals
                </Link>
              )}

              {(isFinance || isSalesManager || isAdmin) && (
                <Link
                  to="/fulfillment"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive('/fulfillment')
                      ? 'bg-sky-50 text-sky-700 border border-sky-200'
                      : 'text-slate-600 hover:text-sky-700 hover:bg-slate-50'
                  }`}
                >
                  <Truck className="w-4 h-4 text-sky-600" />
                  Fulfillment
                </Link>
              )}

              {(isFinance || isSalesManager || isAdmin) && (
                <Link
                  to="/billing"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive('/billing')
                      ? 'bg-sky-50 text-sky-700 border border-sky-200'
                      : 'text-slate-600 hover:text-sky-700 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-sky-600" />
                  Billing
                </Link>
              )}

              {(isSalesManager || isAdmin) && (
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive('/dashboard')
                      ? 'bg-sky-50 text-sky-700 border border-sky-200'
                      : 'text-slate-600 hover:text-sky-700 hover:bg-slate-50'
                  }`}
                >
                  <Activity className="w-4 h-4 text-sky-600" />
                  Deal Health
                </Link>
              )}

              {(isSalesManager || isFinance || isAdmin) && (
                <Link
                  to="/reporting"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive('/reporting')
                      ? 'bg-sky-50 text-sky-700 border border-sky-200'
                      : 'text-slate-600 hover:text-sky-700 hover:bg-slate-50'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-sky-600" />
                  Reports
                </Link>
              )}
            </nav>
          )}

          {/* Actions & User Info */}
          <div className="flex items-center gap-2">
            {!isCustomer && (
              <>
                <button
                  onClick={handleReload}
                  title="Reload Data"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Reload</span>
                </button>

                {(isSalesManager || isFinance || isAdmin) && (
                  <Link
                    to="/config"
                    title="Go to Admin Hub & Master Data Console"
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all shadow-xs ${
                      isActive('/config')
                        ? 'bg-sky-700 text-white'
                        : 'bg-sky-600 hover:bg-sky-700 text-white'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Admin Hub</span>
                  </Link>
                )}
              </>
            )}

            {/* Customer portal pill indicator */}
            {isCustomer && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-800 rounded-full text-xs font-semibold">
                <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                Customer Portal View
              </div>
            )}

            {/* User role badge & logout */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-bold text-slate-800">{user?.name || user?.email || 'User'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200 font-bold uppercase">
                  {role || 'USER'}
                </span>
              </div>

              <button
                onClick={handleLogout}
                title="Close Workspace / Logout"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
