import React from 'react';
import { CheckCheck } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Card } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationList } from '../components/NotificationList';

export const NotificationsPage = ({ userType = 'CUSTOMER' }) => {
  const { notifications, unreadCount, loading, error, markAsRead, markAllAsRead, refetch } = useNotifications(userType);

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Notifications Center"
        description="Stay updated with commercial requirement alerts, customer responses, and lifecycle updates."
        actions={
          unreadCount > 0 && (
            <Button
              variant="outline"
              leftIcon={CheckCheck}
              onClick={markAllAsRead}
            >
              Mark All as Read
            </Button>
          )
        }
      />

      <Card variant="default" padding="lg">
        <NotificationList
          notifications={notifications}
          loading={loading}
          userType={userType}
          onMarkAsRead={markAsRead}
        />
      </Card>
    </div>
  );
};

export default NotificationsPage;
