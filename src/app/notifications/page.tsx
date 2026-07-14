"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, Check, CheckCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";

interface Notification {
  id: string;
  type: string;
  content: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNotifications = useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/notifications?page=${pageNum}&limit=20`);
      const data = await response.json();

      if (data.success) {
        if (pageNum === 1) {
          setNotifications(data.data.notifications);
        } else {
          setNotifications((prev) => [...prev, ...data.data.notifications]);
        }
        setUnreadCount(data.data.unreadCount);
        setTotalPages(data.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(1);
  }, [fetchNotifications]);

  const markAsRead = async (notificationIds: string[]) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds }),
      });

      setNotifications((prev) =>
        prev.map((n) =>
          notificationIds.includes(n.id) ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - notificationIds.length));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "WALLPAPER_NEW":
        return "\u{1F5BC}";
      case "REQUEST_DONE":
        return "\u2705";
      case "COMMENT_REPLY":
        return "\u{1F4AC}";
      default:
        return "\u{1F514}";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 hover:bg-[#222] rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">
                <span className="gold-text">Notifications</span>
              </h1>
              {unreadCount > 0 && (
                <p className="text-sm text-[#666] mt-1">
                  {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 text-sm text-[#D4A843] hover:bg-[#D4A843]/10 rounded-lg transition-colors"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </button>
          )}
        </div>

        {/* Notifications list */}
        {loading && notifications.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#333] border-t-[#D4A843] mx-auto" />
            <p className="text-[#666] mt-4">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={<Bell className="h-12 w-12" />}
            title="No notifications"
            description="You're all caught up! New notifications will appear here."
          />
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-xl border transition-all",
                  !notification.isRead
                    ? "bg-[#D4A843]/5 border-[#D4A843]/20"
                    : "bg-[#161616] border-[#2a2a2a]"
                )}
              >
                <span className="text-2xl">
                  {getNotificationIcon(notification.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm",
                      !notification.isRead ? "text-white" : "text-[#999]"
                    )}
                  >
                    {notification.content}
                  </p>
                  <p className="text-xs text-[#444] mt-2">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead([notification.id])}
                      className="p-2 hover:bg-[#222] rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <Check className="h-4 w-4 text-[#666]" />
                    </button>
                  )}
                  {notification.link && (
                    <Link
                      href={notification.link}
                      onClick={() => {
                        if (!notification.isRead) {
                          markAsRead([notification.id]);
                        }
                      }}
                      className="p-2 hover:bg-[#222] rounded-lg transition-colors text-[#D4A843] text-xs"
                    >
                      View
                    </Link>
                  )}
                </div>
              </div>
            ))}

            {/* Load more */}
            {page < totalPages && (
              <div className="text-center py-4">
                <button
                  onClick={() => {
                    setPage((p) => p + 1);
                    fetchNotifications(page + 1);
                  }}
                  className="text-sm text-[#D4A843] hover:text-[#F5E6C8]"
                >
                  Load more
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
