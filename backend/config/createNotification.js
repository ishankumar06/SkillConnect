import Notification from '../models/Notification.js';

export const createNotification = async ({ userId, type, fromUserId, jobId, message,link }) => {
  try {
    const newNotification = new Notification({
      userId,
      type,
      fromUserId,
      jobId,
      message,
      link,
    });
    const savedNotification = await newNotification.save();
    return savedNotification;
  } catch (error) {
    console.error("Failed to create notification:", error);
    throw error; // Let the caller handle the error as well
  }
};

