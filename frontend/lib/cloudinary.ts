import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary using credentials stored in environment variables.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Shared Cloudinary instance used throughout the application.
export default cloudinary;
