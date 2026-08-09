import mongoose from "mongoose";

// Connection string used to connect the application to MongoDB.
const MONGODB_URI = process.env.MONGODB_URI!;

// Stop application startup if database configuration is missing.
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing");
}

// Creates a MongoDB connection when needed.
// Reuses an existing connection whenever possible.
export async function connectDB() {
  try {
    // Prevent opening multiple database connections.
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    // Establish a new connection to MongoDB.
    await mongoose.connect(MONGODB_URI);

    // Helpful during development to confirm connection success.
    console.log("MongoDB Connected");
  } catch (error) {
    // Surface connection problems immediately.
    console.error("MongoDB Connection Error:", error);
    throw error;
  }
}
