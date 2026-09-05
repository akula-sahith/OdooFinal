import React from 'react';
import { MessageSquare, User, Building, Clock } from 'lucide-react';

export const NegotiationThread = ({ messages = [], loading = false }) => {
  if (loading) {
    return (
      <div className="space-y-4 py-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-20 bg-slate-100 dark:bg-slate-700/40 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="text-center py-8 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
        <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          No negotiation messages exchange recorded for this quotation yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
      {messages.map((msg) => {
        const isCustomer = msg.senderType === 'CUSTOMER';

        return (
          <div
            key={msg.id}
            className={`p-4 rounded-xl border text-xs space-y-2 transition ${
              isCustomer
                ? 'bg-primary-50/50 dark:bg-primary-950/20 border-primary-100 dark:border-primary-900/40 ml-4 md:ml-12'
                : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 mr-4 md:mr-12'
            }`}
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
              <div className="flex items-center gap-2">
                {isCustomer ? (
                  <Building className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                ) : (
                  <User className="w-3.5 h-3.5 text-slate-500" />
                )}
                <span className="font-bold text-slate-900 dark:text-white">
                  {msg.senderName || (isCustomer ? 'Customer Account' : 'Sarah Jenkins')}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                  isCustomer
                    ? 'bg-primary-100 dark:bg-primary-900/60 text-primary-700 dark:text-primary-300'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {msg.senderRole || (isCustomer ? 'Customer' : 'Sales Executive')}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                {msg.quotationVersion && (
                  <span className="bg-slate-200/70 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400 font-mono">
                    v{msg.quotationVersion}
                  </span>
                )}
                <span>
                  {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
              {msg.message}
            </p>
          </div>
        );
      })}
    </div>
  );
};
