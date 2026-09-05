import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ShieldCheck, Lock, Sparkles } from 'lucide-react';
import { AuthHeader } from '../components/auth/AuthHeader';
import { AuthFooter } from '../components/auth/AuthFooter';
import { AccountStatusModal } from '../components/ui/AccountStatusModal';
import { useAuth } from '../hooks/auth/useAuth';

export const AuthLayout = ({ children, portal = 'unified', title, subtitle }) => {
  const { sessionState } = useAuth();
  const location = useLocation();
  const isCustomer = portal === 'customer';

  const bgGradientClass = isCustomer
    ? 'bg-[linear-gradient(145deg,#eff6ff_0%,#f8fafc_45%,#ffffff_100%)]'
    : 'bg-[linear-gradient(145deg,#f7f3f6_0%,#f8fafc_45%,#ffffff_100%)]';

  return (
    <div className={`min-h-screen w-full ${bgGradientClass} text-slate-900 flex flex-col justify-start items-center relative overflow-x-hidden selection:bg-purple-600 selection:text-white pt-10 sm:pt-16 md:pt-20 lg:pt-24 pb-12 px-4 sm:px-6 md:px-8`}>
      {/* Account Status Modal */}
      <AccountStatusModal state={sessionState} />

      {/* MAIN CONTAINER — BALANCED SPLIT LAYOUT */}
      <div className="w-full max-w-6xl z-10 my-0">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-start"
        >
          {/* PART 1: LEFT COLUMN — Header & Feature Context */}
          <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-between space-y-6 sm:space-y-8">
            <div className="space-y-6">
              <AuthHeader portal={portal} title={title} subtitle={subtitle} />

              {/* Enterprise Security Standards */}
              <div className="hidden sm:block space-y-2.5 pt-4 border-t border-slate-200/80">
                <div className="flex items-start gap-2.5 text-xs text-slate-500 font-medium">
                  <ShieldCheck className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isCustomer ? 'text-blue-600' : 'text-[#714B67]'}`} />
                  <span>End-to-end encrypted session & SSO support</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-500 font-medium">
                  <Lock className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isCustomer ? 'text-blue-600' : 'text-[#714B67]'}`} />
                  <span>Strict zero-trust authentication boundary</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-500 font-medium">
                  <Sparkles className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isCustomer ? 'text-blue-600' : 'text-[#714B67]'}`} />
                  <span>Role-based workspace routing (Admin, Manager, Sales, Customer)</span>
                </div>
              </div>
            </div>
          </div>

          {/* PART 2: RIGHT COLUMN — Auth Form Card */}
          <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="w-full bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-12 sm:mt-16">
          <AuthFooter />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
