import React from 'react';
import { Bell, Check } from 'lucide-react';

export const CustomerNotificationList = ({ notifications = [], onMarkRead }) => {
  if (!notifications || notifications.length === 0) {
    return (
      <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center space-y-2">
        <Bell className="w-8 h-8 text-slate-300 mx-auto" />
        <p className="text-xs font-bold text-slate-700">No Customer Notifications</p>
        <p className="text-[11px] text-slate-400">Activity updates regarding your orders and invoices will appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden divide-y divide-slate-100">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`p-4 flex items-start justify-between gap-4 transition-colors ${
            n.isRead ? 'bg-white text-slate-600' : 'bg-purple-50/40 text-slate-900 font-medium'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
              n.isRead ? 'bg-slate-100 text-slate-500' : 'bg-[#714B67] text-white shadow-2xs'
            }`}>
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-slate-900">{n.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
              <span className="text-[10px] text-slate-400 font-medium mt-1 block">{n.createdAt}</span>
            </div>
          </div>

          {!n.isRead && (
            <button
              type="button"
              onClick={() => onMarkRead && onMarkRead(n.id)}
              className="px-2.5 py-1 text-[11px] font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg shrink-0 flex items-center gap-1 transition-all cursor-pointer"
            >
              <Check className="w-3 h-3 text-emerald-600" /> Mark Read
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
