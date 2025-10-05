import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom"; // Import this if inside a component or pass navigate as param

const NotificationContext = createContext();

const SOCKET_URL = "http://localhost:4000"; // Adjust for your backend URL

export const NotificationProvider = ({ token, children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!token) {
      console.log("No token provided, skipping notification setup");
      return;
    }

    console.log("Fetching notifications for token:", token);

    // Fetch existing notifications on mount
    fetch("/api/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched notifications from API:", data);
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.isRead).length);
      })
      .catch((err) => console.error("Error fetching notifications:", err));

    const socket = io(SOCKET_URL, {
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connect error:", err.message);
    });

    socket.on("newNotification", (notification) => {
      console.log("Received new notification from socket:", notification);
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((count) => count + 1);
    });

    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });

    return () => {
      console.log("Disconnecting socket");
      socket.disconnect();
    };
  }, [token]);

  const markAsRead = async (notificationId) => {
    try {
      console.log("Marking notification as read:", notificationId);
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
        console.log("Notification marked as read:", notificationId);
      } else {
        console.error("Failed to mark notification as read, status:", res.status);
      }
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  // Helper to handle notification click: marks read and navigates via link
  // Usage: call this inside a component with access to react-router's navigate()
  const handleNotificationClick = (notification, navigate) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, handleNotificationClick }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

