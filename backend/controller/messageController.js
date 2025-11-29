import mongoose from "mongoose";
import Message from "../models/Message.js";
import User from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";
import { io, userSocketMap, emitNotificationToUser } from "../server.js";
import { createNotification } from "../config/createNotification.js";

export const getUsersForSidebar = async (req, res) => {
  console.log("getUsersForSidebar controller called");
  try {
    const userId = req.user.userId;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const chatUsersAggregation = await Message.aggregate([
  {
    $match: {
      $or: [
        { senderId: userObjectId },
        { receiverId: userObjectId }
      ]
    }
  },
  // sort messages newest → oldest
  { $sort: { createdAt: -1 } },
  {
    $group: {
      _id: {
        $cond: [
          { $eq: ["$senderId", userObjectId] },
          "$receiverId",
          "$senderId"
        ]
      },
      lastMessageTime: { $first: "$createdAt" }
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  {
    $match: {
      "user._id": { $ne: userObjectId }
    }
  },
  {
    $project: {
      _id: "$user._id",
      fullName: "$user.fullName",
      profilePic: "$user.profilePic",
      role: "$user.role",
      email: "$user.email",
      lastMessageTime: 1
    }
  },
  // final sort by latest message time
  { $sort: { lastMessageTime: -1 } }
]);


    const chatUsers = chatUsersAggregation.map(u => ({
      ...u,
      hasChatted: true
    }));

    const unseenMessagesAggregation = await Message.aggregate([
      {
        $match: {
          receiverId: userObjectId,
          seen: false
        }
      },
      {
        $group: {
          _id: "$senderId",
          count: { $sum: 1 }
        }
      }
    ]);

    const unseenMessages = {};
    unseenMessagesAggregation.forEach(({ _id, count }) => {
      unseenMessages[_id.toString()] = count;
    });

    console.log("Chat users found:", chatUsers.length);
    res.json({
      success: true,
      users: chatUsers,
      unseenMessages
    });
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

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

    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId, seen: false },
      { $set: { seen: true } }
    );

    console.log("Messages retrieved:", messages.length);
    res.json({ success: true, messages });
  } catch (error) {
    console.error("Error in getMessages:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

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

    newMessage = await newMessage.populate({
      path: "senderId",
      model: "User",
      select: "profilePic fullName"
    });

    const notification = await createNotification({
      userId: receiverId,
      type: "message",
      fromUserId: senderId,
      message: `New message from ${newMessage.senderId.fullName}`,
      link: `/chat/${senderId}`
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


