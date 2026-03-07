// MongoDB connection helper with caching for the Next.js server runtime.
import mongoose from "mongoose";

/**
 * MongoDB Connection with caching for serverless environments
 * Single responsibility: Manage database connection
 */

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached = global.mongoose ?? (global.mongoose = { conn: null, promise: null });

/**
 * Connect to MongoDB with connection caching
 * - Returns cached connection if available
 * - Creates new connection if needed
 * - Throws error if MONGODB_URI not defined
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  // Return cached connection if exists
  if (cached.conn) {
    return cached.conn;
  }

  // Get URI from environment
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not defined.");
  }

  // Create connection promise if not exists
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
    });
  }

  // Wait for connection
  cached.conn = await cached.promise;
  return cached.conn;
}
