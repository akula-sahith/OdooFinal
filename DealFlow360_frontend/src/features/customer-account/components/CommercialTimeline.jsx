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

  const defaultTimeline = [
    { step: 'QUOTATION', title: 'Quotation Issued', ref: 'QT-2026-1004', status: 'COMPLETED', link: '/customer/quotations/QT-2026-1004' },
    { step: 'ACCEPTANCE', title: 'Acceptance Signed', ref: 'QT-2026-1004', status: 'COMPLETED', link: '/customer/quotations/QT-2026-1004' },
    { step: 'ORDER', title: 'Order Confirmed', ref: 'ORD-2026-8912', status: 'COMPLETED', link: '/customer/orders/ORD-2026-8912' },
    { step: 'FULFILLMENT', title: 'Fulfillment Ready', ref: 'FUL-2026-001', status: 'COMPLETED', link: '/customer/orders/ORD-2026-8912' },
    { step: 'SHIPMENT', title: 'Consignment Shipped', ref: 'SHP-2026-001', status: 'IN_PROGRESS', link: '/customer/shipments/SHP-2026-001' },
    { step: 'DELIVERY', title: 'Delivery Milestone', ref: 'SHP-2026-001', status: 'PENDING', link: '/customer/shipments/SHP-2026-001' },
    { step: 'INVOICE', title: 'Invoice Issued', ref: 'INV-2026-000001', status: 'COMPLETED', link: '/customer/invoices/INV-2026-000001' },
    { step: 'PAYMENT', title: 'Payment Remittance', ref: 'PAY-2026-000001', status: 'IN_PROGRESS', link: '/customer/payments/PAY-2026-000001' },
  ];

  const timelineData = items.length > 0 ? items : defaultTimeline;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-[#714B67]" />
          {title}
        </h3>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">End-To-End Traceability</span>
      </div>

      <div className="relative">
        <div className="overflow-x-auto pb-2">
          <div className="flex items-center min-w-max space-x-2 sm:space-x-4 py-2">
            {timelineData.map((item, idx) => {
              const Icon = STEP_ICONS[item.step] || FileText;
              const isCompleted = item.status === 'COMPLETED';
              const isInProgress = item.status === 'IN_PROGRESS';

              return (
                <React.Fragment key={idx}>
                  <div
                    onClick={() => item.link && navigate(item.link)}
                    className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all cursor-pointer min-w-[125px] ${
                      isCompleted
                        ? 'bg-purple-50/60 border-purple-200 hover:border-[#714B67] hover:shadow-xs'
                        : isInProgress
                        ? 'bg-amber-50/60 border-amber-200 hover:border-amber-400'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 font-bold text-xs ${
                        isCompleted
                          ? 'bg-[#714B67] text-white shadow-2xs'
                          : isInProgress
                          ? 'bg-amber-500 text-white animate-pulse'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-extrabold text-slate-900 leading-snug line-clamp-1">
                      {item.title}
                    </span>
                    {item.ref && (
                      <span className="text-[10px] font-mono text-slate-500 mt-0.5 font-semibold">
                        {item.ref}
                      </span>
                    )}
                    <span className="text-[9px] font-bold text-[#714B67] mt-1 hover:underline">
                      View Record →
                    </span>
                  </div>

                  {idx < timelineData.length - 1 && (
                    <div className="h-0.5 w-4 sm:w-6 bg-slate-200 shrink-0 self-center"></div>
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
