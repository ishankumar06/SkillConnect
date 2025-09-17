// import React, { createContext, useContext, useState, useEffect } from "react";

// const UsersContext = createContext();
// const LOCAL_STORAGE_KEY = "users_data";


// const dummyUsers = {
//   "1": {
//     id: "1",
//     name: "Ishan Kumar",
//     role: "Frontend Developer",
//     profilePic: "https://randomuser.me/api/portraits/men/11.jpg",
//   },
//   "2": {
//     id: "2",
//     name: "Sara Patel",
//     role: "Product Manager",
//     profilePic: "https://randomuser.me/api/portraits/women/21.jpg",
//   },
//   "3": {
//     id: "3",
//     name: "Hana Sharma",
//     role: "UI/UX Designer",
//     profilePic: "https://randomuser.me/api/portraits/women/31.jpg",
//   },
//   "4": {
//     id: "4",
//     name: "Abhiraj Singh",
//     role: "Backend Engineer",
//     profilePic: "https://randomuser.me/api/portraits/men/41.jpg",
//   },
//   "5": {
//     id: "5",
//     name: "Sagar Mehta",
//     role: "Data Scientist",
//     profilePic: "https://randomuser.me/api/portraits/men/51.jpg",
//   },
//   "6": {
//     id: "6",
//     name: "Neha Gupta",
//     role: "Marketing Specialist",
//     profilePic: "https://randomuser.me/api/portraits/women/45.jpg",
//   },
//   "7": {
//     id: "7",
//     name: "Rahul Joshi",
//     role: "Full Stack Developer",
//     profilePic: "https://randomuser.me/api/portraits/men/60.jpg",
//   },
//   "8": {
//     id: "8",
//     name: "Ananya Desai",
//     role: "Graphic Designer",
//     profilePic: "https://randomuser.me/api/portraits/women/52.jpg",
//   },
//   "9": {
//     id: "9",
//     name: "Karan Kapoor",
//     role: "DevOps Engineer",
//     profilePic: "https://randomuser.me/api/portraits/men/64.jpg",
//   },
//   "10": {
//     id: "10",
//     name: "Pooja Reddy",
//     role: "Content Writer",
//     profilePic: "https://randomuser.me/api/portraits/women/54.jpg",
//   },
//   "11": {
//     id: "11",
//     name: "Vikram Malhotra",
//     role: "Mobile Developer",
//     profilePic: "https://randomuser.me/api/portraits/men/66.jpg",
//   },
//   "12": {
//     id: "12",
//     name: "Deepika Verma",
//     role: "HR Manager",
//     profilePic: "https://randomuser.me/api/portraits/women/58.jpg",
//   },
//   "13": {
//     id: "13",
//     name: "Manish Chauhan",
//     role: "Software Architect",
//     profilePic: "https://randomuser.me/api/portraits/men/70.jpg",
//   },
//   "14": {
//     id: "14",
//     name: "Ritu Jain",
//     role: "Business Analyst",
//     profilePic: "https://randomuser.me/api/portraits/women/60.jpg",
//   },
//   "15": {
//     id: "15",
//     name: "Siddharth Bhatt",
//     role: "Cybersecurity Expert",
//     profilePic: "https://randomuser.me/api/portraits/men/73.jpg",
//   },
//   "16": {
//     id: "16",
//     name: "Shreya Nair",
//     role: "Quality Assurance",
//     profilePic: "https://randomuser.me/api/portraits/women/63.jpg",
//   },
//   "17": {
//     id: "17",
//     name: "Amit Deshmukh",
//     role: "Project Manager",
//     profilePic: "https://randomuser.me/api/portraits/men/75.jpg",
//   },
//   "18": {
//     id: "18",
//     name: "Mira Dutt",
//     role: "UX Researcher",
//     profilePic: "https://randomuser.me/api/portraits/women/66.jpg",
//   },
//   "19": {
//     id: "19",
//     name: "Rohan Singh",
//     role: "Cloud Engineer",
//     profilePic: "https://randomuser.me/api/portraits/men/80.jpg",
//   },
//   "20": {
//     id: "20",
//     name: "Kavita Sharma",
//     role: "Marketing Manager",
//     profilePic: "https://randomuser.me/api/portraits/women/68.jpg",
//   },
// };

// /**
//  * UsersProvider manages global user profiles.
//  * Provides allUsers, addOrUpdateUser, removeUser, clearUsers functions.
//  */
// export function UsersProvider({ children }) {
//   const [allUsers, setAllUsers] = useState(() => {
//     // Initialize from localStorage or dummyUsers
//     const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
//     return stored ? JSON.parse(stored) : dummyUsers;
//   });

//   // Sync allUsers to localStorage on any change
//   useEffect(() => {
//     localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allUsers));
//   }, [allUsers]);

//   const addOrUpdateUser = (user) => {
//     if (!user || !user._id) {
//       console.warn("Invalid user profile passed to addOrUpdateUser:", user);
//       return;
//     }
//     setAllUsers((prev) => ({ ...prev, [user._id]: user }));
//   };

//   const removeUser = (userId) => {
//     setAllUsers((prev) => {
//       if (!prev[userId]) return prev;
//       const newUsers = { ...prev };
//       delete newUsers[userId];
//       return newUsers;
//     });
//   };

//   const clearUsers = () => {
//     setAllUsers({});
//   };

//   return (
//     <UsersContext.Provider
//       value={{ allUsers, addOrUpdateUser, removeUser, clearUsers }}
//     >
//       {children}
//     </UsersContext.Provider>
//   );
// }

// export function useUsers() {
//   const context = useContext(UsersContext);                      //      extrra validity check iiiiiisssss
//   if (context === undefined) {
//     throw new Error("useUsers must be used within a UsersProvider");
//   }
//   return context;
// }

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
      const response = await api.get("/users");
      // Convert array to object map by id for consistency
      const usersMap = response.data.reduce((acc, user) => {
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
        response = await api.put(`/users/${user._id}`, user);
      } else {
        response = await api.post("/users", user);
      }
      setAllUsers((prev) => ({
        ...prev,
        [response.data._id]: response.data,
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
