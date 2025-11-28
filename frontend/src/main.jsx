// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import { BrowserRouter } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext";  // ✅ Import useAuth
// import { JobProvider } from "./context/JobContext";
// import { UserProfileProvider } from "./context/UserProfileContext";
// import { ApplicationProvider } from "./context/ApplicationContext";
// import { UsersProvider } from "./context/UsersContext";
// import { SavedPostsProvider } from "./context/SaveContext";  
// import { ChatProvider } from "./context/ChatContext";
// import { NotificationProvider } from "./context/NotificationContext";
// import "./index.css";


// function AppWithProviders() {
//   const { token } = useAuth(); 
  
//   return (
//     <NotificationProvider token={token}>  
//       <App />
//     </NotificationProvider>
//   );
// }

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <div className="app-global-bg">
//         <AuthProvider>
//           <JobProvider>
//             <UserProfileProvider>
//               <ApplicationProvider>
//                 <UsersProvider>
//                   <SavedPostsProvider>
//                     <ChatProvider>
//                       <AppWithProviders />  
//                     </ChatProvider>
//                   </SavedPostsProvider>
//                 </UsersProvider>
//               </ApplicationProvider>
//             </UserProfileProvider>
//           </JobProvider>
//         </AuthProvider>
//       </div>
//     </BrowserRouter>
//   </React.StrictMode>
// );

 import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { JobProvider, useJob } from "./context/JobContext";                    
import { UserProfileProvider, useUserProfile } from "./context/UserProfileContext";
import { ApplicationProvider, useApplication } from "./context/ApplicationContext"; 
import { UsersProvider, useUsers } from "./context/UsersContext";
import { SavedPostsProvider, useSavedPosts } from "./context/SaveContext";
import { ChatProvider, useChat } from "./context/ChatContext";
import { NotificationProvider } from "./context/NotificationContext";
import "./index.css";

function DataPreloader({ children }) {
  const { token } = useAuth();
  const { fetchJobs } = useJob();                  
  const { fetchProfile } = useUserProfile();
  const { fetchApplications } = useApplication();    
  const { fetchUsers } = useUsers();
  const { fetchSavedPosts } = useSavedPosts();
  const { fetchChats } = useChat();

  useEffect(() => {
    if (!token) return;
    
    console.log(" PRELOADING ALL DATA...");
    Promise.allSettled([
      fetchJobs?.(),
      fetchProfile?.(),
      fetchApplications?.(),
      fetchUsers?.(),
      fetchSavedPosts?.(),
      fetchChats?.()
    ]).then((results) => {
      console.log(" PRELOAD COMPLETE:", results.map(r => r.status));
    });
  }, [token]);

  return children;
}

function AppWithProviders() {
  const { token } = useAuth();
  return (
    <NotificationProvider token={token}>
      <DataPreloader>
        <App />
      </DataPreloader>
    </NotificationProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <div className="app-global-bg">
        <AuthProvider>
          <JobProvider>
            <UserProfileProvider>
              <ApplicationProvider>
                <UsersProvider>
                  <SavedPostsProvider>
                    <ChatProvider>
                      <AppWithProviders />
                    </ChatProvider>
                  </SavedPostsProvider>
                </UsersProvider>
              </ApplicationProvider>
            </UserProfileProvider>
          </JobProvider>
        </AuthProvider>
      </div>
    </BrowserRouter>
  </React.StrictMode>
);
