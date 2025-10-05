import Message from "../models/Message.js";
import User from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";

import { io, userSocketMap, emitNotificationToUser } from "../server.js";
import { createNotification } from "../config/createNotification.js"; 

// get all users except the logged in user
export const getUsersForSidebar = async (req, res) => {
  console.log("getUsersForSidebar controller called");
  try {
    const userId = req.user.userId;

    console.log("Logged in user ID:", userId);

    const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");
    console.log("Number of other users found:", filteredUsers.length);

    const unseenMessages = {};
    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({ senderId: user._id, receiverId: userId, seen: false });
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });
    await Promise.all(promises);

    res.json({ success: true, users: filteredUsers, unseenMessages });
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// api to mark message as seen using message id
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    console.log("Message marked as seen:", id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error in markMessageAsSeen:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// getMessages controller
export const getMessages = async (req, res) => {
  console.log("getMessages called");
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user.userId;
    console.log("Fetching messages between:", myId, "and", selectedUserId);

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId }
      ]
    }).populate({ path: "senderId", model: "User", select: "profilePic fullName" });

    await Message.updateMany({ senderId: selectedUserId, receiverId: myId, seen: false }, { $set: { seen: true } });

    console.log("Messages retrieved:", messages.length);
    res.json({ success: true, messages });
  } catch (error) {
    console.error("Error in getMessages:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// sendMessage controller with notifications and socket emission, includes redirect link to chat
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user.userId;
    console.log("Sending message from:", senderId, "to:", receiverId);

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, { folder: "chatapp" });
      imageUrl = uploadResponse.secure_url;
      console.log("Image uploaded:", imageUrl);
    }
    let newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl
    });

    newMessage = await newMessage.populate({ path: "senderId", model: "User", select: "profilePic fullName" });

    // Create notification with redirect link to chat page
    const notification = await createNotification({
      userId: receiverId,
      type: "message",
      fromUserId: senderId,
      message: `New message from ${newMessage.senderId.fullName}`,
      link: `/chat/${senderId}`,
    });

    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
      emitNotificationToUser(receiverId.toString(), notification);
      console.log("Emitted newMessage and newNotification to socket:", receiverSocketId);
    }

    res.json({ success: true, newMessage });
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


