import React from 'react';
import { Tag, ShoppingCart, Receipt, Truck, FileText, Clock } from 'lucide-react';

const CONTEXT_BADGES = {
  QUOTATION: { icon: Tag, color: 'bg-purple-100 text-[#714B67] border-purple-200' },
  ORDER: { icon: ShoppingCart, color: 'bg-blue-100 text-blue-800 border-blue-200' },
  INVOICE: { icon: Receipt, color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  SHIPMENT: { icon: Truck, color: 'bg-amber-100 text-amber-800 border-amber-200' },
  REQUEST: { icon: FileText, color: 'bg-slate-100 text-slate-800 border-slate-200' },
};

export const ConversationList = ({
  conversations = [],
  activeId = null,
  onSelectConversation,
  userType = 'CUSTOMER',
}) => {
  if (!conversations || conversations.length === 0) {
    return (
      <div className="p-8 text-center space-y-2 border border-dashed border-slate-200 rounded-xl bg-slate-50">
        <FileText className="w-8 h-8 text-slate-300 mx-auto" />
        <p className="text-xs font-bold text-slate-700">No Conversations Found</p>
        <p className="text-[11px] text-slate-400">Contextual message threads will appear here.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 overflow-y-auto max-h-[600px]">
      {conversations.map((conv) => {
        const isActive = conv.id === activeId || conv.contextId === activeId;
        const BadgeConfig = CONTEXT_BADGES[conv.contextType] || CONTEXT_BADGES.REQUEST;
        const Icon = BadgeConfig.icon;

        const unreadCount =
          userType === 'CUSTOMER' ? conv.unreadCountCustomer : conv.unreadCountSalesperson;

        return (
          <div
            key={conv.id}
            onClick={() => onSelectConversation(conv)}
            className={`p-3.5 flex items-start justify-between gap-3 transition-all cursor-pointer ${
              isActive
                ? 'bg-purple-50/80 border-l-4 border-[#714B67]'
                : unreadCount > 0
                ? 'bg-amber-50/40 hover:bg-slate-50'
                : 'hover:bg-slate-50'
            }`}
          >
            <div className="flex items-start gap-3 overflow-hidden">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${BadgeConfig.color}`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-900 font-mono truncate">
                    {conv.contextId}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md uppercase border ${BadgeConfig.color}`}
                  >
                    {conv.contextType}
                  </span>
                </div>

                <p className="text-[11px] font-semibold text-slate-700 mt-0.5 truncate">
                  {userType === 'CUSTOMER' ? conv.salespersonName || 'Sales Representative' : conv.customerName}
                </p>

                <p className="text-xs text-slate-500 mt-1 line-clamp-1 font-medium">
                  {conv.lastMessage || 'No messages yet'}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[10px] text-slate-400 font-medium">
                {conv.updatedAt ? new Date(conv.updatedAt).toLocaleDateString() : ''}
              </span>

              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold shadow-2xs">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
