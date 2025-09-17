import React, { useRef, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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

const iconMap = {
  Education: GraduationCap,
  Internships: Briefcase,
  Skills: Star,
};


function ConnectionItem({ name, title, avatarUrl }) {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow mb-3 w-full">
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
          <h4 className="font-semibold">{name}</h4>
          <p className="text-gray-500 text-sm">{title}</p>
        </div>
      </div>
    </div>
  );
}

export default function MyProfile() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useUserProfile();
  const { allUsers } = useUsers();

  const {
    profilePic = "https://randomuser.me/api/portraits/men/75.jpg",
    bgImage = "",
    about = "",
    name = "",
    role = "",
    contact = "",
    sections = { Education: [""], Internships: [""], Skills: [""] },
  } = profile || {};

  const [editingBio, setEditingBio] = useState(false);
  const [editingProfileInfo, setEditingProfileInfo] = useState(false);
  const [bgMenu, setBgMenu] = useState(false);

  const [newInputs, setNewInputs] = useState({
    Education: "",
    Internships: "",
    Skills: "",
  });

  const [localAbout, setLocalAbout] = useState(about);
  const [localName, setLocalName] = useState(name);
  const [localRole, setLocalRole] = useState(role);
  const [localContact, setLocalContact] = useState(contact);

  const fileInputRef = useRef();
  const bgInputRef = useRef();

  useEffect(() => setLocalAbout(about), [about]);
  useEffect(() => setLocalName(name), [name]);
  useEffect(() => setLocalRole(role), [role]);
  useEffect(() => setLocalContact(contact), [contact]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localAbout !== about) {
        updateProfile({ about: localAbout });
      }
    }, 700);
    return () => clearTimeout(handler);
  }, [localAbout, about, updateProfile]);

  const handleEditPhoto = () => fileInputRef.current.click();

  const onPhotoChange = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => updateProfile({ profilePic: reader.result });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleEditBg = () => bgInputRef.current.click();

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
    if (bgImage) window.open(bgImage, "_blank");
    setBgMenu(false);
  };

  const onBlurHandler = (field, value, original) => {
    if (value !== original) {
      updateProfile({ [field]: value });
    }
  };

  const handleProfileChange = (field, value) => {
    if (field === "name") setLocalName(value);
    else if (field === "role") setLocalRole(value);
    else if (field === "contact") setLocalContact(value);
  };

  const handleSectionEdit = (section, index, value) => {
    const updated = [...(sections[section] || [])];
    updated[index] = value;
    updateProfile({ sections: { ...sections, [section]: updated } });
  };

  const handleSectionAdd = (section) => {
    if (!newInputs[section]?.trim()) return;
    updateProfile({
      sections: { ...sections, [section]: [...(sections[section] || []), newInputs[section].trim()] },
    });
    setNewInputs((prev) => ({ ...prev, [section]: "" }));
  };

  const handleSectionRemove = (section, index) => {
    const updated = [...(sections[section] || [])];
    updated.splice(index, 1);
    updateProfile({ sections: { ...sections, [section]: updated } });
  };

  const handleNewInputChange = (section, value) => setNewInputs((prev) => ({ ...prev, [section]: value }));

  const connectedProfiles = (profile?.connections || [])
    .map((id) => allUsers[id])
    .filter(Boolean);

