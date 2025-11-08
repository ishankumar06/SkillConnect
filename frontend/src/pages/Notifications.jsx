import React from "react";
import { useNotifications } from "../context/NotificationContext";
import bgImage from '../assets/bgImage.png';
import { useNavigate } from "react-router-dom";

// Example icon SVGs
const icons = {
  neutral: (
    <span className="flex items-center justify-center w-10 h-10 bg-gray-300 rounded-xl">
      <i className="fas fa-info text-xl text-white" />
    </span>
  ),
  info: (
    <span className="flex items-center justify-center w-10 h-10 bg-blue-200 rounded-xl">
      <i className="fas fa-bell text-xl text-blue-600" />
    </span>
  ),
  success: (
    <span className="flex items-center justify-center w-10 h-10 bg-green-200 rounded-xl">
      <i className="fas fa-check text-xl text-green-600" />
    </span>
  ),
  warning: (
    <span className="flex items-center justify-center w-10 h-10 bg-orange-200 rounded-xl">
      <i className="fas fa-exclamation-triangle text-xl text-orange-600" />
    </span>
  ),
  error: (
    <span className="flex items-center justify-center w-10 h-10 bg-red-200 rounded-xl">
      <i className="fas fa-ban text-xl text-red-600" />
    </span>
  ),
};

const TOAST_STYLES = {
  neutral: "bg-gray-50 border-gray-200 text-gray-700",
  info: "bg-blue-50 border-blue-100 text-blue-800",
  success: "bg-green-50 border-green-100 text-green-800",
  warning: "bg-orange-50 border-orange-100 text-orange-800",
  error: "bg-red-50 border-red-100 text-red-800",
};

const Notifications = () => {
  const { notifications, unreadCount, markAsRead, removeNotification } = useNotifications();
  const navigate = useNavigate();

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const getType = (note) => note.type || "neutral";

  const handleNotificationClick = (note) => {
    if (!note.isRead) markAsRead(note._id);
    if (note.link) navigate(note.link);
  };

  return (
    <div
      className="w-full h-screen flex flex-col p-4 gap-4 bg-white"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h2 className="text-xl font-semibold mb-2 flex items-center justify-between">
        Notifications
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-sm rounded px-2 py-0.5">
            {unreadCount} unread
          </span>
        )}
      </h2>

      <div className="space-y-5 mt-2">
        {notifications.length === 0 ? (
          <p className="text-gray-600">No notifications yet.</p>
        ) : (
          sortedNotifications.map((note) => {
            const type = getType(note);
            const unreadStyles = !note.isRead
              ? "border-l-8 border-blue-400 bg-blue-50/60 shadow-md"
              : "border-l-8 border-transparent opacity-80";
            return (
              <div
                key={note._id}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl border relative group
                  transition-all duration-200
                  ${TOAST_STYLES[type]} ${unreadStyles}`}
                style={{
                  boxShadow: !note.isRead
                    ? "0 6px 24px 0 #d6ebfb"
                    : "0 4px 16px 0 #f5f5fa",
                  filter: !note.isRead ? "brightness(1.05)" : "none",
                }}
                onClick={() => handleNotificationClick(note)}
              >
                {/* Icon */}
                {icons[type]}

                <div className="flex-1">
                  <div className={`font-bold text-base ${!note.isRead ? "text-blue-900" : ""}`}>
                    {note.title || note.message}
                  </div>
                  <div className={`text-sm ${!note.isRead ? "text-blue-700" : "text-gray-500/[0.8]"}`}>
                    {note.description}
                  </div>
                  <div className={`text-xs mt-1 ${!note.isRead ? "text-blue-400" : "text-gray-400"}`}>
                    {new Date(note.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* Dismiss/close button */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    removeNotification(note._id);
                  }}
                  className={`ml-4 p-2 rounded-xl hover:bg-gray-100 hover:scale-110 transition focus:outline-none`}
                  aria-label="Dismiss notification"
                >
                  <i className="fas fa-times text-lg text-gray-400" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;
