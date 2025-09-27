import Message from "../models/Message.js";
import User from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";

import { io, userSocketMap } from "../server.js";

// get all users except the logged in user
export const getUsersForSidebar = async (req, res) => {
  console.log("getUsersForSidebar controller called");
  try {
    const userId = req.user.userId;  // use userId

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

// get all messages for selected user
// export const getMessages = async (req, res) => {
//   console.log("getMessages called");
//   try {
//     const { id: selectedUserId } = req.params;
//     const myId = req.user.userId;  // use userId
//     console.log("Fetching messages between:", myId, "and", selectedUserId);

//     const messages = await Message.find({
//       $or: [
//         { senderId: myId, receiverId: selectedUserId },
//         { senderId: selectedUserId, receiverId: myId }
//       ]
//     });

//     await Message.updateMany({ senderId: selectedUserId, receiverId: myId, seen: false }, { $set: { seen: true } });

//     console.log("Messages retrieved:", messages.length);
//     res.json({ success: true, messages });
//   } catch (error) {
//     console.error("Error in getMessages:", error.message);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

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

// send message to selected user
// export const sendMessage = async (req, res) => {
//   try {
//     const { text, image } = req.body;
//     const receiverId = req.params.id;
//     const senderId = req.user.userId;  // use userId
//     console.log("Sending message from:", senderId, "to:", receiverId);

//     let imageUrl;
//     if (image) {
//       const uploadResponse = await cloudinary.uploader.upload(image, {
//         folder: "chatapp"
//       });
//       imageUrl = uploadResponse.secure_url;
//       console.log("Image uploaded:", imageUrl);
//     }
//     const newMessage = await Message.create({
//       senderId, receiverId, text, image: imageUrl
//     });

//     // emit the message to receiver if online
//     const receiverSocketId = userSocketMap[receiverId];
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("newMessage", newMessage);
//       console.log("Emitted newMessage to socket:", receiverSocketId);
//     }

//     res.json({ success: true, newMessage });
//   } catch (error) {
//     console.error("Error in sendMessage:", error.message);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
// getMessages controller (populate senderId with profilePic and fullName)
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

// sendMessage controller
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user.userId;
    console.log("Sending message from:", senderId, "to:", receiverId);

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "chatapp"
      });
      imageUrl = uploadResponse.secure_url;
      console.log("Image uploaded:", imageUrl);
    }
    let newMessage = await Message.create({
      senderId, receiverId, text, image: imageUrl
    });

    newMessage = await newMessage.populate({ path: "senderId", model: "User", select: "profilePic fullName" });

    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
      console.log("Emitted newMessage to socket:", receiverSocketId);
    }

    res.json({ success: true, newMessage });
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


