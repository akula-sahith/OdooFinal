import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, MailX, ShieldAlert, UserX, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/auth/useAuth';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';

export const AccountStatusModal = ({ state, onClose }) => {
  const { logout, user } = useAuth();

  if (state !== 'SUSPENDED' && state !== 'DISABLED' && state !== 'UNVERIFIED' && state !== 'SESSION_EXPIRED') {
    return null;
  }

  const contentMap = {
    SUSPENDED: {
      icon: <ShieldAlert className="w-10 h-10 text-rose-600" />,
      title: 'Account Temporarily Unavailable',
      subtitle: 'Your account has been suspended',
      body: 'Access to your workspace has been temporarily restricted by system administrators. Please contact your organization administrator or security officer.',
      supportRef: 'Security Reference: ERR_ACCT_SUSPENDED_403',
      badgeColor: 'border-rose-200 bg-rose-50 text-rose-700',
    },
    DISABLED: {
      icon: <UserX className="w-10 h-10 text-slate-600" />,
      title: 'Account Disabled',
      subtitle: 'This account is no longer active',
      body: 'Your DealFlow360 user profile has been deactivated. Please reach out to system support.',
      supportRef: 'Security Reference: ERR_ACCT_DISABLED_403',
      badgeColor: 'border-slate-200 bg-slate-100 text-slate-700',
    },
    UNVERIFIED: {
      icon: <MailX className="w-10 h-10 text-amber-600" />,
      title: 'Email Verification Pending',
      subtitle: 'Action required before sign in',
      body: `We sent a verification link to your email address (${user?.email || 'your email'}). Please check your inbox and verify your email to continue.`,
      supportRef: 'Verification Status: PENDING_VERIFICATION',
      badgeColor: 'border-amber-200 bg-amber-50 text-amber-800',
    },
    SESSION_EXPIRED: {
      icon: <AlertOctagon className="w-10 h-10 text-sky-600" />,
      title: 'Session Expired',
      subtitle: 'Please sign in again',
      body: 'Your authentication session has expired. Please sign in again to continue.',
      supportRef: 'Session Status: EXPIRED_401',
      badgeColor: 'border-sky-200 bg-sky-50 text-sky-800',
    },
  };

  const current = contentMap[state];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xl text-center space-y-6 text-slate-900"
        >
          <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center bg-slate-50 border border-slate-200 shadow-inner">
            {current.icon}
          </div>

          <div className="space-y-2">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${current.badgeColor}`}>
              {current.subtitle}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">{current.title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{current.body}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-500 font-medium">
            {current.supportRef}
          </div>

          <div className="space-y-3 pt-2">
            <PrimaryButton
              portal={user?.portal || 'customer'}
              onClick={async () => {
                await logout();
                if (onClose) onClose();
              }}
              icon={<LogOut className="w-4 h-4" />}
            >
              Return to Login
            </PrimaryButton>

            {state === 'UNVERIFIED' && (
              <SecondaryButton
                portal={user?.portal || 'customer'}
                onClick={() => alert(`Verification link sent to ${user?.email || 'your email'}`)}
              >
                Resend Verification Email
              </SecondaryButton>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
