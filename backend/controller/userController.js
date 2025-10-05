import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";



// Register a new user
export const registerUser = async (req, res) => {
  const { fullName, email, password, role, contact, location, bio, education, about, profilePic } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    user = new User({
      fullName,
      email,
      password: hashedPass,
      role,
      contact,
      location,
      bio,
      education,
      about,
      profilePic,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};


// User login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};


// Get user profile - using userId from auth middleware
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};


// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};


// Get current user's profile
export const getCurrentUserProfile = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};


// Update user by ID
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (req.user?.userId !== userId && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true }).select("-password");
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};


// Check authentication


export const checkAuth = async (req, res) => {
  try {
    if (!req.user) {
      console.error('checkAuth error: req.user is undefined');
      return res.status(401).json({ success: false, message: 'No authenticated user found' });
    }
    const userId = req.user.userId || req.user._id;
    if (!userId) {
      console.error('checkAuth error: userId missing in req.user');
      return res.status(401).json({ success: false, message: 'User ID missing in token' });
    }
    const user = await User.findById(userId).select("-password");

    if (!user) {
      console.error('checkAuth error: user not found in DB');
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('checkAuth unexpected error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// Update logged-in user's profile
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;

    const userId = req.user._id;
    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(userId, { bio, fullName }, { new: true });
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(userId, { profilePic: upload.secure_url, bio, fullName }, { new: true });
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

