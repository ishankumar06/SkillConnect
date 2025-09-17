import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register a new user
export const registerUser = async (req, res) => {
  const { name, email, password, role, contact, location, bio, education, about, profilePic } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    user = new User({
      name,
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

// Get user profile - UPDATED to get id from auth middleware (req.user)
export const getUserProfile = async (req, res) => {
  try {
    // Use userId from authenticated token (must be set by auth middleware)
    const userId = req.user?.userId || req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    console.log(user)
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};



// Get all users (for suggestions, etc.)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Get current user's profile (for /api/users/profile)
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
    // Only allow update if user is self or admin (add your own logic)
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
