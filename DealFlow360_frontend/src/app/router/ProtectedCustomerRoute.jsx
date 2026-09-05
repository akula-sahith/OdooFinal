import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/auth/useAuth';

export const ProtectedCustomerRoute = ({ children }) => {
  const { isAuthenticated, isLoading, portal, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-slate-700 text-sm font-medium">
        Validating Customer Session...
      </div>
    );
  }

  if (!isAuthenticated || portal !== 'customer' || !user) {
    return <Navigate to="/c-entry-x9283f/login" state={{ from: location }} replace />;
  }

  // Account Status Security Enforcement
  if (user.status === 'INACTIVE' || user.status === 'LOCKED') {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl space-y-4">
          <h2 className="text-xl font-bold text-rose-400">Account Access Suspended</h2>
          <p className="text-xs text-slate-300">
            Your customer account status is currently inactive or locked. Please contact support or your account manager for assistance.
          </p>
          <a
            href="/c-entry-x9283f/login"
            className="inline-block px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition"
          >
            Return to Sign In
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedCustomerRoute;
