import React, { useState, useEffect } from "react";
import { Save, Share2, UserPlus, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import { useUserProfile } from "@/context/UserProfileContext";
import { useSavedPosts } from "@/context/SaveContext";
import { useAuth } from "@/context/AuthContext";
import skillLogo from "../assets/skill.png";

export default function PostCard({ post }) {
  const {
    _id: rawId,
    id,
    authorId,
    author = {},
    time,
    title,
    content = "",
    description = "",
    profilePic: postProfilePic,
    address,
    workType,
    salary,
    jobImage = "",
    workingHour,
    holiday,
  } = post || {};

  const _id = rawId || id;
  const navigate = useNavigate();
  const { profile, updateProfile } = useUserProfile();
  const { addSavedPost, savedPosts } = useSavedPosts();
  const { userId: loggedInUserId } = useAuth();

  const hasValidString = (str) => typeof str === "string" && str.trim().length > 0;

  const jobDescription =
    hasValidString(content)
      ? content
      : hasValidString(description)
      ? description
      : hasValidString(author.description)
      ? author.description
      : hasValidString(author.content)
      ? author.content
      : "No description available.";

  const finalJobImage = hasValidString(jobImage)
    ? jobImage
    : hasValidString(author.jobImage)
    ? author.jobImage
    : "";

  const displayAuthor =
    typeof author === "string" ? author : author?.fullName || "Unknown Company";

  const displayProfilePic = postProfilePic || author.profilePic || skillLogo;

  const isAlreadySaved = savedPosts.some(
    (sp) => sp.postId && sp.postId._id === _id
  );

  const [isFollowing, setIsFollowing] = useState(
    profile?.connections?.some((connId) => String(connId) === String(authorId)) ?? false
  );
  const [isInterested, setIsInterested] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    setIsInterested(false);
  }, [_id]);

  useEffect(() => {
    if (profile?.connections) {
      const currentlyFollowing = profile.connections.some(
        (connId) => String(connId) === String(authorId)
      );
      if (currentlyFollowing !== isFollowing) {
        setIsFollowing(currentlyFollowing);
      }
    }
  }, [profile?.connections, authorId, isFollowing]);

  const toggleFollow = async () => {
    if (!profile) return;

    const newFollowState = !isFollowing;
    setIsFollowing(newFollowState);

    let updatedConnections = profile.connections ? [...profile.connections] : [];

    if (newFollowState) {
      if (!updatedConnections.some((connId) => String(connId) === String(authorId))) {
        updatedConnections.push(authorId);
      }
    } else {
      updatedConnections = updatedConnections.filter(
        (connId) => String(connId) !== String(authorId)
      );
    }

    try {
      await updateProfile({ connections: updatedConnections });
    } catch {
      setIsFollowing(!newFollowState);
    }
  };

  const onInterestedClick = () => {
    setIsInterested(true);
    setIsRedirecting(true);

    setTimeout(() => {
      if (_id) {
        navigate(`/apply/${_id}`);
      } else {
        navigate("/apply");
      }
    }, 500);
  };

  const onSaveClick = async () => {
    if (!isAlreadySaved) {
      await addSavedPost(post);
      navigate("/save");
    }
  };

  const followButtonClass = isFollowing
    ? "bg-green-600 text-white border-green-600"
    : "bg-transparent text-gray-700 border-gray-400 hover:bg-gray-100";

  let imageSrc = finalJobImage;
  if (!hasValidString(imageSrc)) {
    imageSrc =
      "https://images.unsplash.com/photo-1504384308090-c894cc5386?auto=format&fit=crop&w=800&q=60";
  } else if (
    typeof imageSrc === "string" &&
    !imageSrc.startsWith("http") &&
    !imageSrc.startsWith("data:")
  ) {
    imageSrc = `${process.env.REACT_APP_BACKEND_URL || ""}${imageSrc}`;
  }

  const disableFollow = !authorId || String(authorId) === String(loggedInUserId);

  // ✅ NEW — navigate to author's profile
  const goToProfile = () => {
    if (!authorId) return;
    if (String(authorId) === String(loggedInUserId)) {
      navigate("/profile");
    } else {
      navigate(`/profile/${authorId}`);
    }
  };

  return (
    <div className="relative bg-white shadow-md rounded-2xl p-6 max-w-4xl mx-auto flex flex-col gap-4 min-h-[550px]">
      <div className="flex justify-between items-start">
        <div
          className="flex items-center gap-4 cursor-pointer"
          onClick={goToProfile} // ✅ Clickable avatar & name
        >
          <img
            src={displayProfilePic}
            alt={`${displayAuthor} profile`}
            className="w-16 h-16 rounded-full object-cover border"
          />
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2 hover:underline">
              {displayAuthor}
              <span className="text-gray-600 text-sm font-normal">
                {workType || "Full Time"}
              </span>
            </h3>
            <p className="text-sm text-gray-500">{time || "Just now"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert("Share clicked")}
            aria-label="Share post"
            className="text-gray-500 hover:text-blue-600 transition"
          >
            <Share2 size={24} />
          </button>

          <button
            onClick={toggleFollow}
            disabled={disableFollow}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-1 rounded-full border transition ${
              disableFollow
                ? "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300"
                : followButtonClass
            }`}
            aria-label={isFollowing ? "Unfollow author" : "Follow author"}
            title={disableFollow ? "You cannot follow yourself" : ""}
          >
            <UserPlus size={16} />
            {disableFollow ? "You" : isFollowing ? "Following" : "Follow"}
          </button>
        </div>
      </div>

      <div className="flex justify-between text-gray-800 text-sm font-medium mb-4">
        <p>
          <strong>Salary:</strong> {salary || "N/A"}
        </p>
        <p>
          <strong>Address:</strong> {address || "N/A"}
        </p>
      </div>

      {imageSrc && (
        <div className="flex-grow w-full h-80 rounded-lg overflow-hidden">
          <img src={imageSrc} alt="Job Visual" className="w-full h-full object-cover" />
        </div>
      )}

      <p className="text-gray-700 flex-grow mt-4">{jobDescription}</p>

      <button
        onClick={onInterestedClick}
        disabled={isInterested}
        className={`w-full mt-4 rounded-md py-3 font-semibold ${
          isInterested
            ? "bg-yellow-400 text-black cursor-not-allowed"
            : "bg-yellow-300 hover:bg-yellow-400 text-black"
        } transition`}
        aria-disabled={isInterested}
      >
        {isInterested ? "Interested" : "I'm Interested"}
      </button>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setShowDetails(true)}
          className="flex items-center gap-1 text-blue-600 font-medium hover:underline"
          aria-label="View Details"
        >
          <Info size={18} />
          Info
        </button>

        <button
          aria-label="Save post"
          onClick={onSaveClick}
          disabled={isAlreadySaved}
          className={`transition ${
            isAlreadySaved ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
          }`}
        >
          <Save size={24} />
        </button>
      </div>

      {showDetails && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-6">{title || "Job Details"}</h3>
            <p>
              <strong>Author:</strong> {displayAuthor}
            </p>
            <p>
              <strong>Address:</strong> {address || "N/A"}
            </p>
            <p>
              <strong>Salary:</strong> {salary || "N/A"}
            </p>
            <p>
              <strong>Working Hours:</strong> {workingHour || "N/A"}
            </p>
            <p>
              <strong>Job Type:</strong> {workType || "N/A"}
            </p>
            <p>
              <strong>Holiday:</strong> {holiday || "N/A"}
            </p>
            <p className="mt-4">
              <strong>Job Description:</strong>
              <br />
              {jobDescription}
            </p>
            <Button onClick={() => setShowDetails(false)} size="sm">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
