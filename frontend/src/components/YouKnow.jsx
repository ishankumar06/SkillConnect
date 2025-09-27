import React, { useState, useEffect } from "react";
import { UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useUserProfile } from "../context/UserProfileContext";
import { useUsers } from "../context/UsersContext";

export default function YouKnow() {
  const { userId } = useAuth();
  const { profile, updateProfile } = useUserProfile();
  const { allUsers, addOrUpdateUser } = useUsers();

  const [followedIds, setFollowedIds] = useState([]);

  useEffect(() => {
    if (profile?.connections && JSON.stringify(profile.connections) !== JSON.stringify(followedIds)) {
      setFollowedIds(profile.connections);
    }
  }, [profile?.connections]);

  if (!profile || !allUsers) return null;

  // Exclude current user and already followed users from suggestions
  const suggestions = Object.values(allUsers).filter(
    (user) => user._id !== userId && !followedIds.includes(user._id)
  );

  const toggleFollow = (id) => {
    if (!userId) {
      alert("Please login to follow users");
      return;
    }

    const isFollowing = followedIds.includes(id);
    let updatedConnections;

    if (isFollowing) {
      updatedConnections = followedIds.filter((fid) => fid !== id);
    } else {
      updatedConnections = [...followedIds, id];
    }

    setFollowedIds(updatedConnections);
   console.log("Calling updateProfile with:", updatedConnections);
updateProfile({ connections: updatedConnections });

    addOrUpdateUser({ ...profile, connections: updatedConnections });
  };

  return (
    <div className="bg-white shadow p-4 mb-6 rounded-lg max-w-full overflow-x-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Suggested for you</h2>
      <ul className="flex flex-col gap-3 min-w-[300px]">
        {suggestions.length === 0 ? (
          <p className="text-gray-500 text-sm">No suggestions available.</p>
        ) : (
          suggestions.map((user) => {
            const isFollowed = followedIds.includes(user._id);
            return (
              <li key={user._id} className="flex items-center justify-between min-w-[280px]">
                <div className="flex items-center gap-3">
                  <img
                    src={user.profilePic || user.avatarUrl}
                    alt={user.fullName}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />
                  <div className="flex-shrink">
                    <p className="font-medium text-gray-800 text-sm">{user.fullName}</p>
                    <p className="text-xs text-gray-500">{user.role || user.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleFollow(user._id)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition border whitespace-nowrap ${
                    isFollowed
                      ? "bg-green-600 text-white border-green-600 hover:bg-green-700"
                      : "bg-transparent text-gray-700 border-gray-400 hover:bg-gray-100"
                  }`}
                >
                  <UserPlus size={14} />
                  {isFollowed ? "Following" : "Follow"}
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
