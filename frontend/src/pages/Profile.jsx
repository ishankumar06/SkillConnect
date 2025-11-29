import React, { useRef, useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../components/ui/Card";
import {
  Briefcase,
  GraduationCap,
  Star,
  Pencil,
  Eye,
  Trash2,
  ImagePlus,
  PlusCircle,
} from "lucide-react";
import { useUserProfile } from "../context/UserProfileContext";
import { useUsers } from "../context/UsersContext";
import bgImage from "../assets/bgImage.png";

const iconMap = {
  Education: GraduationCap,
  Internships: Briefcase,
  Skills: Star,
};

function ConnectionItem({ name, title, avatarUrl, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex justify-between items-center bg-[#403d41] p-4 rounded-xl shadow mb-3 w-full cursor-pointer hover:bg-[#4a474b] transition-all"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex items-center gap-4">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`${name} avatar`}
            className="w-14 h-14 rounded-full object-cover border-2 border-white flex-shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {name?.charAt(0) || "?"}
          </div>
        )}
        <div className="min-w-0">
          <h4 className="font-semibold text-white text-lg truncate">{name}</h4>
          <p className="text-gray-300 text-sm truncate">{title}</p>
        </div>
      </div>
    </div>
  );
}

export default function MyProfile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { profile, updateProfile } = useUserProfile();
  const { allUsers } = useUsers();

  // ✅ Declare all hooks once
  const [viewingUser, setViewingUser] = useState(null);
  const [editingBio, setEditingBio] = useState(false);
  const [editingProfileInfo, setEditingProfileInfo] = useState(false);
  const [bgMenu, setBgMenu] = useState(false);
  const [newInputs, setNewInputs] = useState({
    Education: "",
    Internships: "",
    Skills: "",
  });
  const [localAbout, setLocalAbout] = useState("");
  const [localName, setLocalName] = useState("");
  const [localRole, setLocalRole] = useState("");
  const [localContact, setLocalContact] = useState("");

  const fileInputRef = useRef();
  const bgInputRef = useRef();

  // 🧠 Whose profile to show
  useEffect(() => {
    if (userId) {
      const user = allUsers[userId];
      setViewingUser(user || null);
    } else {
      setViewingUser(profile);
    }
  }, [userId, profile, allUsers]);

  const isOwnProfile = !userId || userId === profile?._id;

  // 🧠 Sync local state when viewingUser changes
  useEffect(() => {
    if (viewingUser) {
      setLocalAbout(viewingUser.about || "");
      setLocalName(viewingUser.name || "");
      setLocalRole(viewingUser.role || "");
      setLocalContact(viewingUser.contact || "");
    }
  }, [viewingUser]);

  // 🧠 Auto-save bio
  useEffect(() => {
    if (isOwnProfile && localAbout && localAbout !== viewingUser?.about) {
      const handler = setTimeout(() => {
        updateProfile({ about: localAbout });
      }, 700);
      return () => clearTimeout(handler);
    }
  }, [localAbout, updateProfile, isOwnProfile, viewingUser]);

  // ✅ compute background image safely
  const userBgImage = viewingUser?.bgImage || "";
  const isDataUri = /^data:image\/(png|jpg|jpeg);base64,/i.test(
    userBgImage.trim()
  );
  const bgImageUrl = useMemo(
    () =>
      isDataUri
        ? userBgImage.trim()
        : userBgImage
        ? `${userBgImage}?${Date.now()}`
        : "",
    [userBgImage]
  );

  // 🧱 Loading fallback (after all hooks)
  if (!viewingUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#403d41]">
        <p className="text-white text-lg">Loading profile...</p>
      </div>
    );
  }

  // 🧩 Destructure safely
  const {
    profilePic = "https://randomuser.me/api/portraits/men/75.jpg",
    about = "",
    name = "",
    role = "",
    contact = "",
    sections = { Education: [], Internships: [], Skills: [] },
  } = viewingUser;

  // 🧠 Handlers
  const handleEditPhoto = () => isOwnProfile && fileInputRef.current.click();

  const onPhotoChange = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => updateProfile({ profilePic: reader.result });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleEditBg = () => isOwnProfile && bgInputRef.current.click();

  const onChangeBg = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ bgImage: reader.result });
        setBgMenu(false);
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setBgMenu(false);
    }
  };

  const handleDeleteBg = () => {
    updateProfile({ bgImage: "" });
    setBgMenu(false);
  };

  const handleViewBg = () => {
    if (userBgImage) window.open(userBgImage, "_blank");
    setBgMenu(false);
  };

  const onBlurHandler = (field, value, original) => {
    if (isOwnProfile && value !== original) {
      updateProfile({ [field]: value });
    }
  };

  const handleProfileChange = (field, value) => {
    if (field === "name") setLocalName(value);
    else if (field === "role") setLocalRole(value);
    else if (field === "contact") setLocalContact(value);
  };

  const handleSectionEdit = (section, index, value) => {
    if (!isOwnProfile) return;
    const updated = [...(sections[section] || [])];
    updated[index] = value;
    updateProfile({ sections: { ...sections, [section]: updated } });
  };

  const handleSectionAdd = (section) => {
    if (!isOwnProfile || !newInputs[section]?.trim()) return;
    updateProfile({
      sections: {
        ...sections,
        [section]: [...(sections[section] || []), newInputs[section].trim()],
      },
    });
    setNewInputs((prev) => ({ ...prev, [section]: "" }));
  };

  const handleSectionRemove = (section, index) => {
    if (!isOwnProfile) return;
    const updated = [...(sections[section] || [])];
    updated.splice(index, 1);
    updateProfile({ sections: { ...sections, [section]: updated } });
  };

  const handleNewInputChange = (section, value) =>
    setNewInputs((prev) => ({ ...prev, [section]: value }));

  const connectedProfiles = (viewingUser?.connections || [])
    .map((id) => allUsers[id])
    .filter(Boolean);

  const displayedConnections = connectedProfiles.slice(0, 5);

  // 🧱 Render
  return (
    <div
      className="flex min-h-screen bg-[#403d41] p-6"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={onPhotoChange}
        accept="image/*"
      />
      <input
        type="file"
        ref={bgInputRef}
        style={{ display: "none" }}
        onChange={onChangeBg}
        accept="image/*"
      />

      <div className="flex flex-col flex-1 space-y-6 max-w-6xl mx-auto w-full">
        {/* --- Background Section --- */}
        <div className="relative">
          <div className="h-60 w-full bg-gray-300 rounded-2xl overflow-hidden relative shadow-2xl">
            {bgImageUrl ? (
              <img
                src={bgImageUrl}
                alt="Background"
                className="object-cover w-full h-full transition-opacity duration-300 ease-in-out"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-300">
                <span className="text-gray-400">No Background Image</span>
              </div>
            )}
            {isOwnProfile && (
              <button
                className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-white transition"
                onClick={() => setBgMenu(!bgMenu)}
              >
                <Pencil size={20} />
              </button>
            )}
            {bgMenu && (
              <div className="absolute top-12 right-3 z-10 bg-white rounded shadow-lg py-2 w-36 flex flex-col space-y-1">
                <button
                  disabled={!userBgImage}
                  onClick={handleViewBg}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 disabled:text-gray-300"
                >
                  <Eye size={16} /> View
                </button>
                <button
                  onClick={handleEditBg}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                >
                  <ImagePlus size={16} /> Update
                </button>
                <button
                  disabled={!userBgImage}
                  onClick={handleDeleteBg}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 text-red-600 disabled:text-gray-300"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            )}
          </div>
          <div className="absolute left-10 -bottom-16 z-10">
            <div className="relative">
              <img
                src={profilePic}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white"
              />
              {isOwnProfile && (
                <button
                  className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow hover:bg-white border"
                  onClick={handleEditPhoto}
                  title="Change Profile Photo"
                >
                  <Pencil size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="h-20"></div>

        {/* --- Profile Info --- */}
        <Card className="p-8 bg-[#403d41]/90 backdrop-blur-sm border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-white">
              {isOwnProfile ? "Your Profile Info" : `${name}'s Profile`}
            </h2>
            {isOwnProfile && (
              <button
                onClick={() => setEditingProfileInfo(!editingProfileInfo)}
                aria-label="Edit Profile Info"
                className="hover:text-white transition"
              >
                <Pencil size={20} />
              </button>
            )}
          </div>
          {editingProfileInfo && isOwnProfile ? (
            <>
              <input
                className="w-full p-2 mb-4 border rounded focus:ring-2 focus:ring-white"
                type="text"
                value={localName}
                onChange={(e) => handleProfileChange("name", e.target.value)}
                onBlur={() => onBlurHandler("name", localName, name)}
                placeholder="Name"
              />
              <input
                className="w-full p-2 mb-4 border rounded focus:ring-2 focus:ring-white"
                type="text"
                value={localRole}
                onChange={(e) => handleProfileChange("role", e.target.value)}
                onBlur={() => onBlurHandler("role", localRole, role)}
                placeholder="Role"
              />
              <input
                className="w-full p-2 mb-4 border rounded focus:ring-2 focus:ring-white"
                type="text"
                value={localContact}
                onChange={(e) => handleProfileChange("contact", e.target.value)}
                onBlur={() => onBlurHandler("contact", localContact, contact)}
                placeholder="Contact"
              />
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-white">{name}</h2>
              <p className="text-gray-300">{role}</p>
              <p className="text-gray-300">{contact}</p>
            </>
          )}
        </Card>

        {/* --- About Me --- */}
        <Card className="p-8 mt-6 bg-[#403d41]/90 backdrop-blur-sm border border-white/20">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-white">About Me</h2>
            {isOwnProfile && (
              <button
                className="hover:text-white transition"
                onClick={() => setEditingBio(!editingBio)}
                aria-label="Edit About Me"
              >
                <Pencil size={20} />
              </button>
            )}
          </div>
          {editingBio && isOwnProfile ? (
            <textarea
              className="w-full p-2 border rounded focus:ring-2 focus:ring-white"
              rows={4}
              value={localAbout}
              onChange={(e) => setLocalAbout(e.target.value)}
            />
          ) : (
            <p className="text-gray-200 whitespace-pre-line">{about}</p>
          )}
        </Card>

        {/* --- Education / Internships / Skills --- */}
        {["Education", "Internships", "Skills"].map((section) => (
          <Card key={section} className="p-8 mt-6 bg-[#403d41]/90 backdrop-blur-sm border border-white/20">
            <div className="flex items-center gap-2 mb-4">
              {React.createElement(iconMap[section] || Pencil, {
                size: 24,
                className: "text-white",
              })}
              <h2 className="text-xl font-semibold text-white">{section}</h2>
            </div>
            {(sections[section] || []).map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 mb-3">
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleSectionEdit(section, idx, e.target.value)
                  }
                  className="flex-grow p-2 border rounded focus:ring-2 focus:ring-white"
                  readOnly={!isOwnProfile}
                />
                {isOwnProfile && (
                  <button
                    onClick={() => handleSectionRemove(section, idx)}
                    className="text-red-600 hover:text-red-800"
                    aria-label={`Remove ${section}`}
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
            {isOwnProfile && (
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder={`Add new ${section}`}
                  value={newInputs[section]}
                  onChange={(e) =>
                    handleNewInputChange(section, e.target.value)
                  }
                  className="flex-grow p-2 border rounded focus:ring-2 focus:ring-white"
                />
                <button
                  onClick={() => handleSectionAdd(section)}
                  className="text-white hover:text-white"
                  aria-label={`Add new ${section}`}
                >
                  <PlusCircle size={28} />
                </button>
              </div>
            )}
          </Card>
        ))}

        {/* --- Connections --- */}
        <Card className="p-8 bg-[#403d41]/90 backdrop-blur-sm border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Connections</h2>
            <button
              onClick={() => navigate("/connections")}
              className="text-white text-sm hover:underline"
            >
              View All
            </button>
          </div>
          {displayedConnections.length > 0 ? (
            displayedConnections.map((user) => (
              <ConnectionItem
                key={user._id}
                name={user.fullName}
                title={user.role || user.title}
                avatarUrl={user.profilePic || user.avatarUrl}
                onClick={() => navigate(`/profile/${user._id}`)}
              />
            ))
          ) : (
            <p className="text-center text-gray-300">No connections yet</p>
          )}
        </Card>
      </div>
    </div>
  );
}
