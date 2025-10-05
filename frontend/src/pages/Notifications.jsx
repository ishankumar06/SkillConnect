import React from "react";
import { useNotifications } from "../context/NotificationContext";
import bgImage from '../assets/bgImage.png';
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const navigate = useNavigate();

  // Sort notifications with newest first
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const handleNotificationClick = (note) => {
    if (!note.isRead) {
      markAsRead(note._id);
    }
    if (note.link) {
      navigate(note.link);
    }
  };

  return (
    <div
      className="w-full h-screen p-4 rounded-lg border border-gray-300 shadow-sm bg-white"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Header with unread count badge */}
      <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
        Notifications{" "}
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-sm rounded px-2 py-0.5">
            {unreadCount} unread
          </span>
        )}
      </h2>

      {notifications.length === 0 ? (
        <p className="text-gray-600">No notifications yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {sortedNotifications.map((note) => (
            <li
              key={note._id}
              className={`cursor-pointer p-3 transition-colors duration-200 rounded ${
                note.isRead
                  ? "bg-gray-50 hover:bg-gray-100" // Read notifications
                  : "bg-blue-50 hover:bg-blue-100" // Unread notifications
              }`}
              onClick={() => handleNotificationClick(note)}
              title={note.isRead ? "Read" : "Click to mark as read and open"}
            >
              <div
                className={`font-medium ${
                  note.isRead ? "text-gray-700" : "font-semibold text-gray-800"
                }`}
              >
                {note.message}
              </div>
              <small className="text-sm text-gray-500 mt-1">
                {new Date(note.createdAt).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
