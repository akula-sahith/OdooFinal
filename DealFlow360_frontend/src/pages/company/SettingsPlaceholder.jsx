import React from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Building } from 'lucide-react';

export const SettingsPlaceholder = () => {
  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Company & Platform Settings"
        subtitle="Legal entity parameters, base currency defaults, tax registration IDs, and API webhook settings."
        badgeText="Platform Configuration"
        badgeVariant="plum"
      />

      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-6">
        <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Building className="w-4 h-4 text-[#714B67]" /> Corporate Entity Profile
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Company Legal Name</label>
            <input type="text" readOnly value="DEALFLOW360 Enterprise Solutions Inc." className="w-full h-10 px-3 font-medium text-slate-900 bg-slate-100/80 border border-slate-200 rounded-xl" />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Tax EIN Registration</label>
            <input type="text" readOnly value="EIN-88-4920491" className="w-full h-10 px-3 font-medium text-slate-900 bg-slate-100/80 border border-slate-200 rounded-xl" />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Base Platform Currency</label>
            <input type="text" readOnly value="USD ($) - United States Dollar" className="w-full h-10 px-3 font-medium text-slate-900 bg-slate-100/80 border border-slate-200 rounded-xl" />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Fiscal Year Start</label>
            <input type="text" readOnly value="January 1st (Calendar Year)" className="w-full h-10 px-3 font-medium text-slate-900 bg-slate-100/80 border border-slate-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
