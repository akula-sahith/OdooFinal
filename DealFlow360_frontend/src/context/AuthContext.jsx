import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { authService } from '../services/auth/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sessionState, setSessionState] = useState('INITIALIZING');
  const [error, setError] = useState(null);
  const [mfaPending, setMfaPending] = useState(null);

  // Restore session on mount
  useEffect(() => {
    let isMounted = true;
    async function initSession() {
      try {
        const session = await authService.getCurrentUser();
        if (isMounted && session?.user) {
          setUser(session.user);
          setSessionState('AUTHENTICATED');
        } else if (isMounted) {
          setSessionState('UNAUTHENTICATED');
        }
      } catch (err) {
        if (isMounted) {
          setSessionState('UNAUTHENTICATED');
        }
      }
    }
    initSession();
    return () => { isMounted = false; };
  }, []);

  // Compute permissions based on role supplied by backend authority
  const permissions = useMemo(() => {
    if (!user) return [];
    if (user.portal === 'customer') return ['customer.dashboard', 'customer.orders', 'customer.quotes'];
    
    // Role-based permissions matching DealFlow360 enterprise security model
    if (user.role === 'Admin') {
      return [
        'dashboard.view',
        'customers.view', 'customers.manage',
        'users.view', 'users.manage',
        'roles.view', 'roles.manage',
        'products.view', 'products.manage',
        'pricing.view', 'pricing.manage',
        'quotations.view', 'quotations.manage',
        'approvals.view', 'approvals.manage',
        'orders.view', 'orders.manage',
        'security.view', 'audit_logs.view',
        'settings.view', 'settings.manage'
      ];
    }

    if (user.role === 'Sales Manager') {
      return [
        'dashboard.view',
        'customers.view', 'customers.manage',
        'users.view',
        'products.view',
        'pricing.view',
        'quotations.view', 'quotations.manage',
        'approvals.view',
        'orders.view', 'orders.manage'
      ];
    }

    if (user.role === 'Salesperson') {
      return [
        'dashboard.view',
        'customers.view',
        'products.view',
        'quotations.view',
        'orders.view'
      ];
    }

    return ['dashboard.view', 'customers.view'];
  }, [user]);

  // Login action
  const login = async (email, password, portal) => {
    setError(null);
    try {
      const session = await authService.login(email, password, portal);

      if (session.requiresMfa) {
        setMfaPending({ mfaToken: session.mfaToken, portal });
        setSessionState('MFA_REQUIRED');
        return false;
      }

      if (session.user) {
        setUser(session.user);
        setSessionState('AUTHENTICATED');
        return true;
      }
      return false;
    } catch (err) {
      setError(err);
      if (err.code === 'ACCOUNT_SUSPENDED') setSessionState('SUSPENDED');
      if (err.code === 'ACCOUNT_DISABLED') setSessionState('DISABLED');
      if (err.code === 'ACCOUNT_UNVERIFIED') setSessionState('UNVERIFIED');
      throw err;
    }
  };

  // MFA verification action
  const verifyMFA = async (code) => {
    if (!mfaPending) throw new Error('No MFA verification session in progress.');
    setError(null);
    try {
      const session = await authService.verifyMFA(mfaPending.mfaToken, code, mfaPending.portal);
      if (session.user) {
        setUser(session.user);
        setSessionState('AUTHENTICATED');
        setMfaPending(null);
        return true;
      }
      return false;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // Signup Customer
  const signupCustomer = async (data) => {
    setError(null);
    try {
      return await authService.signupCustomer(data);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // Accept Staff Invitation
  const acceptInvitation = async (token, password) => {
    setError(null);
    try {
      const session = await authService.acceptInvitation(token, password);
      if (session.user) {
        setUser(session.user);
        setSessionState('AUTHENTICATED');
        return true;
      }
      return false;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // Forgot password
  const forgotPassword = async (email, portal) => {
    setError(null);
    try {
      return await authService.forgotPassword(email, portal);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // Reset password
  const resetPassword = async (token, password, portal) => {
    setError(null);
    try {
      return await authService.resetPassword(token, password, portal);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // Logout action
  const logout = async () => {
    await authService.logout();
    setUser(null);
    setSessionState('UNAUTHENTICATED');
    setMfaPending(null);
    setError(null);
  };

  const clearError = () => setError(null);

  // Role switcher helper for testing permission levels
  const switchRole = (targetRole) => {
    let email = 'admin@dealflow360.com';
    let fullName = 'System Administrator';
    if (targetRole === 'Sales Manager') {
      email = 'manager@dealflow360.com';
      fullName = 'Sarah Jenkins';
    } else if (targetRole === 'Salesperson') {
      email = 'rahul@dealflow360.com';
      fullName = 'Rahul Kumar';
    }
    const updatedUser = {
      ...(user || {}),
      id: user?.id || 'usr_staff_01',
      email,
      fullName,
      role: targetRole,
      portal: 'company',
    };
    setUser(updatedUser);
    try {
      localStorage.setItem('dealflow360_user', JSON.stringify(updatedUser));
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        portal: user?.portal || null,
        permissions,
        isAuthenticated: sessionState === 'AUTHENTICATED',
        isLoading: sessionState === 'INITIALIZING',
        sessionState,
        error,
        login,
        verifyMFA,
        signupCustomer,
        acceptInvitation,
        forgotPassword,
        resetPassword,
        logout,
        switchRole,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within an AuthProvider');
  return context;
};
