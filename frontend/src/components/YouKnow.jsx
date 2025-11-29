import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useUserProfile } from "../context/UserProfileContext";
import { useUsers } from "../context/UsersContext";
import bgImage from '../assets/bgImage.png';

function SuggestedItem({ userId, name, title, avatarUrl, isFollowed, onToggleFollow }) {
  return (
    <div className="flex justify-between items-center bg-[#403d41] p-4 rounded-xl shadow mb-3 w-full relative">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Link
          to={`/profile/${userId}`}
          className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${name} avatar`}
              className="w-14 h-14 rounded-full object-cover border-2 border-blue-500 flex-shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0">
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
        onClick={onToggleFollow}
        className={`text-sm uppercase px-4 py-2 rounded-lg border-2 transition-all whitespace-nowrap ${
          isFollowed
            ? "bg-blue-600 text-white border-blue-600 cursor-not-allowed shadow-[3px_3px_0_0_#60a5fa]"
            : "text-[#fafafa] border-[#fafafa] bg-[#252525] shadow-[3px_3px_0_0_#fafafa] hover:bg-[#fafafa] hover:text-black hover:shadow-[1px_1px_0_0_#fafafa] cursor-pointer"
        } active:shadow-none active:translate-x-[2px] active:translate-y-[2px]`}
      >
        {isFollowed ? "Following" : "Follow"}
      </button>
    </div>
  );
}

export default function YouKnow() {
  const { userId } = useAuth();
  const { profile, updateProfile } = useUserProfile();
  const { allUsers, addOrUpdateUser } = useUsers();

  const [followedIds, setFollowedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (profile?.connections && JSON.stringify(profile.connections) !== JSON.stringify(followedIds)) {
      setFollowedIds(profile.connections);
    }
  }, [profile?.connections]);

  if (!profile || !allUsers) return null;

  const suggestions = Object.values(allUsers).filter(
    (user) => user._id !== userId && !followedIds.includes(user._id)
  );

  const filteredSuggestions = suggestions.filter((user) =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
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
      className="w-full px-6 py-6 bg-[#403d41] rounded-2xl shadow-md mt-6 min-h-screen"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Suggested for You</h1>
          <p className="text-gray-300 text-lg">People you may know</p>
        </div>
        <input
          type="text"
          placeholder="Search suggestions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 bg-[#252525] rounded-lg px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
        />
      </div>

      {filteredSuggestions.length > 0 ? (
        filteredSuggestions.map((user) => (
          <SuggestedItem
            key={user._id}
            userId={user._id}
            name={user.fullName}
            title={user.role || user.title || "Professional"}
            avatarUrl={user.profilePic || user.avatarUrl}
            isFollowed={followedIds.includes(user._id)}
            onToggleFollow={() => toggleFollow(user._id)}
          />
        ))
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <UserPlus size={32} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            {searchTerm ? "No matching suggestions" : "No more suggestions"}
          </h3>
          <p className="text-gray-500">
            {searchTerm ? "Try a different search term" : "Follow people to see suggestions"}
          </p>
        </div>
      )}
    </div>
  );
}
