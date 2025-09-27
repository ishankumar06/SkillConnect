import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUserProfile } from "../context/UserProfileContext";
import { useUsers } from "../context/UsersContext";
import api from "../api";
import skillLogo from "../assets/skill.png";

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
      // alert("Login successful");
      
    } catch (error) {
      alert("Invalid email or password");
      console.error(error);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="absolute top-4 left-4">
        <img src={skillLogo} alt="SkillConnect Logo" className="h-12 w-auto" />
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 z-10">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          SkillConnect Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-2 border rounded-xl focus:ring focus:ring-blue-200 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full mt-1 px-4 py-2 border rounded-xl focus:ring focus:ring-blue-200 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}