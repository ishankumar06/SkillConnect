// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [isLoggedIn, setIsLoggedIn] = useState(
//     !!localStorage.getItem("isLoggedIn")
//   );
//   const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
//   const navigate = useNavigate();

//   // Sync state with localStorage on mount (e.g., after reload)
//   useEffect(() => {
//     const storedLogin = !!localStorage.getItem("isLoggedIn");
//     const storedUserId = localStorage.getItem("userId");
//     setIsLoggedIn(storedLogin);
//     setUserId(storedUserId);
//   }, []);

//   // Login function: stores login state and user ID, navigates to homepage
//   const login = (id) => {
//     if (!id) {
//       console.warn("login called without user ID.");
//       return;
//     }
//     localStorage.setItem("isLoggedIn", "true");
//     localStorage.setItem("userId", id);
//     setIsLoggedIn(true);
//     setUserId(id);
//     navigate("/"); // Redirect after login
//   };

//   // Logout function: clears stored login data and redirects to login page
//   const logout = () => {
//     localStorage.removeItem("isLoggedIn");
//     localStorage.removeItem("userId");
//     setIsLoggedIn(false);
//     setUserId(null);
//     navigate("/login"); // Redirect after logout
//   };

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, userId, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authLoading, setAuthLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

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
        }
      } catch (err) {
        console.error("Invalid token:", err);
        logout();
      }
    } else {
      setUserId(null);
      setUserRole(null);
    }
    setAuthLoading(false);
  }, [token]);

  const login = (jwtToken) => {
    localStorage.setItem("authToken", jwtToken);
    setToken(jwtToken);
    
    navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ authLoading, token, userId, userRole, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
// ...existing code...
