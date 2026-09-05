import React from 'react';
import { Shield, Building2 } from 'lucide-react';

export const AuthHeader = ({ portal, title, subtitle }) => {
  const isCustomer = portal === 'customer';

  const defaultSubtitle = isCustomer
    ? 'Access your B2B account, manage quotations, and collaborate with your team.'
    : 'Authorized company personnel portal for operations and client management.';

  return (
    <header className="w-full text-left space-y-2 sm:space-y-3">
      {/* Brand / Security Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200/80 text-xs font-semibold text-slate-700">
        {isCustomer ? (
          <Building2 className="w-3.5 h-3.5 text-blue-600" />
        ) : (
          <Shield className="w-3.5 h-3.5 text-[#714B67]" />
        )}
        <span>{isCustomer ? 'B2B Client Portal' : 'Internal Staff Entry'}</span>
      </div>

      {/* PROMINENT HANDWRITTEN TITLE — INCREASED SIZING */}
      <div>
        <h1
          className={`inline-block font-handwritten font-bold text-3xl sm:text-4xl md:text-5xl lg:text-5xl tracking-wide py-0.5 leading-tight ${
            isCustomer
              ? 'text-blue-700 handwritten-underline handwritten-underline-blue'
              : 'text-[#714B67] handwritten-underline handwritten-underline-purple'
          }`}
        >
          {title || (isCustomer ? 'Customer Portal Access' : 'Internal Company Portal')}
        </h1>

        {/* Hidden on mobile phones for cleaner layout alignment */}
        <p className="hidden sm:block text-sm sm:text-base text-slate-600 font-medium leading-relaxed mt-2.5">
          {subtitle || defaultSubtitle}
        </p>
      </div>
    </header>
  );
};

