import { v2 as cloudinary } from "cloudinary";

export const initCloudinary = () => {
  if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_SECRET_KEY) {
    throw new Error("Cloudinary environment variables missing!");
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });
  console.log("Cloudinary initialized");
};

export default cloudinary;
