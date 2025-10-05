import React, { useState } from "react";
import { useUserProfile } from "../context/UserProfileContext";
import { useUsers } from "../context/UsersContext";
import bgImage from '../assets/bgImage.png';

function ConnectionItem({ name, title, avatarUrl, onUnfollow }) {
  const [showConfirm, setShowConfirm] = useState(false);

  // Confirm dialog handlers
  const handleUnfollowClick = () => setShowConfirm(true);
  const handleCancel = () => setShowConfirm(false);
  const handleConfirm = () => {
    setShowConfirm(false);
    onUnfollow();
  };

  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-md mb-3 cursor-default w-full max-w-none relative">
      <div className="flex items-center gap-4">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`${name} avatar`}
            className="w-14 h-14 rounded-full object-cover border-2 border-green-500"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-lg">
            {name?.charAt(0) || "?"}
          </div>
        )}
        <div>
          <h4 className="font-semibold text-gray-900 text-lg">{name}</h4>
          <p className="text-gray-500 text-sm">{title}</p>
        </div>
      </div>

      <button
        onClick={handleUnfollowClick}
        className="
          text-sm text-[#fafafa] uppercase px-3 py-1 rounded-lg border-2 border-[#fafafa] 
          bg-[#252525] shadow-[3px_3px_0_0_#fafafa] cursor-pointer
          active:shadow-none active:translate-x-[2px] active:translate-y-[2px]
          transition whitespace-nowrap max-w-full
        "
      >
        Followed
      </button>

      {showConfirm && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded shadow-lg p-4 z-10 border border-gray-300">
          <p className="text-gray-800 mb-3">Unfollow {name}?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
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
    <div className="w-full px-6 py-6 bg-gray-50 rounded-2xl shadow-md mt-6 min-h-screen"
    style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Connected Profiles</h1>
        {/* Search input */}
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {filteredProfiles.length > 0 ? (
        filteredProfiles.map((user) => (
          <ConnectionItem
            key={user._id}
            name={user.fullName}
            title={user.role || user.title}
            avatarUrl={user.profilePic || user.avatarUrl}
            onUnfollow={() => unfollowUser(user._id)}
          />
        ))
      ) : (
        <p className="text-gray-500 text-center">No connections found.</p>
      )}
    </div>
  );
}
