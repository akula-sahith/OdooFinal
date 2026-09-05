import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  ShoppingCart,
  Package,
  Truck,
  MapPin,
  Receipt,
  CreditCard,
  ChevronRight,
  ActivitySquare,
} from 'lucide-react';

const STEP_ICONS = {
  QUOTATION: FileText,
  ACCEPTANCE: CheckCircle2,
  ORDER: ShoppingCart,
  FULFILLMENT: Package,
  SHIPMENT: Truck,
  DELIVERY: MapPin,
  INVOICE: Receipt,
  PAYMENT: CreditCard,
};

export const CommercialTimeline = ({ items = [], title = 'Commercial Lifecycle Progression' }) => {
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ChevronRight className="w-5 h-5 text-[#714B67]" />
            {title}
          </h3>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">End-To-End Traceability</span>
        </div>
        <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
            <ActivitySquare className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-sm font-semibold text-slate-600">No active commercial lifecycle</p>
          <p className="text-xs text-slate-400 max-w-sm font-medium">
            Commercial timeline milestones will appear here once orders, shipments, invoices and payments are linked to your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ChevronRight className="w-5 h-5 text-[#714B67]" />
          {title}
        </h3>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">End-To-End Traceability</span>
      </div>

      <div className="relative">
        <div className="overflow-x-auto pb-2">
          <div className="flex items-center min-w-max space-x-2 sm:space-x-4 py-2">
            {items.map((item, idx) => {
              const Icon = STEP_ICONS[item.step] || FileText;
              const isCompleted = item.status === 'COMPLETED';
              const isInProgress = item.status === 'IN_PROGRESS';

              return (
                <React.Fragment key={idx}>
                  <div
                    onClick={() => item.link && navigate(item.link)}
                    className={`flex flex-col items-center p-4 rounded-2xl border text-center transition-all cursor-pointer min-w-[130px] ${
                      isCompleted
                        ? 'bg-purple-50/60 border-purple-200 hover:border-[#714B67] hover:shadow-sm'
                        : isInProgress
                        ? 'bg-amber-50/60 border-amber-200 hover:border-amber-400'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center mb-2 font-bold text-xs ${
                        isCompleted
                          ? 'bg-[#714B67] text-white shadow-sm'
                          : isInProgress
                          ? 'bg-amber-500 text-white animate-pulse'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                      {item.title}
                    </span>
                    {item.ref && (
                      <span className="text-[10px] font-mono text-slate-500 mt-0.5 font-semibold">
                        {item.ref}
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-[#714B67] mt-1.5 hover:underline">
                      View Record →
                    </span>
                  </div>

                  {idx < items.length - 1 && (
                    <div className="h-0.5 w-5 sm:w-8 bg-slate-200 shrink-0 self-center"></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
