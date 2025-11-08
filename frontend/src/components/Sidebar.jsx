import { useMemo } from "react";
import { Pencil } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUsers } from "@/context/UsersContext";
import { useUserProfile } from "@/context/UserProfileContext";

function getRandomElements(arr, count) {
  const shuffled = arr.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

export default function Sidebar() {
  const navigate = useNavigate();
  const { allUsers } = useUsers();
  const { profile, updateProfile } = useUserProfile();

  // Fixed: Use profile._id instead of profile.id for currentUserId
  const currentUserId = profile?._id;
  const connectedIds = profile?.connections || [];

  // Convert connectedIds to strings for reliable comparison
  const stringConnectedIds = connectedIds.map(String);

  // Suggestions with debug logs
  const suggestions = useMemo(() => {
    if (!allUsers) return [];

    const allUserIds = Object.values(allUsers).map((u) => String(u._id));
    console.group("Sidebar Suggestions Debug");
    console.log("Current User ID (string):", String(currentUserId));
    console.log("All User IDs:", allUserIds);
    console.log("Connected User IDs (strings):", stringConnectedIds);

    const candidates = Object.values(allUsers).filter(
      (user) =>
        String(user._id) !== String(currentUserId) &&
        !stringConnectedIds.includes(String(user._id))
    );

    const candidateIds = candidates.map((c) => String(c._id));
    console.log("Candidate User IDs after filtering:", candidateIds);
    console.groupEnd();

    return getRandomElements(candidates, 5);
  }, [allUsers, currentUserId, stringConnectedIds]);

  // Follow states with debugging
  const followStates = useMemo(() => {
    const initFollows = {};
    suggestions.forEach((user) => {
      initFollows[user._id] = stringConnectedIds.includes(String(user._id));
    });
    console.log("Follow States:", initFollows);
    return initFollows;
  }, [suggestions, stringConnectedIds]);

  // Toggle follow state and update profile connections
  const toggleFollow = (userId) => {
    const isFollowing = followStates[userId];
    console.log("ishan",userId);

    let updatedConnections;
    if (isFollowing) {
      updatedConnections = connectedIds.filter((id) => String(id) !== String(userId));
    } else {
      updatedConnections = [...connectedIds, userId];
    }

   console.log("Calling updateProfile withishan:", updatedConnections);
updateProfile({ connections: updatedConnections });

  };

  const links = [
    { name: "Post job", icon: <Pencil size={20} />, path: "/PostSection" },
  ];

  return (
    <aside className="w-64 bg-white p-6 shadow h-screen flex flex-col">
      <nav className="flex flex-col gap-4 mb-6">
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {link.icon}
            <span className="font-medium">{link.name}</span>
          </Link>
        ))}
      </nav>
      {/* the bellow code in case want to implement the promotimon */}

      {/* <div className="mb-6 bg-blue-50 rounded-xl p-4 text-center text-blue-800 font-semibold shadow">
        <p>🔥 Special Promotion: Upgrade your profile today!</p>
        <button
          onClick={() => navigate("/promotion")}
          className="mt-3 bg-green-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
        >
          Learn More
        </button>
      </div> */}                             

      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Suggested for you</h2>
          <button
            onClick={() => navigate("/youknow")}
            className="text-blue-600 text-sm hover:underline"
          >
            View All
          </button>
        </div>

        <ul className="flex flex-col gap-3 ">
          {suggestions.length > 0 ? (
            suggestions.map((user) => {
              const isFollowing = !!followStates[user._id];
              return (
                <li
                  key={user._id}
                  className="flex items-center justify-between gap-3 w-full"
                >
                  <Link
  to={`/profile/${user._id}`}
  className="flex items-center gap-3 cursor-pointer flex-grow min-w-0 hover:bg-gray-100 p-1 rounded-lg transition"
>
  <img
    src={user.profilePic || user.avatarUrl}
    alt={user.fullName}
    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
  />
  <div className="truncate">
    <p className="font-medium text-gray-800 text-sm truncate">{user.fullName}</p>
    <p className="text-xs text-gray-500 truncate">{user.role || user.title}</p>
  </div>
</Link>


                  <button
                    type="button"
                    onClick={() => toggleFollow(user._id)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs transition border whitespace-nowrap flex-shrink-0 ${
                      isFollowing
                        ? "bg-green-600 text-white border-green-600 hover:bg-green-700"
                        : "bg-transparent text-gray-700 border-gray-400 hover:bg-gray-100"
                    }`}
                    aria-label={isFollowing ? "Unfollow user" : "Follow user"}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                </li>
              );
            })
          ) : (
            <p className="text-gray-500 text-sm">No suggestions available.</p>
          )}
        </ul>
      </div>
    </aside>
  );
}
