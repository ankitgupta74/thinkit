import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.44.42.63"],
  // Allow Next/Image to load images from trusted external sources.
  images: {
    remotePatterns: [
      // Product/demo images stored on GitHub.
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      // Uploaded product images served from Cloudinary.
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
