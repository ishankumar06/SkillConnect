import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api"; 

const ApplicationContext = createContext();

export function ApplicationProvider({ children }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all applications for logged-in user (or all if admin)
  const fetchApplications = useCallback(async (jobId) => {
  setLoading(true);
  setError(null);
  try {
    const url = jobId ? `/applications/job/${jobId}` : "/applications";
    const response = await api.get(url);
    console.log("Full response", response);
    console.log("Applications data:", response.data);
    setApplications(response.data || []);
  } catch (err) {
    setError("Failed to load applications");
    console.error(err);
    setApplications([]);
  } finally {
    setLoading(false);
  }
}, []);


  // Apply to a job (POST)
const applyToJob = async (jobId, resumeFile, name, about, skills) => { 
  setLoading(true);
  setError(null);
  try {
    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("name", name);
    formData.append("about", about);

    if (resumeFile) {
      formData.append("resume", resumeFile);
    }

    if (skills && Array.isArray(skills) && skills.length) {
      
      formData.append("skills", JSON.stringify(skills));
    }

 
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const response = await api.post("/applications/apply", formData, {

      headers: {
    
      },
    });

    await fetchApplications(); // refresh list after apply
    console.log("Applications data:", response.data);

    return response.data;
  } catch (err) {
    setError("Failed to apply to job");
    console.error("ApplyToJob error:", err.response ? err.response.data : err);
    throw err;
  } finally {
    setLoading(false);
  }
};

  // Update application status (PUT)
  const updateApplicationStatus = async (applicationId, status) => {
    setLoading(true);
    setError(null);
    try {
      await api.put(`/applications/${applicationId}/status`, { status });
      await fetchApplications();
    } catch (err) {
      setError("Failed to update application status");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Remove application (DELETE)
  const removeApplication = async (applicationId) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/applications/${applicationId}`);
      setApplications((prev) => prev.filter((app) => app._id !== applicationId));
    } catch (err) {
      setError("Failed to remove application");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch applications once on component mount
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        loading,
        error,
        applyToJob,
        updateApplicationStatus,
        removeApplication,
        fetchApplications,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}

// Custom hook for easy usage
export function useApplication() {
  return useContext(ApplicationContext);
}
