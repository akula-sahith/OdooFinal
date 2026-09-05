import React from 'react';
import { Inbox } from 'lucide-react';
import { NotificationItem } from './NotificationItem';
import { Skeleton } from '../../../components/feedback/Skeleton/Skeleton';

/**
 * NotificationList Component
 * Renders list of notifications or empty state.
 */
export const NotificationList = ({
  notifications = [],
  loading = false,
  userType = 'CUSTOMER',
  onMarkAsRead,
  onCloseDropdown,
}) => {
  if (loading) {
    return (
      <div className="p-4 space-y-2">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center space-y-2">
        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
          <Inbox className="w-5 h-5" />
        </div>
        <p className="text-xs font-bold text-slate-900">No Notifications</p>
        <p className="text-[11px] text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
          Alerts for requirement requests, clarifications, and status changes will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-2 max-h-[380px] overflow-y-auto custom-scrollbar">
      {notifications.map((notif) => (
        <NotificationItem
          key={notif.id}
          notification={notif}
          userType={userType}
          onMarkAsRead={onMarkAsRead}
          onCloseDropdown={onCloseDropdown}
        />
      ))}
    </div>
  );
};

export default NotificationList;
