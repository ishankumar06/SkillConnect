import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { JobProvider } from "./context/JobContext";
import { UserProfileProvider } from "./context/UserProfileContext";
import { ApplicationProvider } from "./context/ApplicationContext";
import { UsersProvider } from "./context/UsersContext";
import { SavedPostsProvider } from "./context/SaveContext";  
import "./index.css";
import { ChatProvider } from "./context/ChatContext";


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
                     <App />
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
