import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/Rightsidebar";
import Header from "./components/Header";
import Home from "@/pages/Home";
import About from "@/pages/About";
import JobSearch from "@/pages/JobSearch";
import JobList from "@/pages/JobList";
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

import HomeResume from "./components/HomeResume";
import Resume from "./components/Resume";
import ErrorPage from "./components/ErrorPage";
import JobDetail from "./pages/JobDetail";

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
      <div className="flex flex-1 ">
        <aside className="sticky top-16 h-[calc(100vh-4rem)]  bg-gray-50 ">
          <Sidebar />
        </aside>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
        <aside className="sticky top-16 h-[calc(100vh-4rem)]  bg-gray-50 ">
          <RightSidebar />
        </aside>
      </div>
    </div>
  );
}

export default function App() {
  return (
    
      <Routes>
        {/* New appended public routes */}
        <Route path="/homeresume" element={<HomeResume />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/error" element={<ErrorPage />} />

        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Main Protected App */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <ProtectedLayout />
            </ProtectedRoute>
          }
        >
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
          <Route path="chat/:id" element={<Messaging />} />
          <Route path="jobs/:id" element={<JobList />} />
          
          <Route path="job/:id" element={<JobDetail />} />
          <Route path="messaging" element={<Messaging />} />
          <Route path="applied" element={<Applied />} />
           <Route path="profile/:userId" element={<Profile />} />
           
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>


        <Route path="*" element={<ErrorPage />} />
      </Routes>
   
  );
}

