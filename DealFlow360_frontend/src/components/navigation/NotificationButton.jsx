import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Inbox } from 'lucide-react';
import Badge from '../ui/Badge';
import EmptyState from '../feedback/EmptyState';
import Skeleton from '../feedback/Skeleton';

/**
 * Reusable Notification System UI (Phase 2.5)
 * Bell button + popover panel + empty / loading state ready for future websocket / API wiring.
 */
export const NotificationButton = ({
  unreadCount = 0,
  notifications = [], // [{ id: '1', title: 'System Update', message: 'Version 2.5 deployed', timestamp: '10m ago', read: false }]
  isLoading = false,
  onMarkAllAsRead,
  onNotificationClick,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#714B67] ${className}`}
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200/90 shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 font-heading">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <Badge variant="plum" size="sm">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            {onMarkAllAsRead && unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllAsRead}
                className="text-xs font-semibold text-[#714B67] hover:underline inline-flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {isLoading ? (
              <div className="p-4 space-y-3">
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="90%" />
                <Skeleton variant="text" width="40%" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8">
                <EmptyState
                  icon={Inbox}
                  title="No notifications"
                  description="You are all caught up! New alerts will appear here."
                />
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (onNotificationClick) onNotificationClick(item);
                  }}
                  className={`p-4 transition-colors cursor-pointer flex items-start gap-3 ${
                    item.read ? 'bg-white hover:bg-slate-50' : 'bg-[#F7F2F5]/40 hover:bg-[#F7F2F5]/70'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${item.read ? 'bg-transparent' : 'bg-[#714B67]'}`} />
                  <div className="grow space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-900">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {item.message}
                    </p>
                    {item.timestamp && (
                      <span className="text-[10px] text-slate-400 font-medium block pt-1">
                        {item.timestamp}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationButton;
