import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUserProfile } from "../context/UserProfileContext";
import { useUsers } from "../context/UsersContext";
import api from "../api";
import skillLogo from "../assets/skill.png";
import bgImage from '../assets/bgImage.png';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const { setProfile } = useUserProfile();
  const { addOrUpdateUser } = useUsers();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter email & password ❌");
      return;
    }

    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      localStorage.setItem("authToken", token);
      login(token);

      setProfile(user);
      addOrUpdateUser(user);

      console.log("Navigating to home...");
      navigate("/");
      console.log("Navigation called");
    } catch (error) {
      alert("Invalid email or password");
      console.error(error);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute top-4 left-4 z-20">
        <img src={skillLogo} alt="SkillConnect Logo" className="h-12 w-auto drop-shadow-lg" />
      </div>

      <div className="w-full max-w-md bg-[#403d41] rounded-3xl p-8 border-l-8 border-black-300 z-10" style={{ boxShadow: "0 6px 24px 0 #e4ebfd" }}>
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          SkillConnect Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-[#4a474b]/50 text-white placeholder-gray-400 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-[#4a474b]/50 text-white placeholder-gray-400 transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-yellow-600 hover:bg-yellow-50 border border-yellow-200 hover:border-yellow-500 text-white py-3 rounded-xl transition font-bold shadow-sm flex items-center justify-center gap-2"
          >
            <i className="fas fa-sign-in-alt" />
            Login
          </button>
        </form>
        <p className="text-sm text-gray-300 mt-6 text-center">
          Don't have an account?{" "}
          <a href="/signup" className="text-white hover:underline font-semibold">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
