import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Customer Pages
import { CustomerLogin } from '../../pages/auth/customer/CustomerLogin';
import { CustomerSignup } from '../../pages/auth/customer/CustomerSignup';
import { CustomerVerify } from '../../pages/auth/customer/CustomerVerify';
import { CustomerForgotPassword } from '../../pages/auth/customer/CustomerForgotPassword';
import { CustomerResetPassword } from '../../pages/auth/customer/CustomerResetPassword';
import { CustomerMFA } from '../../pages/auth/customer/CustomerMFA';

// Company Pages
import { CompanyLogin } from '../../pages/auth/company/CompanyLogin';
import { AcceptInvitation } from '../../pages/auth/company/AcceptInvitation';
import { CompanyForgotPassword } from '../../pages/auth/company/CompanyForgotPassword';
import { CompanyResetPassword } from '../../pages/auth/company/CompanyResetPassword';
import { CompanyMFA } from '../../pages/auth/company/CompanyMFA';

// Workspace Previews
import { CustomerWorkspacePreview } from '../../pages/workspace/CustomerWorkspacePreview';
import { CompanyWorkspacePreview } from '../../pages/workspace/CompanyWorkspacePreview';

// Guards
import { ProtectedCustomerRoute } from './ProtectedCustomerRoute';
import { ProtectedCompanyRoute } from './ProtectedCompanyRoute';

export const AppRouter = () => {
  return (
    <Routes>
      {/* ROOT ROUTE — DIRECT REDIRECT (NO HOMEPAGE) */}
      <Route path="/" element={<Navigate to="/c-entry-x9283f/login" replace />} />

      {/* OBFUSCATED CUSTOMER PORTAL ROUTES */}
      <Route path="/c-entry-x9283f">
        <Route path="login" element={<CustomerLogin />} />
        <Route path="signup" element={<CustomerSignup />} />
        <Route path="verify" element={<CustomerVerify />} />
        <Route path="forgot-password" element={<CustomerForgotPassword />} />
        <Route path="reset-password/:token" element={<CustomerResetPassword />} />
        <Route path="mfa" element={<CustomerMFA />} />
        <Route
          path="workspace"
          element={
            <ProtectedCustomerRoute>
              <CustomerWorkspacePreview />
            </ProtectedCustomerRoute>
          }
        />
        <Route path="*" element={<Navigate to="/c-entry-x9283f/login" replace />} />
      </Route>

      {/* OBFUSCATED COMPANY PORTAL ROUTES */}
      <Route path="/m-entry-z7829a">
        <Route path="login" element={<CompanyLogin />} />
        <Route path="accept-invite" element={<AcceptInvitation />} />
        <Route path="forgot-password" element={<CompanyForgotPassword />} />
        <Route path="reset-password/:token" element={<CompanyResetPassword />} />
        <Route path="mfa" element={<CompanyMFA />} />
        <Route
          path="workspace"
          element={
            <ProtectedCompanyRoute>
              <CompanyWorkspacePreview />
            </ProtectedCompanyRoute>
          }
        />
        <Route path="*" element={<Navigate to="/m-entry-z7829a/login" replace />} />
      </Route>

      {/* GLOBAL CATCH-ALL */}
      <Route path="*" element={<Navigate to="/c-entry-x9283f/login" replace />} />
    </Routes>
  );
};
