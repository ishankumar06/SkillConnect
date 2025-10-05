import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/Rightsidebar";
import Header from "./components/Header";


import Home from "@/pages/Home";
import About from "@/pages/About";
import JobSearch from "@/pages/JobSearch";
import JobList from "@/pages/JobList";
// import MyProfile from "@/pages/MyProfile";
import Notifications from "@/pages/Notifications";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import Signup from "@/pages/SignUp";
import PostSection from "./components/PostSection";
import Connection from "./components/Connection";
import YouKnow from "./components/YouKnow";
import Promotion from "./components/Promotion";
import Apply from "./components/Apply";
import Applicants from "./components/Applicants";
import Messaging from "./components/Messaging";
import Applied from "@/pages/Applied";
import Save from "@/pages/Save";  

function ProtectedRoute({ children }) {
  const { token, authLoading } = useAuth();
  if (authLoading) return null; 
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function ProtectedLayout() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="sticky top-0 z-50">
        <Header />
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 bg-gray-50 overflow-auto">
          <Sidebar />
        </aside>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

        <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 bg-gray-50 overflow-auto">
          <RightSidebar />
        </aside>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
  {/* Public routes */}
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />

  {/* Protected routes */}
  <Route
    path="/*"
    element={
      <ProtectedRoute>
        <ProtectedLayout />
      </ProtectedRoute>
    }
  >
    {/* Root redirect to home */}
    <Route index element={<Home />} />
    <Route path="about" element={<About />} />
    <Route path="jobsearch" element={<JobSearch />} />
    <Route path="joblist" element={<JobList />} />
    <Route path="notifications" element={<Notifications />} />
    <Route path="profile" element={<Profile />} />
    <Route path="postsection" element={<PostSection />} />
    <Route path="connections" element={<Connection />} />
    <Route path="youknow" element={<YouKnow />} />
    <Route path="promotion" element={<Promotion />} />
    <Route path="save" element={<Save />} />
    <Route path="apply/:id" element={<Apply />} />
    <Route path="applicants/:jobId" element={<Applicants />} />

    {/* Add chat route here BEFORE the catch-all */}
    <Route path="chat/:id" element={<Messaging />} />
    <Route path="jobs/:id" element={<JobList />} />
    <Route path="job/:id" element={<JobSearch/>} />
     

    <Route path="messaging" element={<Messaging />} />
    <Route path="applied" element={<Applied />} />

    {/* Catch-all: redirect unknown protected URLs to home */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Route>

  {/* Catch-all for any non-auth routes: redirect to login */}
  <Route path="*" element={<Navigate to="/login" replace />} />
</Routes>

  );
}
