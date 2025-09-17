import { useState } from "react";
import { Bell, Users, MessageCircle, Home as HomeIcon, Pencil } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/context/UserProfileContext";
import skillLogo from "../assets/skill.png";

export default function Header() {
  const [openUser, setOpenUser] = useState(false);
  const { user, logout } = useAuth();
  const { profile } = useUserProfile();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpenUser(false);
    navigate("/login");
  };

  return (
   <header className="w-full px-8 py-4 flex items-center justify-between bg-white shadow">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 flex-shrink-0">
        <img src={skillLogo} alt="SkillConnect Logo" className="h-10" />
        <span className="text-2xl font-bold text-gray-900">SkillConnect</span>
      </Link>

      {/* Navigation */}
      <nav className="flex items-center gap-8 flex-1 justify-center">
        <Link to="/" className="flex items-center gap-1 text-gray-700 hover:text-blue-600">
          <HomeIcon size={24} />
          <span className="hidden sm:inline text-base font-medium">Home</span>
        </Link>
        <button
          onClick={() => navigate("/joblist")}
          className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium"
          aria-label="Posts"
        >
          <Pencil size={20} />
          <span className="hidden sm:inline text-base font-medium">Posts</span>
        </button>
        <Link to="/connections" className="flex items-center gap-1 text-gray-700 hover:text-blue-600">
          <Users size={24} />
          <span className="hidden sm:inline text-base font-medium">Connections</span>
        </Link>
        <button
          onClick={() => navigate("/messaging")}
          aria-label="Messages"
          className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
        >
          <MessageCircle size={24} />
          <span className="hidden sm:inline text-base font-medium">Messages</span>
        </button>
        <Link to="/notifications" className="flex items-center gap-1 text-gray-700 hover:text-blue-600">
          <Bell size={24} />
          <span className="hidden sm:inline text-base font-medium">Notifications</span>
        </Link>
      </nav>

      {/* User Dropdown */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => setOpenUser(!openUser)}
          className="flex items-center gap-2 text-gray-700 font-medium hover:text-blue-600 focus:outline-none"
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
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-20">
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
                  className="text-sm text-blue-600 hover:underline"
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
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setOpenUser(false)}
                >
                  My Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/upload-resume"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setOpenUser(false)}
                >
                  Upload Resume
                </Link>
              </li>

               <li>
                <Link
                  to="/save"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setOpenUser(false)}
                >
                  Saved
                </Link>
              </li>


              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
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
