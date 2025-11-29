import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api"; // Your Axios setup

const UsersContext = createContext();

export function UsersProvider({ children }) {
  const [allUsers, setAllUsers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch users from backend
  const fetchUsers = async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await api.get("/users"); // include /api
    const usersArray = response.data.users || []; // handle wrapped payload

    const usersMap = usersArray.reduce((acc, user) => {
      acc[user._id] = user;
      return acc;
    }, {});

    setAllUsers(usersMap);
  } catch (err) {
    setError("Failed to load users");
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  // Add or update user via backend API
 const addOrUpdateUser = async (user) => {
  setLoading(true);
  setError(null);
  try {
    let response;

    if (user._id) {
      // update existing user
      response = await api.put(`/users/${user._id}`, user);
    } else {
      // create new user
      response = await api.post("/api/users", user);
    }

    const savedUser = response.data.user || response.data; // handle both shapes

    setAllUsers((prev) => ({
      ...prev,
      [savedUser._id]: savedUser,
    }));
  } catch (err) {
    setError("Failed to save user");
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  // Remove user by ID via backend
  const removeUser = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/users/${userId}`);
      setAllUsers((prev) => {
        const copy = { ...prev };
        delete copy[userId];
        return copy;
      });
    } catch (err) {
      setError("Failed to remove user");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Clear all users locally
  const clearUsers = () => {
    setAllUsers({});
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UsersContext.Provider
      value={{
        allUsers,
        loading,
        error,
        fetchUsers,
        addOrUpdateUser,
        removeUser,
        clearUsers,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
}
