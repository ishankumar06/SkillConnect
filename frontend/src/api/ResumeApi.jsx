// import axios from 'axios';

// const API_URL = 'http://localhost:4000/api/resumes'; 

// // Create new resume
// export const createResume = async (resumeData) => {
//   const response = await axios.post(API_URL, resumeData);
//   return response.data;
// };

// // Get all resumes
// export const getResumes = async () => {
//   const response = await axios.get(API_URL);
//   return response.data;
// };

// // Get resume by ID
// export const getResumeById = async (id) => {
//   const response = await axios.get(`${API_URL}/${id}`);
//   return response.data;
// };

// // Update resume by ID
// export const updateResume = async (id, resumeData) => {
//   const response = await axios.put(`${API_URL}/${id}`, resumeData);
//   return response.data;
// };

// // Delete resume by ID
// export const deleteResume = async (id) => {
//   const response = await axios.delete(`${API_URL}/${id}`);
//   return response.data;
// };

import axios from 'axios';

const API_URL = 'http://localhost:4000/api/resumes';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Optionally add auth token to request headers if stored in localStorage or context
const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // or get from your auth context/store
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Create new resume
export const createResume = async (resumeData) => {
  const response = await api.post('', resumeData, { headers: getAuthHeaders() });
  return response.data;
};

// Get all resumes
export const getResumes = async () => {
  const response = await api.get('', { headers: getAuthHeaders() });
  return response.data;
};

// Get resume by ID
export const getResumeById = async (id) => {
  const response = await api.get(`/${id}`, { headers: getAuthHeaders() });
  return response.data;
};

// Update resume by ID
export const updateResume = async (id, resumeData) => {
  const response = await api.put(`/${id}`, resumeData, { headers: getAuthHeaders() });
  return response.data;
};

// Delete resume by ID
export const deleteResume = async (id) => {
  const response = await api.delete(`/${id}`, { headers: getAuthHeaders() });
  return response.data;
};
