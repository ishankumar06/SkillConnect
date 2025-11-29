import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios, authUser } = useContext(AuthContext);

  const fetchChatUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users); 
        setUnseenMessages(data.unseenMessages);
        console.log(" Chat users loaded:", data.users.length);
      }
    } catch (error) {
      console.error("Failed to load chat users:", error);
    }
  };

  const getUsers = fetchChatUsers;

  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error("Failed to load messages");
    }
  };

  const sendMessage = async (messageData) => {
    if (!selectedUser) {
      toast.error("No user selected");
      return;
    }
    try {
      const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
      if (data.success) {
        const enrichedNewMessage = {
          ...data.newMessage,
          senderProfilePic: authUser?.profilePic || null,
        };
        setMessages((prevMessages) => [...prevMessages, enrichedNewMessage]);
      }
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const subscribeToMessages = () => {
    if (!socket) return;
    
    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        // Current chat - add to messages
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`).catch(() => {});
      } else {
        // Other chat - increment unseen
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
        }));
      }
      
      // Refresh chat users list
      fetchChatUsers();
    });
  };

  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
    return unsubscribeFromMessages;
  }, [socket, selectedUser]); 

  const unreadCount = Object.values(unseenMessages).reduce((total, count) => total + count, 0);

  const value = {
    messages,
    users,
    selectedUser,
    setSelectedUser,
    getUsers,
    getMessages,
    sendMessage,
    unseenMessages,
    setUnseenMessages,
    unreadCount,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
