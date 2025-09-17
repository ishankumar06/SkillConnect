// import Card from "../components/ui/Card";
// import Connection from "../components/Connection";
// import { Briefcase, GraduationCap, Star, Pencil } from "lucide-react";
// import { useState, useRef } from "react";

// export default function MyProfile() {
//   const [profilePic, setProfilePic] = useState("https://randomuser.me/api/portraits/men/75.jpg");
//   const [about, setAbout] = useState("BTech student passionate about Web Development, Data Science, and building impactful products.");
//   const [editingBio, setEditingBio] = useState(false);
//   const fileInputRef = useRef();

//   // For demo: update profile image
//   const handleEditPhoto = () => fileInputRef.current.click();
//   const onPhotoChange = e => {
//     if (e.target.files[0]) {
//       setProfilePic(URL.createObjectURL(e.target.files[0]));
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100 p-6">
//       <input 
//         type="file"
//         ref={fileInputRef}
//         style={{ display: "none" }}
//         onChange={onPhotoChange}
//         accept="image/*"
//       />
//       <div className="flex-1 space-y-6 max-w-xl mx-auto">
//         {/* Profile Header */}
//         <Card className="!p-8 flex flex-col items-center">
//           <div className="relative">
//             <img src={profilePic} alt="Profile"
//               className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 mb-2" />
//             <button
//               onClick={handleEditPhoto}
//               className="absolute bottom-2 right-2 bg-white shadow rounded-full p-1 hover:bg-blue-50 border"
//               title="Change Photo"
//             >
//               <Pencil size={20} className="text-gray-700" />
//             </button>
//           </div>
//           <h2 className="text-2xl font-semibold mt-2 mb-1">Ishan Kumar</h2>
//           <p className="text-blue-600 font-medium mb-2">BTech Student & MERN Developer</p>
//           <p className="text-sm text-gray-500 mb-2">ishan.kumar@email.com | Bihar, India</p>
//         </Card>
        
//         {/* About Section */}
//         <Card>
//           <div className="flex justify-between items-center">
//             <h3 className="text-xl font-semibold mb-3">About Me</h3>
//             <button onClick={() => setEditingBio(!editingBio)}>
//               <Pencil size={18} className="text-gray-500 hover:text-blue-600" />
//             </button>
//           </div>
//           {editingBio ? (
//             <textarea
//               className="w-full p-2 border rounded mb-3"
//               rows={3}
//               value={about}
//               onChange={e => setAbout(e.target.value)}
//             />
//           ) : (
//             <p className="text-gray-600 mb-2">{about}</p>
//           )}
//           <div className="flex gap-6 text-gray-700 mt-2">
//             <div className="flex flex-col items-center">
//               <Briefcase size={22} />
//               <span className="text-sm mt-2 font-medium">Internships</span>
//               <span className="text-xs text-gray-500">2 completed</span>
//             </div>
//             <div className="flex flex-col items-center">
//               <GraduationCap size={22} />
//               <span className="text-sm mt-2 font-medium">Education</span>
//               <span className="text-xs text-gray-500">Amity University</span>
//             </div>
//             <div className="flex flex-col items-center">
//               <Star size={22} />
//               <span className="text-sm mt-2 font-medium">Skills</span>
//               <span className="text-xs text-gray-500">React, Node, Python</span>
//             </div>
//           </div>
//         </Card>

//         {/* Connections */}
//         <Card>
//           <h3 className="text-lg font-semibold mb-4">Connections</h3>
//           <Connection name="Alice Johnson" title="Frontend Developer" />
//           <Connection name="Bob Smith" title="Data Scientist" />
//           <Connection name="Charlie Brown" title="MERN Developer" />
//         </Card>
//       </div>
//     </div>
//   );
// }
