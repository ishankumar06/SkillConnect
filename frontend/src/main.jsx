import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { JobProvider } from "./context/JobContext";
import { UserProfileProvider } from "./context/UserProfileContext";
import { ApplicationProvider } from "./context/ApplicationContext";
import { UsersProvider } from "./context/UsersContext";
import { SavedPostsProvider } from "./context/SaveContext";  
import { ChatProvider } from "./context/ChatContext";
import { NotificationProvider } from "./context/NotificationContext"; // import your NotificationProvider
import "./index.css";

// Wrapper component to consume auth token and pass to NotificationProvider
function AppWithNotificationProvider() {
  const { token } = useAuth(); // Adjust based on your AuthContext API

  return (
    <NotificationProvider token={token}>
      <App />
    </NotificationProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <JobProvider>
          <UserProfileProvider>
            <ApplicationProvider>
              <UsersProvider>
                <SavedPostsProvider>
                  <ChatProvider>
                    <AppWithNotificationProvider />
                  </ChatProvider>
                </SavedPostsProvider>
              </UsersProvider>
            </ApplicationProvider>
          </UserProfileProvider>
        </JobProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
