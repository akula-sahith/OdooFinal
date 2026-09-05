import { useState, useCallback } from 'react';
import { useAuthContext } from '../../../context/AuthContext';

/**
 * Custom Hook for managing B2B Customer Portal authentication & session state.
 */
export const useCustomerAuth = () => {
  const {
    user,
    portal,
    isAuthenticated,
    isLoading,
    login,
    signupCustomer,
    forgotPassword,
    resetPassword,
    logout,
  } = useAuthContext();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const isCustomerSession = isAuthenticated && portal === 'customer';

  const loginCustomer = useCallback(
    async (email, password) => {
      setSubmitting(true);
      setError(null);
      try {
        const loggedInUser = await login(email, password, 'customer');
        setSubmitting(false);
        return { success: true, user: loggedInUser };
      } catch (err) {
        setSubmitting(false);
        const message = err.message || 'Email or password is incorrect.';
        setError(message);
        return { success: false, error: message };
      }
    },
    [login]
  );

  const registerCustomer = useCallback(
    async (signupData) => {
      setSubmitting(true);
      setError(null);
      try {
        const payload = {
          firstName: signupData.firstName,
          lastName: signupData.lastName,
          email: signupData.email,
          phone: signupData.phone || '',
          companyName: signupData.companyName,
          password: signupData.password,
          portal: 'customer',
        };
        const createdUser = await signupCustomer(payload);
        setSubmitting(false);
        return { success: true, user: createdUser };
      } catch (err) {
        setSubmitting(false);
        const message = err.message || 'Failed to create customer account.';
        setError(message);
        return { success: false, error: message };
      }
    },
    [signupCustomer]
  );

  const requestReset = useCallback(
    async (email) => {
      setSubmitting(true);
      setError(null);
      try {
        await forgotPassword(email, 'customer');
        setSubmitting(false);
        return {
          success: true,
          message: 'If an account exists for this email, password reset instructions have been dispatched.',
        };
      } catch (err) {
        setSubmitting(false);
        return {
          success: true, // Privacy-safe response regardless of email existence
          message: 'If an account exists for this email, password reset instructions have been dispatched.',
        };
      }
    },
    [forgotPassword]
  );

  const performReset = useCallback(
    async (token, newPassword) => {
      setSubmitting(true);
      setError(null);
      try {
        await resetPassword(token, newPassword, 'customer');
        setSubmitting(false);
        return { success: true };
      } catch (err) {
        setSubmitting(false);
        const message = err.message || 'Failed to reset password. The link may have expired.';
        setError(message);
        return { success: false, error: message };
      }
    },
    [resetPassword]
  );

  const logoutCustomer = useCallback(async () => {
    setSubmitting(true);
    try {
      await logout();
    } finally {
      setSubmitting(false);
    }
  }, [logout]);

  return {
    customerUser: isCustomerSession ? user : null,
    isCustomerAuthenticated: isCustomerSession,
    isLoading,
    submitting,
    error,
    loginCustomer,
    registerCustomer,
    requestReset,
    performReset,
    logoutCustomer,
  };
};

export default useCustomerAuth;
