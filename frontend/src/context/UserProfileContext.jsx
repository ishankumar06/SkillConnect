import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api"; // Import your pre-configured axios instance from api.js

const UserProfileContext = createContext();

export function UserProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user profile from backend on mount
  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/users/profile");
      console.log("ishannnnnn",response.data);
      setProfile(response.data);
    } catch (err) {
      setError("Failed to load user profile");
      console.error(err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Partially or fully update profile on backend
  const updateProfile = async (updatedFields) => {
    console.log("singh2",updatedFields);
    setLoading(true);
    setError(null);
    try {
      const currentUserId = profile?._id;
      const response = 
await api.put(`/users/${currentUserId}`, updatedFields);
      console.log("singh",response.data);
      setProfile(response.data);
    } catch (err) {
      setError("Failed to update profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Clear profile (e.g., on logout)
  const clearProfile = () => {
    setProfile(null);
  };

  // Fetch profile once on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <UserProfileContext.Provider
      value={{ profile, loading, error, setProfile, updateProfile, clearProfile, fetchProfile }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export const useUserProfile = () => useContext(UserProfileContext);
