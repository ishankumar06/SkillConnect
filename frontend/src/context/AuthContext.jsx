

// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import api from "../api";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [authLoading, setAuthLoading] = useState(true);
//   const [token, setToken] = useState(localStorage.getItem("authToken") || null);
//   const [userId, setUserId] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         const now = Date.now() / 1000;
//         if (decoded.exp < now) {
//           logout();
//         } else {
//           setUserId(decoded._id || decoded.userId || null);
//           setUserRole(decoded.role || null);
//         }
//       } catch (err) {
//         console.error("Invalid token:", err);
//         logout();
//       }
//     } else {
//       setUserId(null);
//       setUserRole(null);
//     }
//     setAuthLoading(false);
//   }, [token]);

//   const login = (jwtToken) => {
//     localStorage.setItem("authToken", jwtToken);
//     setToken(jwtToken);
    
//     navigate("/");
//   };

//   const logout = () => {
//     localStorage.removeItem("authToken");
//     setToken(null);
//     navigate("/login");
//   };

//   return (
//     <AuthContext.Provider
//       value={{ authLoading, token, userId, userRole, login, logout }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);
// // ...existing code...

import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import axios from 'axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authLoading, setAuthLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("authToken") || localStorage.getItem("token") || null);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  // Decode token and update userId/userRole
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp < now) {
          logout();
        } else {
          setUserId(decoded._id || decoded.userId || null);
          setUserRole(decoded.role || null);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
      } catch (err) {
        console.error("Invalid token:", err);
        logout();
      }
    } else {
      setUserId(null);
      setUserRole(null);
      delete axios.defaults.headers.common["Authorization"];
    }
    setAuthLoading(false);
  }, [token]);

  // Check auth from backend and connect socket if valid
  const checkAuth = async () => {
  try {
    const token = localStorage.getItem('token') || '';  // or wherever you store your token
    const { data } = await axios.get('/api/auth/check', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('chicken', data);
    if (data.success) {
      setAuthUser(data.user);
      connectSocket(data.user);
    }
  } catch (error) {
    toast.error(error.message);
  }
};


  // Login function handling token, user data, socket, and navigation
  const login = async (stateOrToken, credentials) => {
    // Support both login with JWT token string or with state+credentials
    if (typeof stateOrToken === "string" && !credentials) {
      localStorage.setItem("authToken", stateOrToken);
      localStorage.setItem("token", stateOrToken);
      setToken(stateOrToken);
      navigate("/");
      return;
    }
    try {
      const { data } = await axios.post(`/api/auth/${stateOrToken}`, credentials);
      if (data.success) {
        setAuthUser(data.user);
        setToken(data.token);
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message);
        connectSocket(data.user);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Logout clearing tokens, user, socket, and redirecting to login
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    delete axios.defaults.headers.common["Authorization"];
    toast.success("Logged out successfully");
    if (socket) socket.disconnect();
    navigate("/login");
  };

  // Update profile with new user data
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Connect socket with auth token and listen for online users update
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(backendUrl, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  useEffect(() => {
    checkAuth();
  }, [token]);

  const value = {
    authLoading,
    token,
    userId,
    userRole,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
     axios,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

