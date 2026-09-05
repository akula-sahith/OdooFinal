import React from 'react';
import { ShieldCheck, Building2 } from 'lucide-react';

export const AuthHeader = ({ portal = 'unified', title, subtitle }) => {
  const isCustomer = portal === 'customer';

  const badgeLabel = isCustomer
    ? 'B2B Client Portal'
    : 'Unified Enterprise Portal';

  const defaultSubtitle = isCustomer
    ? 'Access your B2B account, manage quotations, and collaborate with your team.'
    : 'Centralized authentication portal for corporate personnel, sales management, and enterprise clients.';

  return (
    <header className="w-full text-left space-y-4 sm:space-y-5">
      {/* Universal Portal Security Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200/90 text-[11px] font-bold text-slate-600 shadow-2xs">
        {isCustomer ? (
          <Building2 className="w-3 h-3 text-blue-600" />
        ) : (
          <ShieldCheck className="w-3 h-3 text-[#714B67]" />
        )}
        <span>{badgeLabel}</span>
      </div>

      {/* Extra Large Handwritten Heading & Spaced Subtitle */}
      <div>
        <h1
          className={`inline-block font-handwritten font-bold text-5xl sm:text-6xl md:text-7xl lg:text-7xl tracking-wide py-1 leading-tight ${
            isCustomer
              ? 'text-blue-700 handwritten-underline handwritten-underline-blue'
              : 'text-[#714B67] handwritten-underline handwritten-underline-purple'
          }`}
        >
          {title || 'DealFlow360 Platform'}
        </h1>

        {/* Generous spacing between handwritten heading and subtitle text below */}
        <p className="mt-4 sm:mt-5 text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-md">
          {subtitle || defaultSubtitle}
        </p>
      </div>
    </header>
  );
};

export default AuthHeader;
