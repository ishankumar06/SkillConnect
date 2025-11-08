import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useUserProfile } from "../context/UserProfileContext";
import { useUsers } from "../context/UsersContext";
import bgImage from '../assets/bgImage.png';

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
    updateProfile({ connections: updatedConnections });
    addOrUpdateUser({ ...profile, connections: updatedConnections });
  };

  return (
    <div
      className="bg-white shadow-lg rounded-2xl p-6 max-w-full overflow-x-auto"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h2 className="text-2xl font-extrabold text-blue-800 mb-6">Suggested for you</h2>
      {suggestions.length === 0 ? (
        <p className="text-gray-500 text-sm">No suggestions available.</p>
      ) : (
        <div className="space-y-6">
          {suggestions.map((user) => {
             console.log("Rendering user:", user.fullName, "| ID:", user._id);
            const isFollowed = followedIds.includes(user._id);
            return (
              <div
                key={user._id}
              
                className="flex items-center gap-5 p-6 bg-gray-50 rounded-2xl shadow-md hover:shadow-lg transition"
              >
                <Link
                  to={`/profile/${user._id}`}
                
                  
                  className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer"
                >
                  <img
                    src={user.profilePic || user.avatarUrl}
                    alt={`${user.fullName} avatar`}
                    className="w-12 h-12 rounded-full border-2 border-blue-300 object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-lg text-blue-900 truncate">{user.fullName}</h3>
                    <p className="text-xs text-gray-600">{user.role || user.title}</p>
                  </div>
                </Link>
                <button
                  onClick={() => toggleFollow(user._id)}
                  className={`bg-white text-sm font-medium rounded-full px-5 py-2 border transition whitespace-nowrap select-none shadow ${
                    isFollowed
                      ? "text-green-600 border-green-600 hover:bg-green-100"
                      : "text-gray-700 border-gray-400 hover:bg-gray-100"
                  }`}
                >
                  {isFollowed ? "Following" : "Follow"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

