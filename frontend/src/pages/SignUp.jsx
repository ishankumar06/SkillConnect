// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useUserProfile } from "../context/UserProfileContext";
// import { useUsers } from "../context/UsersContext";

// export default function Signup() {
//   const { login } = useAuth();
//   const { setProfile } = useUserProfile();
//   const { addOrUpdateUser } = useUsers();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     contact: "",
//     role: "",
//     location: "",
//     bio: "",
//     education: "",
//     about: "",
//     profilePic: null,
//   });

//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({});

//   const fileToBase64 = (file) =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result);
//       reader.onerror = reject;
//       reader.readAsDataURL(file);
//     });

//   const handleProfilePicChange = async (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const base64 = await fileToBase64(e.target.files[0]);
//       setForm((prev) => ({ ...prev, profilePic: base64 }));
//     }
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!form.name.trim()) newErrors.name = "Name is required.";
//     if (!form.email.trim()) newErrors.email = "Email is required.";
//     else if (
//       !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email.trim())
//     )
//       newErrors.email = "Invalid email address.";
//     if (!form.password) newErrors.password = "Password is required.";
//     else if (form.password.length < 8)
//       newErrors.password = "Password must be at least 8 characters.";
//     if (!form.confirmPassword)
//       newErrors.confirmPassword = "Please confirm your password.";
//     else if (form.confirmPassword !== form.password)
//       newErrors.confirmPassword = "Passwords do not match.";
//     return newErrors;
//   };

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleBlur = (e) => {
//     setTouched((prev) => ({ ...prev, [e.target.name]: true }));
//   };

//   const onSubmit = (e) => {
//     e.preventDefault();
//     const formErrors = validate();
//     setErrors(formErrors);
//     setTouched({
//       name: true,
//       email: true,
//       password: true,
//       confirmPassword: true,
//       contact: true,
//       role: true,
//       location: true,
//       bio: true,
//       education: true,
//       about: true,
//       profilePic: true,
//     });

//     if (Object.keys(formErrors).length === 0) {
//       const uniqueId = Date.now().toString(); // Generate unique ID

//       // Build full user profile object from form
//       const userProfile = {
//         id: uniqueId,
//         name: form.name.trim(),
//         email: form.email.trim(),
//         contact: form.contact.trim(),
//         role: form.role.trim(),
//         location: form.location.trim(),
//         bio: form.bio.trim(),
//         education: form.education.trim(),
//         about: form.about.trim(),
//         profilePic: form.profilePic,
//       };

//       login(uniqueId); // Store userId in auth context
//       setProfile(userProfile); // Store profile in user profile context
//       addOrUpdateUser(userProfile); // Add to global users context

//       // Clear form and touched/errors
//       setForm({
//         name: "",
//         email: "",
//         password: "",
//         confirmPassword: "",
//         contact: "",
//         role: "",
//         location: "",
//         bio: "",
//         education: "",
//         about: "",
//         profilePic: null,
//       });
//       setTouched({});
//       setErrors({});

//       // Redirect after signup (adjust as needed)
//       navigate("/dashboard");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
//         <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">
//           Create your account
//         </h2>
//         <form onSubmit={onSubmit} noValidate>
//           {/* Name */}
//           <div className="mb-4">
//             <label
//               htmlFor="name"
//               className="block text-gray-700 font-medium mb-1"
//             >
//               Name
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 transition ${
//                 errors.name && touched.name
//                   ? "border-red-500 focus:ring-red-500"
//                   : "border-gray-300 focus:ring-blue-500"
//               }`}
//               placeholder="Your full name"
//             />
//             {errors.name && touched.name && (
//               <p className="text-red-600 text-sm mt-1">{errors.name}</p>
//             )}
//           </div>

//           {/* Email */}
//           <div className="mb-4">
//             <label
//               htmlFor="email"
//               className="block text-gray-700 font-medium mb-1"
//             >
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 transition ${
//                 errors.email && touched.email
//                   ? "border-red-500 focus:ring-red-500"
//                   : "border-gray-300 focus:ring-blue-500"
//               }`}
//               placeholder="you@example.com"
//               autoComplete="email"
//             />
//             {errors.email && touched.email && (
//               <p className="text-red-600 text-sm mt-1">{errors.email}</p>
//             )}
//           </div>

//           {/* Password */}
//           <div className="mb-4">
//             <label
//               htmlFor="password"
//               className="block text-gray-700 font-medium mb-1"
//             >
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 transition ${
//                 errors.password && touched.password
//                   ? "border-red-500 focus:ring-red-500"
//                   : "border-gray-300 focus:ring-blue-500"
//               }`}
//               placeholder="Enter your password"
//               autoComplete="new-password"
//             />
//             {errors.password && touched.password && (
//               <p className="text-red-600 text-sm mt-1">{errors.password}</p>
//             )}
//           </div>

//           {/* Confirm Password */}
//           <div className="mb-6">
//             <label
//               htmlFor="confirmPassword"
//               className="block text-gray-700 font-medium mb-1"
//             >
//               Confirm Password
//             </label>
//             <input
//               type="password"
//               id="confirmPassword"
//               name="confirmPassword"
//               value={form.confirmPassword}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 transition ${
//                 errors.confirmPassword && touched.confirmPassword
//                   ? "border-red-500 focus:ring-red-500"
//                   : "border-gray-300 focus:ring-blue-500"
//               }`}
//               placeholder="Re-enter your password"
//               autoComplete="new-password"
//             />
//             {errors.confirmPassword && touched.confirmPassword && (
//               <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
//             )}
//           </div>

//           {/* Contact */}
//           <div className="mb-4">
//             <label
//               htmlFor="contact"
//               className="block text-gray-700 font-medium mb-1"
//             >
//               Contact Information
//             </label>
//             <input
//               id="contact"
//               name="contact"
//               value={form.contact}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//               placeholder="Phone, email or other contact"
//             />
//           </div>

//           {/* Role */}
//           <div className="mb-4">
//             <label
//               htmlFor="role"
//               className="block text-gray-700 font-medium mb-1"
//             >
//               Role / Job Title
//             </label>
//             <input
//               id="role"
//               name="role"
//               value={form.role}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//               placeholder="Your professional role"
//             />
//           </div>

//           {/* Location */}
//           <div className="mb-6">
//             <label
//               htmlFor="location"
//               className="block text-gray-700 font-medium mb-1"
//             >
//               Location
//             </label>
//             <input
//               id="location"
//               name="location"
//               value={form.location}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//               placeholder="Your city, state or region"
//             />
//           </div>

//           {/* Bio */}
//           <div className="mb-6">
//             <label
//               htmlFor="bio"
//               className="block text-gray-700 font-medium mb-1"
//             >
//               Short Bio
//             </label>
//             <textarea
//               id="bio"
//               name="bio"
//               value={form.bio}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               rows={3}
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//               placeholder="A brief introduction about you"
//             />
//           </div>

//           {/* Education */}
//           <div className="mb-6">
//             <label
//               htmlFor="education"
//               className="block text-gray-700 font-medium mb-1"
//             >
//               Education
//             </label>
//             <input
//               id="education"
//               name="education"
//               value={form.education || ""}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//               placeholder="Your education details"
//             />
//           </div>

//           {/* About Me */}
//           <div className="mb-6">
//             <label
//               htmlFor="about"
//               className="block text-gray-700 font-medium mb-1"
//             >
//               About Me
//             </label>
//             <textarea
//               id="about"
//               name="about"
//               value={form.about || ""}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               rows={3}
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//               placeholder="Write something about yourself"
//             />
//           </div>

//           {/* Profile Picture Upload */}
//           <div className="mb-6">
//             <label className="block text-gray-700 font-medium mb-1">
//               Profile Picture
//             </label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={async (e) => {
//                 if (e.target.files && e.target.files[0]) {
//                   const file = e.target.files[0];
//                   const reader = new FileReader();
//                   reader.onloadend = () => {
//                     setForm((prev) => ({ ...prev, profilePic: reader.result }));
//                   };
//                   reader.readAsDataURL(file);
//                 }
//               }}
//               className="w-full"
//             />
//             {form.profilePic && (
//               <img
//                 src={form.profilePic}
//                 alt="Profile Preview"
//                 className="mt-2 w-24 h-24 object-cover rounded-full"
//               />
//             )}
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 transition"
//           >
//             Sign Up
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }




import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUserProfile } from "../context/UserProfileContext";
import { useUsers } from "../context/UsersContext";
import api from "../api"; // Axios instance with JWT interceptor

export default function Signup() {
  const { login } = useAuth();
  const { setProfile } = useUserProfile();
  const { addOrUpdateUser } = useUsers();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact: "",
    role: "",
    location: "",
    bio: "",
    education: "",
    about: "",
    profilePic: null,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleProfilePicChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setForm((prev) => ({ ...prev, profilePic: base64 }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email.trim())
    )
      newErrors.email = "Invalid email address.";
    if (!form.password) newErrors.password = "Password is required.";
    else if (form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";
    if (!form.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password.";
    else if (form.confirmPassword !== form.password)
      newErrors.confirmPassword = "Passwords do not match.";
    return newErrors;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validate();
    setErrors(formErrors);
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      contact: true,
      role: true,
      location: true,
      bio: true,
      education: true,
      about: true,
      profilePic: true,
    });

    if (Object.keys(formErrors).length === 0) {
      try {
      const payload = {
  fullName: form.name.trim(),
  email: form.email.trim(),
  password: form.password,
  contact: form.contact.trim(),
  role: form.role.trim(),
  location: form.location.trim(),
  bio: form.bio.trim(),
  education: form.education.trim(),
  about: form.about.trim(),
  profilePic: form.profilePic,
};


        const response = await api.post("/auth/signup", payload);
        const { token, user } = response.data;

        localStorage.setItem("authToken", token);
        login(token);          // AuthContext login with token
        setProfile(user);      // UserProfileContext
        addOrUpdateUser(user); // UsersContext

        // Clear form and touched/errors state
        setForm({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          contact: "",
          role: "",
          location: "",
          bio: "",
          education: "",
          about: "",
          profilePic: null,
        });
        setTouched({});
        setErrors({});

        // Redirect after successful signup
        navigate("/dashboard");
      } catch (error) {
        alert(error.response?.data?.message || "Signup failed");
        console.error(error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">
          Create your account
        </h2>
        <form onSubmit={onSubmit} noValidate>
          {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 transition ${
                errors.name && touched.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Your full name"
              required
            />
            {errors.name && touched.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 transition ${
                errors.email && touched.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
            {errors.email && touched.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 transition ${
                errors.password && touched.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter your password"
              autoComplete="new-password"
              required
            />
            {errors.password && touched.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 transition ${
                errors.confirmPassword && touched.confirmPassword ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              required
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Contact */}
          <div className="mb-4">
            <label htmlFor="contact" className="block text-gray-700 font-medium mb-1">
              Contact Information
            </label>
            <input
              id="contact"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Phone, email or other contact"
            />
          </div>

          {/* Role */}
          <div className="mb-4">
            <label htmlFor="role" className="block text-gray-700 font-medium mb-1">
              Role / Job Title
            </label>
            <input
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Your professional role"
            />
          </div>

          {/* Location */}
          <div className="mb-6">
            <label htmlFor="location" className="block text-gray-700 font-medium mb-1">
              Location
            </label>
            <input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Your city, state or region"
            />
          </div>

          {/* Bio */}
          <div className="mb-6">
            <label htmlFor="bio" className="block text-gray-700 font-medium mb-1">
              Short Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={3}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="A brief introduction about you"
            />
          </div>

          {/* Education */}
          <div className="mb-6">
            <label htmlFor="education" className="block text-gray-700 font-medium mb-1">
              Education
            </label>
            <input
              id="education"
              name="education"
              value={form.education || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Your education details"
            />
          </div>

          {/* About Me */}
          <div className="mb-6">
            <label htmlFor="about" className="block text-gray-700 font-medium mb-1">
              About Me
            </label>
            <textarea
              id="about"
              name="about"
              value={form.about || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={3}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Write something about yourself"
            />
          </div>

          {/* Profile Picture Upload */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setForm((prev) => ({ ...prev, profilePic: reader.result }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full"
            />
            {form.profilePic && (
              <img
                src={form.profilePic}
                alt="Profile Preview"
                className="mt-2 w-24 h-24 object-cover rounded-full"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

