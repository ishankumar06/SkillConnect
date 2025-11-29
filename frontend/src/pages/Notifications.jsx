import React from "react";
import { useNotifications } from "../context/NotificationContext";
import bgImage from '../assets/bgImage.png';
import { useNavigate } from "react-router-dom";

// Updated icons for dark theme
const icons = {
  neutral: (
    <span className="flex items-center justify-center w-10 h-10 bg-[#4a474b] rounded-xl">
      <i className="fas fa-info text-xl text-gray-300" />
    </span>
  ),
  info: (
    <span className="flex items-center justify-center w-10 h-10 bg-blue-500/20 rounded-xl">
      <i className="fas fa-bell text-xl text-blue-300" />
    </span>
  ),
  success: (
    <span className="flex items-center justify-center w-10 h-10 bg-green-500/20 rounded-xl">
      <i className="fas fa-check text-xl text-green-300" />
    </span>
  ),
  warning: (
    <span className="flex items-center justify-center w-10 h-10 bg-orange-500/20 rounded-xl">
      <i className="fas fa-exclamation-triangle text-xl text-orange-300" />
    </span>
  ),
  error: (
    <span className="flex items-center justify-center w-10 h-10 bg-red-500/20 rounded-xl">
      <i className="fas fa-ban text-xl text-red-300" />
    </span>
  ),
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
      className="w-full min-h-screen flex flex-col gap-8 p-8 bg-white"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h2 className="text-2xl font-extrabold text-white mb-4 flex items-center justify-between">
        Notifications
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-sm rounded-full px-3 py-1 font-semibold">
            {unreadCount} unread
          </span>
        )}
      </h2>

      <div className="space-y-6">
        {notifications.length === 0 ? (
          <p className="text-gray-300 text-center text-lg py-12">No notifications yet.</p>
        ) : (
          sortedNotifications.map((note) => {
            const type = getType(note);
            const unreadStyles = !note.isRead
              ? "border-l-8 border-blue-400 bg-[#403d41]"
              : "border-l-8 border-transparent bg-[#403d41] opacity-80";
            return (
              <div
                key={note._id}
                className={`flex items-center gap-5 px-8 py-6 rounded-2xl relative group transition-all duration-200 ${unreadStyles}`}
                style={{
                  boxShadow: "0 6px 24px 0 #e4ebfd",
                }}
                onClick={() => handleNotificationClick(note)}
              >
                {/* Icon */}
                {icons[type]}

                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-lg text-white ${!note.isRead ? "text-blue-300" : ""}`}>
                    {note.title || note.message}
                  </div>
                  <div className={`text-sm text-gray-300 mt-1 ${!note.isRead ? "text-blue-200" : ""}`}>
                    {note.description}
                  </div>
                  <div className={`text-xs mt-1 text-gray-400 ${!note.isRead ? "text-blue-400" : ""}`}>
                    {new Date(note.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* Dismiss/close button */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    removeNotification(note._id);
                  }}
                  className="ml-4 p-3 rounded-xl hover:bg-[#4a474b] hover:scale-110 transition focus:outline-none text-gray-400 hover:text-white"
                  aria-label="Dismiss notification"
                >
                  <i className="fas fa-times text-lg" />
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
