import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ShieldCheck, Lock } from 'lucide-react';
import { AuthHeader } from '../components/auth/AuthHeader';
import { AuthFooter } from '../components/auth/AuthFooter';
import { AccountStatusModal } from '../components/ui/AccountStatusModal';
import { useAuth } from '../hooks/auth/useAuth';

export const AuthLayout = ({ children, portal = 'customer', title, subtitle }) => {
  const { sessionState } = useAuth();
  const location = useLocation();
  const isCustomer = portal === 'customer';

  const bgGradientClass = isCustomer
    ? 'bg-[linear-gradient(145deg,#eff6ff_0%,#f8fafc_45%,#ffffff_100%)]'
    : 'bg-[linear-gradient(145deg,#f7f3f6_0%,#f8fafc_45%,#ffffff_100%)]';

  return (
    <div className={`min-h-screen w-full ${bgGradientClass} text-slate-900 flex flex-col justify-start items-center relative overflow-x-hidden selection:bg-teal-500 selection:text-white pt-5 sm:pt-14 md:pt-20 lg:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 md:px-8`}>
      {/* Account Status Modal */}
      <AccountStatusModal state={sessionState} />

      {/* MAIN CONTAINER — WIDE SPLIT LAYOUT WITH SPACIOUS MIDDLE GAP */}
      <div className="w-full max-w-5xl z-10 my-0">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          className="w-full grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-10 md:gap-16 lg:gap-24 items-start"
        >
          {/* PART 1: LEFT COLUMN — Header, Title, Description & Portal Context */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-3 sm:space-y-6">
            <div className="space-y-3 sm:space-y-6">
              <AuthHeader portal={portal} title={title} subtitle={subtitle} />

              {/* Security Standards Info — Hidden on Mobile Phone */}
              <div className="hidden sm:block space-y-3 pt-2">
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 font-medium">
                  <ShieldCheck className={`w-4 h-4 shrink-0 mt-0.5 ${isCustomer ? 'text-blue-600' : 'text-[#714B67]'}`} />
                  <span>End-to-end encrypted session & SSO support</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 font-medium">
                  <Lock className={`w-4 h-4 shrink-0 mt-0.5 ${isCustomer ? 'text-blue-600' : 'text-[#714B67]'}`} />
                  <span>Strict zero-trust authentication boundary</span>
                </div>
              </div>
            </div>
          </div>

          {/* PART 2: RIGHT COLUMN — Form Fields, Inputs & Actions (Moved Aside with Wide Middle Gap) */}
          <div className="md:col-span-7 lg:col-span-6 lg:col-start-7 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="w-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-6 sm:mt-12">
          <AuthFooter />
        </div>
      </div>
    </div>
  );
};

