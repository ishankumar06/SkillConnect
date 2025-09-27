import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from '../context/AuthContext';
import { toast } from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios, authUser } = useContext(AuthContext);

  // Fetch all users for the sidebar
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.message || "Failed to load users");
    }
  };

  // Fetch messages for the selected user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
      
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message || "Failed to load messages");
    }
  };

  // Send message to selected user, enrich newMessage with sender profilePic
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
        setMessages(prevMessages => [...prevMessages, enrichedNewMessage]);
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch (error) {
      toast.error(error.message || "Failed to send message");
    }
  };

  // Subscribe to new messages from socket and enrich sender profile pic before adding
  const subscribeToMessages = () => {
    if (!socket) return;
    socket.on("newMessage", (newMessage) => {
      // Find sender in users or use authUser if it matches
      const senderUser = users.find(u => u._id === newMessage.senderId) 
        || (authUser && authUser._id === newMessage.senderId ? authUser : null);

      const enrichedMessage = {
        ...newMessage,
        senderProfilePic: senderUser?.profilePic || null,
      };

      if (selectedUser && newMessage.senderId === selectedUser._id) {
        enrichedMessage.seen = true;
        setMessages(prevMessages => [...prevMessages, enrichedMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`).catch(() => {
          toast.error("Failed to mark message as seen");
        });
      } else {
        setUnseenMessages(prev => ({
          ...prev,
          [newMessage.senderId]: prev[newMessage.senderId] ? prev[newMessage.senderId] + 1 : 1,
        }));
      }
    });
  };

  // Unsubscribe from socket messages
  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    getUsers,
    getMessages,
    sendMessage,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
