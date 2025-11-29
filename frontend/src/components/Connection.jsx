import React, { useState } from "react";
import { useUserProfile } from "../context/UserProfileContext";
import { useUsers } from "../context/UsersContext";
import bgImage from '../assets/bgImage.png';
import { Link } from "react-router-dom";

function ConnectionItem({ userId, name, title, avatarUrl, onUnfollow }) {
  const [showConfirm, setShowConfirm] = useState(false);

  // Confirm dialog handlers
  const handleUnfollowClick = () => setShowConfirm(true);
  const handleCancel = () => setShowConfirm(false);
  const handleConfirm = () => {
    setShowConfirm(false);
    onUnfollow();
  };

  return (
    <div className="flex justify-between items-center bg-[#403d41] p-6 rounded-2xl border-l-8 border-black-300 mb-4 w-full relative transition-all duration-200 hover:shadow-lg" style={{ boxShadow: "0 6px 24px 0 #e4ebfd" }}>
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Link
          to={`/profile/${userId}`}
          className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${name} avatar`}
              className="w-14 h-14 rounded-full object-cover border-2 border-green-400 flex-shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center text-green-300 font-bold text-lg flex-shrink-0 border-2 border-green-400">
              {name?.charAt(0) || "?"}
            </div>
          )}
          <div className="min-w-0">
            <h4 className="font-semibold text-white text-lg truncate">{name}</h4>
            <p className="text-gray-300 text-sm truncate">{title}</p>
          </div>
        </Link>
      </div>

      <button
        onClick={handleUnfollowClick}
        className="ml-auto self-center text-sm text-white uppercase px-4 py-2 rounded-xl border-2 border-white 
          bg-[#252525] hover:bg-[#2a272a] cursor-pointer
          active:translate-x-[1px] active:translate-y-[1px]
          transition whitespace-nowrap max-w-full font-semibold"
      >
        Followed
      </button>

      {showConfirm && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-[#4a474b] rounded-xl p-4 z-10 border border-gray-600 backdrop-blur-sm" style={{ boxShadow: "0 6px 24px 0 #e4ebfd" }}>
          <p className="text-white mb-4">Unfollow {name}?</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-semibold"
            >
              Unfollow
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Connection() {
  const { profile, updateProfile } = useUserProfile();
  const { allUsers, addOrUpdateUser } = useUsers();

  const userConnectionsIds = profile?.connections || [];

  const connectedProfiles = userConnectionsIds
    .map((id) => allUsers[id])
    .filter(Boolean);

  // Search term state
  const [searchTerm, setSearchTerm] = useState("");

  // Filter connections by name substring (case-insensitive)
  const filteredProfiles = connectedProfiles.filter((user) =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle unfollow: remove the userId from current user's connections
  const unfollowUser = (unfollowId) => {
    if (!profile) return;
    const updatedConnections = profile.connections.filter((id) => id !== unfollowId);
    updateProfile({ connections: updatedConnections });
    addOrUpdateUser({ ...profile, connections: updatedConnections });
  };

  return (
    <div
      className="w-full px-8 py-8 bg-[#403d41] rounded-3xl border-l-8 border-black-300 min-h-screen"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: "0 6px 24px 0 #e4ebfd",
      }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-white">Your Connected Profiles</h1>
        {/* Search input */}
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-600 bg-[#4a474b]/50 rounded-xl px-4 py-3 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
        />
      </div>

      {filteredProfiles.length > 0 ? (
        filteredProfiles.map((user) => (
          <ConnectionItem
            key={user._id}
            userId={user._id}
            name={user.fullName}
            title={user.role || user.title}
            avatarUrl={user.profilePic || user.avatarUrl}
            onUnfollow={() => unfollowUser(user._id)}
          />
        ))
      ) : (
        <p className="text-gray-300 text-center text-lg py-12">No connections found.</p>
      )}
    </div>
  );
}
