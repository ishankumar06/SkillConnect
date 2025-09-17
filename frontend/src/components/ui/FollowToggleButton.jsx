// FollowToggleButton.jsx
import React from "react";
import { useUserProfile } from "../context/UserProfileContext";
import { useUsers } from "../context/UsersContext";

export default function FollowToggleButton({ targetUserId }) {
  const { profile, updateProfile } = useUserProfile();
  const { addOrUpdateUser } = useUsers();

  if (!profile) return null;

  const connections = profile.connections || [];
  const isFollowing = connections.includes(targetUserId);

  const toggleFollow = () => {
    let updatedConnections;
    if (isFollowing) {
      // Unfollow
      updatedConnections = connections.filter((id) => id !== targetUserId);
    } else {
      // Follow
      updatedConnections = [...connections, targetUserId];
    }

    updateProfile({ connections: updatedConnections });
    addOrUpdateUser({ ...profile, connections: updatedConnections });
  };

  return (
    <button
      onClick={toggleFollow}
      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition border whitespace-nowrap ${
        isFollowing
          ? "bg-green-600 text-white border-green-600 hover:bg-green-700"
          : "bg-transparent text-gray-700 border-gray-400 hover:bg-gray-100"
      }`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}
