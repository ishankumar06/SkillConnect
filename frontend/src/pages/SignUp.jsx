import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useUserProfile } from "../context/UserProfileContext";
import { useUsers } from "../context/UsersContext";
import api from "../api"; 
import bgImage from '../assets/bgImage.png';

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
        login(token);
        setProfile(user);
        addOrUpdateUser(user);

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

        navigate("/dashboard");
      } catch (error) {
        alert(error.response?.data?.message || "Signup failed");
        console.error(error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-2xl w-full bg-[#403d41] p-10 rounded-3xl shadow-lg border-l-8 border-black-300" style={{ boxShadow: "0 6px 24px 0 #e4ebfd" }}>
        <h2 className="text-4xl font-bold mb-8 text-center text-white">
          Create your account
        </h2>
        <form onSubmit={onSubmit} noValidate className="space-y-6">
          {/* Name */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-white font-semibold mb-2 text-lg">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition bg-[#4a474b]/50 text-white placeholder-gray-400 ${
                errors.name && touched.name 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              }`}
              placeholder="Your full name"
              required
            />
            {errors.name && touched.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-white font-semibold mb-2 text-lg">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition bg-[#4a474b]/50 text-white placeholder-gray-400 ${
                errors.email && touched.email 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              }`}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
            {errors.email && touched.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-white font-semibold mb-2 text-lg">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition bg-[#4a474b]/50 text-white placeholder-gray-400 ${
                errors.password && touched.password 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              }`}
              placeholder="Enter your password"
              autoComplete="new-password"
              required
            />
            {errors.password && touched.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-white font-semibold mb-2 text-lg">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition bg-[#4a474b]/50 text-white placeholder-gray-400 ${
                errors.confirmPassword && touched.confirmPassword 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              }`}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              required
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Contact */}
          <div className="mb-6">
            <label htmlFor="contact" className="block text-white font-semibold mb-2 text-lg">
              Contact Information
            </label>
            <input
              id="contact"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-[#4a474b]/50 text-white placeholder-gray-400"
              placeholder="Phone, email or other contact"
            />
          </div>

          {/* Role */}
          <div className="mb-6">
            <label htmlFor="role" className="block text-white font-semibold mb-2 text-lg">
              Role / Job Title
            </label>
            <input
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-[#4a474b]/50 text-white placeholder-gray-400"
              placeholder="Your professional role"
            />
          </div>

          {/* Location */}
          <div className="mb-6">
            <label htmlFor="location" className="block text-white font-semibold mb-2 text-lg">
              Location
            </label>
            <input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-[#4a474b]/50 text-white placeholder-gray-400"
              placeholder="Your city, state or region"
            />
          </div>

          {/* Bio */}
          <div className="mb-6">
            <label htmlFor="bio" className="block text-white font-semibold mb-2 text-lg">
              Short Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={3}
              className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-[#4a474b]/50 text-white placeholder-gray-400 resize-vertical"
              placeholder="A brief introduction about you"
            />
          </div>

          {/* Education */}
          <div className="mb-6">
            <label htmlFor="education" className="block text-white font-semibold mb-2 text-lg">
              Education
            </label>
            <input
              id="education"
              name="education"
              value={form.education || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-[#4a474b]/50 text-white placeholder-gray-400"
              placeholder="Your education details"
            />
          </div>

          {/* About Me */}
          <div className="mb-6">
            <label htmlFor="about" className="block text-white font-semibold mb-2 text-lg">
              About Me
            </label>
            <textarea
              id="about"
              name="about"
              value={form.about || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={3}
              className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-[#4a474b]/50 text-white placeholder-gray-400 resize-vertical"
              placeholder="Write something about yourself"
            />
          </div>

          {/* Profile Picture Upload */}
          <div className="mb-8">
            <label className="block text-white font-semibold mb-2 text-lg">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-[#4a474b]/50 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {form.profilePic && (
              <img
                src={form.profilePic}
                alt="Profile Preview"
                className="mt-4 w-24 h-24 object-cover rounded-full border-4 border-white mx-auto"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-white text-yellow-600 hover:bg-yellow-50 border border-yellow-200 hover:border-yellow-500 font-bold py-4 rounded-xl transition shadow-sm text-lg flex items-center justify-center gap-2"
          >
            <i className="fas fa-user-plus" />
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