const displayedConnections = connectedProfiles.slice(0, 5);

  const isDataUri = /^data:image\/(png|jpg|jpeg);base64,/i.test(bgImage.trim());

  const bgImageUrl = useMemo(() => (isDataUri ? bgImage.trim() : bgImage ? `${bgImage}?${Date.now()}` : ""), [bgImage]);

  return (
    <div className="flex min-h-screen bg-gray-100 p-0">
      <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={onPhotoChange} accept="image/*" />
      <input type="file" ref={bgInputRef} style={{ display: "none" }} onChange={onChangeBg} accept="image/*" />

      <div className="flex flex-col flex-1 space-y-6">
        <div className="relative">
          <div className="h-60 w-full bg-gray-300 rounded-md overflow-hidden relative">
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
            <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-blue-100 transition" onClick={() => setBgMenu(!bgMenu)}>
              <Pencil size={20} />
            </button>
            {bgMenu && (
              <div className="absolute top-12 right-3 z-10 bg-white rounded shadow-lg py-2 w-36 flex flex-col space-y-1">
                <button disabled={!bgImage} onClick={handleViewBg} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 disabled:text-gray-300">
                  <Eye size={16} /> View
                </button>
                <button onClick={handleEditBg} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                  <ImagePlus size={16} /> Update
                </button>
                <button disabled={!bgImage} onClick={handleDeleteBg} className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 text-red-600 disabled:text-gray-300">
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            )}
          </div>
          <div className="absolute left-10 -bottom-16 z-10">
            <div className="relative">
              <img src={profilePic} alt="Profile" className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white" />
              <button className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow hover:bg-blue-100 border" onClick={handleEditPhoto} title="Change Profile Photo">
                <Pencil size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="h-20"></div>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Profile Info</h2>
            <button onClick={() => setEditingProfileInfo(!editingProfileInfo)} aria-label="Edit Profile Info" className="hover:text-blue-600 transition">
              <Pencil size={20} />
            </button>
          </div>
          {editingProfileInfo ? (
            <>
              <input className="w-full p-2 mb-4 border rounded focus:ring-2 focus:ring-blue-500" type="text" value={localName} onChange={e => handleProfileChange("name", e.target.value)} onBlur={() => onBlurHandler("name", localName, name)} placeholder="Name" />
              <input className="w-full p-2 mb-4 border rounded focus:ring-2 focus:ring-blue-500" type="text" value={localRole} onChange={e => handleProfileChange("role", e.target.value)} onBlur={() => onBlurHandler("role", localRole, role)} placeholder="Role" />
              <input className="w-full p-2 mb-4 border rounded focus:ring-2 focus:ring-blue-500" type="text" value={localContact} onChange={e => handleProfileChange("contact", e.target.value)} onBlur={() => onBlurHandler("contact", localContact, contact)} placeholder="Contact" />
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold">{name}</h2>
              <p className="text-gray-600">{role}</p>
              <p className="text-gray-600">{contact}</p>
            </>
          )}
        </Card>

        <Card className="p-6 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">About Me</h2>
            <button className="hover:text-blue-600 transition" onClick={() => setEditingBio(!editingBio)} aria-label="Edit About Me">
              <Pencil size={20} />
            </button>
          </div>
          {editingBio ? (
            <textarea className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" rows={4} value={localAbout} onChange={e => setLocalAbout(e.target.value)} />
          ) : (
            <p className="whitespace-pre-line">{about}</p>
          )}
        </Card>

        {/* Sections */}
        {["Education", "Internships", "Skills"].map((section) => (
          <Card key={section} className="p-6 mt-6">
            <div className="flex items-center gap-2 mb-4">
              {React.createElement(iconMap[section] || Pencil, { size: 24, className: "text-blue-600" })}
              <h2 className="text-xl font-semibold">{section}</h2>
            </div>
            {(sections[section] || []).slice(0, 5).map((item, idx) => ( // Show max 5 items for demo, adjust as needed
              <div key={idx} className="flex items-center gap-3 mb-3">
                <input type="text" value={item} onChange={e => handleSectionEdit(section, idx, e.target.value)} className="flex-grow p-2 border rounded focus:ring-2 focus:ring-blue-500" />
                <button onClick={() => handleSectionRemove(section, idx)} className="text-red-600 hover:text-red-800" aria-label={`Remove ${section}`}>
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            <div className="flex items-center gap-3">
              <input type="text" placeholder={`Add new ${section}`} value={newInputs[section]} onChange={e => handleNewInputChange(section, e.target.value)} className="flex-grow p-2 border rounded focus:ring-2 focus:ring-blue-500" />
              <button onClick={() => handleSectionAdd(section)} className="text-blue-600 hover:text-blue-800" aria-label={`Add new ${section}`}>
                <PlusCircle size={28} />
              </button>
            </div>
          </Card>
        ))}

        {/* Connections */}
        <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Connections</h2>
        {connectedProfiles.length > 5 && (
          <button
            className="text-blue-600 hover:text-blue-800 font-semibold"
            onClick={() => navigate("/connections")} // Replace with your route path
          >
            View All
          </button>
        )}
      </div>
      {displayedConnections.length > 0 ? (
        displayedConnections.map((user) => (
          <ConnectionItem
            key={user._id}
            name={user.name}
            title={user.role || user.title}
            avatarUrl={user.profilePic || user.avatarUrl}
          />
        ))
      ) : (
        <p className="text-center text-gray-500">No connections yet</p>
      )}
    </Card>
      </div>
    </div>
  );
}
