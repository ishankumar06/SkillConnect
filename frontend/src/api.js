import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

// Add token from localStorage or context to headers if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken"); // Your token storage may differ
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
