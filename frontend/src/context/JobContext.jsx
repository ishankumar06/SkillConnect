// JobContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api";

const JobContext = createContext();

export function JobProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/jobs");
      setJobs(response.data);
    } catch (err) {
      setError("Failed to load jobs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addJob = useCallback(
    async (jobData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post("/jobs", jobData);
        console.log(response);
        setJobs((prev) => [...prev, response.data]);
      } catch (err) {
        setError("Failed to add job");
        console.error("Add job error:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const removeJob = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        await api.delete(`/jobs/${id}`);
        setJobs((prev) => prev.filter((job) => job._id !== id));
      } catch (err) {
        setError("Failed to delete job");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateJob = useCallback(
    async (id, updatedJob) => {
      setLoading(true);
      setError(null);
      setJobs((prev) => prev.map((job) => (job._id === id ? { ...job, ...updatedJob } : job)));
      try {
        const response = await api.put(`/jobs/${id}`, updatedJob);
        setJobs((prev) => prev.map((job) => (job._id === id ? response.data : job)));
      } catch (err) {
        setError("Failed to update job");
        console.error(err);
        fetchJobs();
      } finally {
        setLoading(false);
      }
    },
    [fetchJobs]
  );

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <JobContext.Provider value={{ jobs, loading, error, addJob, removeJob, updateJob, fetchJobs }}>
      {children}
    </JobContext.Provider>
  );
}

export function useJob() {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error("useJob must be used within JobProvider");
  }
  return context;
}
