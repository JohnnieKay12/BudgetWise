import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  CheckCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { notificationAPI } from '@/services/api';

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);

      const data =
        await notificationAPI.getAll();

      const notificationsData =
        Array.isArray(data) ? data : [];

      setNotifications(notificationsData);

      // CHECK IF THERE ARE UNREAD NOTIFICATIONS
      const hasUnread =
        notificationsData.some(
          (n) => !n.isRead
        );

      localStorage.setItem(
        'hasUnreadNotifications',
        hasUnread ? 'true' : 'false'
      );
    } catch (error) {
      console.error(
        'Failed to load notifications:',
        error
      );

      toast.error(
        'Failed to load notifications'
      );

      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (
    id: string
  ) => {
    try {
      await notificationAPI.markAsRead(
        id
      );

      const updatedNotifications =
        notifications.map((n) =>
          n._id === id
            ? {
                ...n,
                isRead: true,
              }
            : n
        );

      setNotifications(
        updatedNotifications
      );

      const hasUnread =
        updatedNotifications.some(
          (n) => !n.isRead
        );

      localStorage.setItem(
        'hasUnreadNotifications',
        hasUnread ? 'true' : 'false'
      );
    } catch (error) {
      console.error(
        'Failed to mark notification as read:',
        error
      );

      toast.error(
        'Failed to update notification'
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();

      const updatedNotifications =
        notifications.map((n) => ({
          ...n,
          isRead: true,
        }));

      setNotifications(
        updatedNotifications
      );

      localStorage.setItem(
        'hasUnreadNotifications',
        'false'
      );

      toast.success(
        'All notifications marked as read'
      );
    } catch (error) {
      console.error(
        'Failed to mark all notifications as read:',
        error
      );

      toast.error(
        'Failed to update notifications'
      );
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return (
          <CheckCircle2 className="w-5 h-5 text-brand-green" />
        );

      case 'warning':
        return (
          <AlertTriangle className="w-5 h-5 text-brand-yellow" />
        );

      case 'subscription':
        return (
          <Bell className="w-5 h-5 text-brand-purple" />
        );

      default:
        return (
          <Info className="w-5 h-5 text-brand-muted" />
        );
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-brand-green/10';

      case 'warning':
        return 'bg-brand-yellow/10';

      case 'subscription':
        return 'bg-brand-purple/10';

      default:
        return 'bg-gray-100';
    }
  };

  const unreadCount =
    notifications.filter(
      (n) => !n.isRead
    ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display text-brand-black">
            Notifications
          </h2>

          <p className="text-sm text-brand-muted">
            Stay updated on your
            financial activity
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium hover:bg-sage-50 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="glass-card p-10 text-center">
          <div className="w-10 h-10 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin mx-auto mb-4" />

          <p className="text-sm text-brand-muted">
            Loading notifications...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading &&
        notifications.length === 0 && (
          <div className="glass-card p-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-sage-50 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-brand-muted" />
            </div>

            <h3 className="text-lg font-display font-medium text-brand-black mb-2">
              No notifications yet
            </h3>

            <p className="text-sm text-brand-muted max-w-sm mx-auto">
              When you receive budget
              alerts, reminders,
              savings updates, or
              insights, they will
              appear here.
            </p>
          </div>
        )}

      {/* Notifications List */}
      {!loading &&
        notifications.length > 0 && (
          <div className="space-y-3">
            {notifications.map(
              (
                notification,
                index
              ) => (
                <motion.div
                  key={
                    notification._id
                  }
                  initial={{
                    opacity: 0,
                    x: -20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay:
                      index * 0.05,
                  }}
                  onClick={() =>
                    !notification.isRead &&
                    markAsRead(
                      notification._id
                    )
                  }
                  className={`glass-card p-5 flex items-start gap-4 cursor-pointer transition-all ${
                    !notification.isRead
                      ? 'border-brand-green/20 bg-brand-green/5'
                      : ''
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getBgColor(
                      notification.type
                    )}`}
                  >
                    {getIcon(
                      notification.type
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-sm font-medium ${
                          !notification.isRead
                            ? 'text-brand-black'
                            : 'text-brand-muted'
                        }`}
                      >
                        {
                          notification.title
                        }
                      </p>

                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-brand-green rounded-full flex-shrink-0" />
                      )}
                    </div>

                    <p
                      className={`text-sm mt-1 ${
                        !notification.isRead
                          ? 'text-brand-body'
                          : 'text-brand-muted'
                      }`}
                    >
                      {
                        notification.message
                      }
                    </p>

                    <p className="text-xs text-brand-muted mt-2">
                      {new Date(
                        notification.createdAt
                      ).toLocaleDateString(
                        'en-NG',
                        {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute:
                            '2-digit',
                        }
                      )}
                    </p>
                  </div>
                </motion.div>
              )
            )}
          </div>
        )}
    </div>
  );
}