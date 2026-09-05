import React from 'react';
import { PageHeader } from '../../components/ui/PageHeader';

export const PricingPlaceholder = () => {
  const tiers = [
    { name: 'Enterprise Tier', discount: '15% Off List Price', minSpend: '$100,000 / year', paymentTerms: 'Net 60 Days', status: 'Active' },
    { name: 'SMB Preferred Tier', discount: '10% Off List Price', minSpend: '$25,000 / year', paymentTerms: 'Net 30 Days', status: 'Active' },
    { name: 'Standard B2B Tier', discount: '0% (Standard List Price)', minSpend: 'No Minimum', paymentTerms: 'Net 15 Days', status: 'Active' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Pricing & Contract Tiers"
        subtitle="Manage volume discount matrices, contract pricing tiers, and credit payment terms."
        badgeText="3 Pricing Tiers"
        badgeVariant="plum"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((t) => (
          <div key={t.name} className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">{t.name}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#F7F2F5] text-[#714B67] border border-[#714B67]/30">
                {t.status}
              </span>
            </div>

            <div className="p-3 bg-[#F7F2F5] border border-[#714B67]/20 rounded-xl space-y-1">
              <span className="text-[10px] font-extrabold text-[#714B67] uppercase tracking-wider">Default Discount</span>
              <p className="text-lg font-extrabold text-[#714B67]">{t.discount}</p>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="font-medium">Minimum Spend</span>
                <span className="font-bold text-slate-900">{t.minSpend}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="font-medium">Payment Terms</span>
                <span className="font-bold text-slate-900">{t.paymentTerms}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
