import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Inbox,
  UserCheck,
  MessageSquare,
  HelpCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { resolveNotificationRoute, NOTIFICATION_METADATA } from '../types/notificationTypes';

/**
 * NotificationItem Component
 * Single notification row displaying type icon, title, description, timestamp, unread dot, and route navigation.
 */
export const NotificationItem = ({ notification, userType = 'CUSTOMER', onMarkAsRead, onCloseDropdown }) => {
  const navigate = useNavigate();

  const getIcon = (type) => {
    switch (type) {
      case 'NEW_REQUEST':
        return Inbox;
      case 'REQUEST_ASSIGNED':
        return UserCheck;
      case 'NEW_MESSAGE':
      case 'CUSTOMER_REPLY':
        return MessageSquare;
      case 'CLARIFICATION_REQUESTED':
        return HelpCircle;
      case 'REQUIREMENT_CONFIRMED':
        return CheckCircle2;
      default:
        return Clock;
    }
  };

  const getVariantBg = (type) => {
    const meta = NOTIFICATION_METADATA[type] || {};
    switch (meta.variant) {
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'amber':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'purple':
        return 'bg-purple-50 text-[#714B67] border-purple-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    if (onCloseDropdown) {
      onCloseDropdown();
    }
    const targetRoute = resolveNotificationRoute(notification, userType);
    navigate(targetRoute);
  };

  const IconComp = getIcon(notification.type);

  return (
    <div
      onClick={handleClick}
      className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none text-left flex items-start gap-3 relative group ${
        notification.isRead
          ? 'bg-white border-slate-100 hover:bg-slate-50/80 text-slate-600'
          : 'bg-purple-50/20 border-purple-100/80 hover:bg-purple-50/40 text-slate-900 font-semibold'
      }`}
    >
      {/* Type Icon */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border mt-0.5 ${getVariantBg(notification.type)}`}>
        <IconComp className="w-4 h-4" />
      </div>

      {/* Main Body */}
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xs font-bold text-slate-900 truncate">
            {notification.title}
          </h4>
          <span className="text-[10px] font-mono text-slate-400 shrink-0">
            {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <p className="text-xs text-slate-600 font-normal line-clamp-2 mt-0.5 leading-relaxed">
          {notification.message}
        </p>

        {notification.requestId && (
          <span className="inline-block font-mono text-[10px] font-bold text-[#714B67] mt-1 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
            {notification.requestId}
          </span>
        )}
      </div>

      {/* Right Side: Unread Dot & Arrow */}
      <div className="flex items-center gap-1.5 shrink-0 self-center">
        {!notification.isRead && (
          <span className="w-2.5 h-2.5 rounded-full bg-[#714B67] shrink-0" title="Unread notification" />
        )}
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#714B67] transition-colors" />
      </div>
    </div>
  );
};

export default NotificationItem;
