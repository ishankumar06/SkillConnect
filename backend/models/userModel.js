
// import mongoose from "mongoose";
// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//     password: { type: String, required: true },
//     contact: { type: String, trim: true },
//     role: { type: String, enum: ["jobseeker", "employer", "admin"], required: true },
//     location: { type: String, trim: true },
//     bio: { type: String, trim: true },
//     about: { type: String, trim: true },
//     profilePic: { type: String, default: "" },
//     bgImage: { type: String, default: "" },  // <-- ADD THIS LINE HERE
//     connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//     savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
//     appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
//   },
//   { timestamps: true }
// );

// export default mongoose.model("User", userSchema);


import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    name: { type: String, trim: true }, // optional if you want both fullName and name
    password: { type: String, required: true, minlength: 6 },
    contact: { type: String, trim: true },
    role: { type: String, enum: ["jobseeker", "employer", "admin"], required: true },
    location: { type: String, trim: true },
    bio: { type: String, trim: true },
    about: { type: String, trim: true },
    profilePic: { type: String, default: "" },
    bgImage: { type: String, default: "" },
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
