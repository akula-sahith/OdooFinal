import React from 'react';
import { Lock, ShieldCheck } from 'lucide-react';

export const AuthFooter = () => {
  return (
    <footer className="w-full pt-4 sm:pt-6 border-t border-slate-200/80 space-y-2 sm:space-y-3 text-center text-xs text-slate-500">
      {/* Hidden on mobile phone for cleaner compact layout */}
      <div className="hidden sm:flex items-center justify-center gap-4 text-[11px] text-slate-600 font-medium">
        <div className="flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Security-Ready Frontend</span>
        </div>
        <span className="text-slate-300">•</span>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>SOC-2 & Enterprise TLS Standards</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs text-slate-600 font-medium">
        <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-slate-900 transition-colors">
          Privacy Policy
        </a>
        <span>•</span>
        <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-slate-900 transition-colors">
          Terms of Service
        </a>
        <span>•</span>
        <a href="mailto:support@dealflow360.com" className="hover:text-slate-900 transition-colors">
          Support
        </a>
      </div>

      <p className="text-[11px] text-slate-500">
        © {new Date().getFullYear()} DealFlow360 Platform. All rights reserved.
      </p>
    </footer>
  );
};
