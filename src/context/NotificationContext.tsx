import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { notifications as seedNotifications, type Notification } from "@/data/notifications";

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (n: Omit<Notification, "id" | "time" | "unread">) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem("daily_notifications_v1");
      return saved ? JSON.parse(saved) : seedNotifications;
    } catch {
      return seedNotifications;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("daily_notifications_v1", JSON.stringify(notifications));
    } catch {
      /* ignore */
    }
  }, [notifications]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const addNotification = (item: Omit<Notification, "id" | "time" | "unread">) => {
    const newNotif: Notification = {
      id: `n_${Date.now()}`,
      ...item,
      time: "Just now",
      unread: true,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead, addNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return ctx;
}
