import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { getAuthToken, getStoredUser, setAuthToken, setStoredUser } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(getAuthToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const currentUser = await authApi.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setStoredUser(currentUser);
          }
        } catch (err) {
          console.warn('Session check failed or expired, clearing auth token.');
          setAuthToken(null);
          setStoredUser(null);
          setUser(null);
          setToken('');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      if (res.user) {
        setUser(res.user);
        setStoredUser(res.user);
      }
      if (res.token) {
        setToken(res.token);
        setAuthToken(res.token);
      }
      setLoading(false);
      return res;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const customerSignup = async (signupData) => {
    setLoading(true);
    try {
      const res = await authApi.customerSignup(signupData);
      if (res.user) {
        setUser(res.user);
        setStoredUser(res.user);
      }
      if (res.token) {
        setToken(res.token);
        setAuthToken(res.token);
      }
      setLoading(false);
      return res;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    setLoading(true);
    await authApi.logout();
    setUser(null);
    setToken('');
    setLoading(false);
  };

  const role = user?.role ? user.role.toUpperCase() : '';

  const value = {
    user,
    token,
    role,
    loading,
    login,
    customerSignup,
    logout,
    isAuthenticated: !!user && !!token,
    isSalesRep: role === 'SALES_REP' || role === 'SALES_MANAGER' || role === 'ADMIN' || role === 'ADMINISTRATOR',
    isSalesManager: role === 'SALES_MANAGER' || role === 'ADMIN' || role === 'ADMINISTRATOR',
    isFinance: role === 'FINANCE' || role === 'ADMIN' || role === 'ADMINISTRATOR',
    isCustomer: role === 'CUSTOMER',
    isAdmin: role === 'ADMIN' || role === 'ADMINISTRATOR',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
