import React from 'react';
import { motion } from 'framer-motion';
import { KeyRound } from 'lucide-react';

export const SocialLoginButtons = ({ portal = 'customer', onSelectMethod }) => {
  return (
    <div className="space-y-2.5 pt-1">
      <div className="relative flex items-center justify-center my-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative px-3 bg-white text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Or continue with
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Google Workspace */}
        <motion.button
          whileHover={{ y: -1, scale: 1.008 }}
          whileTap={{ scale: 0.985 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          type="button"
          onClick={() => onSelectMethod?.('Google Workspace')}
          className="h-10 sm:h-11 flex items-center justify-center gap-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100/90 border border-slate-300/90 text-xs sm:text-sm font-semibold text-slate-700 transition-all duration-200 cursor-pointer shadow-xs"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.3 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.3C.6 9.3 0 11.6 0 14s.6 4.7 1.6 6.7l3.7-2.9c-.2-.7-.4-1.5-.4-2.3z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16C3.5 19.7 7.4 23 12 23z"
            />
          </svg>
          <span>Google Workspace</span>
        </motion.button>

        {/* Microsoft Entra ID */}
        <motion.button
          whileHover={{ y: -1, scale: 1.008 }}
          whileTap={{ scale: 0.985 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          type="button"
          onClick={() => onSelectMethod?.('Microsoft Entra ID')}
          className="h-10 sm:h-11 flex items-center justify-center gap-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100/90 border border-slate-300/90 text-xs sm:text-sm font-semibold text-slate-700 transition-all duration-200 cursor-pointer shadow-xs"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 23 23">
            <path fill="#f35325" d="M1 1h10v10H1z" />
            <path fill="#81bc06" d="M12 1h10v10H1z" />
            <path fill="#05a6f0" d="M1 12h10v10H1z" />
            <path fill="#ffba08" d="M12 12h10v10H1z" />
          </svg>
          <span>Microsoft SSO</span>
        </motion.button>
      </div>

      {/* SAML Enterprise Single Sign-On */}
      <motion.button
        whileHover={{ y: -1, scale: 1.008 }}
        whileTap={{ scale: 0.985 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        type="button"
        onClick={() => onSelectMethod?.('SAML Enterprise Single Sign-On')}
        className="w-full h-10 sm:h-11 flex items-center justify-center gap-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100/90 border border-slate-300/90 text-xs sm:text-sm font-semibold text-slate-700 transition-all duration-200 cursor-pointer shadow-xs"
      >
        <KeyRound className="w-4 h-4 text-[#714B67] shrink-0" />
        <span>SAML 2.0 / Okta Single Sign-On</span>
      </motion.button>
    </div>
  );
};
