import React from 'react';
import { User, Shield, Info, Check, CheckCheck } from 'lucide-react';

/**
 * MessageBubble Component
 * Renders individual communication messages with sender distinction, timestamps, and status.
 */
export const MessageBubble = ({ message, currentUserType = 'CUSTOMER' }) => {
  const isSystem = message.senderType === 'SYSTEM';
  const isSelf = message.senderType === currentUserType;

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      const isToday = new Date().toDateString() === date.toDateString();
      if (isToday) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return date.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return String(dateStr);
    }
  };

  if (isSystem) {
    return (
      <div className="flex justify-center my-3 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-medium">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{message.content}</span>
          <span className="text-[10px] text-slate-400 font-mono ml-1">
            {formatTimestamp(message.createdAt)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col mb-4 ${isSelf ? 'items-end' : 'items-start'}`}>
      <div className="flex items-center gap-1.5 mb-1 px-1">
        <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
          {isSelf ? (
            <>
              <User className="w-3 h-3 text-[#714B67]" />
              You ({message.senderName || (currentUserType === 'SALESPERSON' ? 'Sales Engineer' : 'Customer')})
            </>
          ) : (
            <>
              <Shield className="w-3 h-3 text-purple-600" />
              {message.senderName || (message.senderType === 'CUSTOMER' ? 'Customer Account' : 'Sales Representative')}
            </>
          )}
        </span>
        <span className="text-[10px] text-slate-400">
          {formatTimestamp(message.createdAt)}
        </span>
      </div>

      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-2xs whitespace-pre-wrap ${
          isSelf
            ? 'bg-[#714B67] text-white rounded-tr-xs'
            : 'bg-white border border-slate-200 text-slate-900 rounded-tl-xs'
        }`}
      >
        {message.content}
      </div>

      {isSelf && (
        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 px-1">
          {message.readAt ? (
            <span className="flex items-center gap-0.5 text-emerald-600 font-medium">
              <CheckCheck className="w-3 h-3" /> Read
            </span>
          ) : (
            <span className="flex items-center gap-0.5">
              <Check className="w-3 h-3" /> Delivered
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
