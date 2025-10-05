import Notification from "../models/Notification.js";
import { emitNotificationToUser } from "../server.js";

// Fetch notifications for logged-in user
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    console.log("Notifications sent to frontend:", notifications);  // Debug log

    res.json(notifications);
  } catch (error) {
    console.error("Failed to fetch notifications", error);
    res.status(500).json({ message: "Server error fetching notifications" });
  }
};

// Mark a notification as read and emit updated notification to user
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const notificationId = req.params.id;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found or access denied" });
    }

    console.log("Notification marked as read and emitted:", notification);  // Debug log

    // Emit updated notification to user including the link if any
    emitNotificationToUser(userId, notification);

    res.json(notification);
  } catch (error) {
    console.error("Failed to mark notification as read", error);
    res.status(500).json({ message: "Server error updating notification" });
  }
};

// Delete a notification and optionally emit info to user
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.userId;
    const notificationId = req.params.id;

    const notification = await Notification.findOneAndDelete({ _id: notificationId, userId: userId });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found or access denied" });
    }

    console.log("Notification deleted:", notification);  // Debug log

    // Optionally emit notification deletion event here if needed

    res.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Failed to delete notification", error);
    res.status(500).json({ message: "Server error deleting notification" });
  }
};
