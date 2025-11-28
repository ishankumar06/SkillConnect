import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";

const NotificationContext = createContext();

const SOCKET_URL = "http://localhost:4000";

export const NotificationProvider = ({ token, children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // ✅ ADDED: fetchNotifications for DataPreloader
  const fetchNotifications = useCallback(async () => {
    if (!token) {
      console.log("No token, skipping fetchNotifications");
      return;
    }
    
    try {
      console.log("🔄 Fetching notifications...");
      const res = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("✅ Fetched notifications:", data);
      
      setNotifications(Array.isArray(data) ? data : []);
      setUnreadCount((Array.isArray(data) ? data.filter(n => !n.isRead).length : 0));
    } catch (err) {
      console.error("❌ Error fetching notifications:", err);
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      console.log("No token provided, skipping notification setup");
      return;
    }

    console.log("🔥 Setting up notifications with token:", token.substring(0, 20) + "...");

    // Auto-fetch on mount
    fetchNotifications();

    // Socket setup
    const socket = io(SOCKET_URL, { auth: { token } });

    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("🔴 Socket connect error:", err.message);
    });

    socket.on("newNotification", (notification) => {
      console.log("🔔 New notification:", notification);
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((count) => count + 1);
    });

    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });

    return () => {
      console.log("🔌 Disconnecting socket");
      socket.disconnect();
    };
  }, [token, fetchNotifications]);

  const markAsRead = async (notificationId) => {
    if (!token) return;
    
    try {
      console.log("📖 Marking notification as read:", notificationId);
      const res = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notificationId ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount((count) => Math.max(count - 1, 0));
        console.log("✅ Notification marked as read");
      } else {
        console.error("❌ Failed to mark as read:", res.status);
      }
    } catch (error) {
      console.error("❌ Mark as read error:", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{ 
        notifications, 
        unreadCount, 
        markAsRead,
        fetchNotifications,  // ✅ NEW for DataPreloader
        refetch: fetchNotifications  // ✅ Alias for easy use
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
