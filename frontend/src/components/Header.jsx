import React, { useState } from "react";
import { Bell, Users, MessageCircle, Home as HomeIcon, Pencil } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/context/UserProfileContext";
import { useChat } from "@/context/ChatContext";
import { useNotifications } from "@/context/notificationContext";
import skillLogo from "../assets/skill.png";

function Badge({ count }) {
  if (count <= 0) return null;
  return (
    <span className="absolute top-0 right-0 mt-[-4px] mr-[-6px] bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 select-none">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default function Header() {
  const [openUser, setOpenUser] = useState(false);
  const { user, logout } = useAuth();
  const { profile } = useUserProfile();
  const navigate = useNavigate();

  const { unreadCount: messageUnread } = useChat();
  const { unreadCount: notificationUnread } = useNotifications();

  const handleLogout = () => {
    logout();
    setOpenUser(false);
    navigate("/login");
  };

  return (
    <header className="w-full px-8 py-4 flex items-center justify-between bg-[#403d41] shadow relative">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 flex-shrink-0">
        <img src={skillLogo} alt="SkillConnect Logo" className="h-10" />
        <span className="text-2xl font-bold text-white ">SkillConnect</span>
      </Link>

      {/* Navigation */}
      <nav className="flex items-center gap-8 flex-1 justify-center">
        <Link to="/" className="flex items-center gap-1 text-white hover:text-black-600 relative">
          <HomeIcon size={24} />
          <span className="hidden sm:inline text-base font-medium">Home</span>
        </Link>
        <button
          onClick={() => navigate("/joblist")}
          className="flex items-center gap-1 text-white  hover:text-white-600 font-medium"
          aria-label="Posts"
        >
          <Pencil size={20} />
          <span className="hidden sm:inline text-base font-medium">Posts</span>
        </button>
        <Link to="/connections" className="flex items-center gap-1 text-white  hover:text-white-600 relative">
          <Users size={24} />
          <span className="hidden sm:inline text-base font-medium">Connections</span>
        </Link>
        <button
          onClick={() => navigate("/messaging")}
          aria-label="Messages"
          className="flex items-center gap-1 text-white  hover:text-white-600 relative"
        >
          <MessageCircle size={24} />
          <span className="hidden sm:inline text-base font-medium">Messages</span>
          <Badge count={messageUnread} />
        </button>
        <Link to="/notifications" className="flex items-center gap-1 text-white  hover:text-white-600 relative">
          <Bell size={24} />
          <span className="hidden sm:inline text-base font-medium">Notifications</span>
          <Badge count={notificationUnread} />
        </Link>
      </nav>

      {/* User Dropdown */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => setOpenUser(!openUser)}
          className="flex items-center gap-2 text-white  font-medium hover:text-white-600 focus:outline-none"
          aria-haspopup="true"
          aria-expanded={openUser}
          aria-label="User menu"
        >
          <img
            src={profile?.profilePic || user?.profilePic || "/default-profile.png"}
            alt={profile?.name || user?.name || "User"}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="hidden sm:inline">Profile</span>
        </button>

        {openUser && (
          <div className="absolute right-0 mt-2 w-56 bg-[#403d41] rounded-lg shadow-lg z-20">
            <div className="flex items-center gap-3 px-4 py-3 border-b">
              <img
                src={profile?.profilePic || user?.profilePic || "/default-profile.png"}
                alt={profile?.name || user?.name || "User"}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{profile?.name || user?.name || "User"}</p>
                <Link
                  to="/profile"
                  className="text-sm text-white-600 hover:underline"
                  onClick={() => setOpenUser(false)}
                >
                  View Profile
                </Link>
              </div>
            </div>
            <ul className="flex flex-col">
              <li>
                <Link
                  to="/Applied"
                  className="block px-4 py-2 hover:underline"
                  onClick={() => setOpenUser(false)}
                >
                  My Jobs
                </Link>
              </li>
              <li>
                {/* <Link
                  to="/upload-resume"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setOpenUser(false)}
                >
                  Upload Resume
                </Link> */}
              </li>
              <li>
                <Link
                  to="/save"
                  className="block px-4 py-2 hover:underline"
                  onClick={() => setOpenUser(false)}
                >
                  Saved
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 hover:underline"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}

